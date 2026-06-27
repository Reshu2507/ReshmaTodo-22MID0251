import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { todoService } from '../services/todoService';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import TimelineChart from '../components/TimelineChart';
import '../styles/Todo.css';

function TodoList() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  // Modals / Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEditingTodo, setCurrentEditingTodo] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Success completed animation trigger
  const [celebration, setCelebration] = useState(null);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await todoService.getTodos();
      if (res.success) {
        setTodos(res.data);
      } else {
        setError('Failed to fetch todos.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading tasks.');
      addToast(err.message || 'Error fetching tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleToggleStatus = async (todo) => {
    const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await todoService.updateTodo(todo.id, { status: nextStatus });
      if (res.success) {
        setTodos((prev) =>
          prev.map((t) => (t.id === todo.id ? res.data : t))
        );

        if (nextStatus === 'completed') {
          // Trigger Habitica XP completed celebration
          setCelebration({ title: todo.title, xp: 10 });
          setTimeout(() => setCelebration(null), 3000);
          addToast(`Task Completed! +10 XP earned`, 'success');
        } else {
          addToast(`"${todo.title}" marked as pending`, 'info');
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const handleCreateTodo = async (todoData) => {
    try {
      const res = await todoService.createTodo(todoData);
      if (res.success) {
        setTodos((prev) => [res.data, ...prev]);
        setIsFormOpen(false);
        addToast('Task created successfully', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to create task', 'error');
    }
  };

  const handleUpdateTodo = async (todoData) => {
    if (!currentEditingTodo) return;
    try {
      const res = await todoService.updateTodo(currentEditingTodo.id, todoData);
      if (res.success) {
        setTodos((prev) =>
          prev.map((t) => (t.id === currentEditingTodo.id ? res.data : t))
        );
        setIsFormOpen(false);
        setCurrentEditingTodo(null);
        addToast('Task updated successfully', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update task', 'error');
    }
  };

  const handleDeleteTodo = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      const res = await todoService.deleteTodo(id);
      if (res.success) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
        addToast('Task deleted successfully', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const openCreateForm = () => {
    setCurrentEditingTodo(null);
    setIsFormOpen(true);
  };

  const openEditForm = (todo) => {
    setCurrentEditingTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentEditingTodo(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setSortBy('createdAt-desc');
    addToast('Filters reset successfully', 'info');
  };

  // Helper date conversions
  const getLocalDateString = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Habitica productivity statistics calculations
  const calculateStreak = () => {
    const completedTodos = todos.filter((t) => t.status === 'completed' && t.updatedAt);
    if (completedTodos.length === 0) return 0;

    const completedDates = [
      ...new Set(
        completedTodos.map((t) => {
          const d = new Date(t.updatedAt);
          return getLocalDateString(d);
        })
      )
    ].sort((a, b) => new Date(b) - new Date(a));

    if (completedDates.length === 0) return 0;

    const todayStr = getLocalDateString(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    const latestDate = completedDates[0];
    if (latestDate !== todayStr && latestDate !== yesterdayStr) {
      return 0;
    }

    let streak = 0;
    let currentDate = new Date(latestDate);

    for (let i = 0; i < completedDates.length; i++) {
      const expectedStr = getLocalDateString(currentDate);
      if (completedDates.includes(expectedStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  // XP: 10 XP per completed task
  const completedCount = todos.filter((t) => t.status === 'completed').length;
  const pendingCount = todos.length - completedCount;
  const currentXP = completedCount * 10;

  // Streak days count
  const currentStreak = calculateStreak();

  // Daily statistics cards variables
  const todayStr = getLocalDateString(new Date());
  
  const completedToday = todos.filter((t) => {
    if (t.status !== 'completed' || !t.updatedAt) return false;
    return getLocalDateString(new Date(t.updatedAt)) === todayStr;
  }).length;

  const pendingToday = todos.filter((t) => {
    if (t.status !== 'pending') return false;
    if (t.dueDate && getLocalDateString(new Date(t.dueDate)) === todayStr) return true;
    return getLocalDateString(new Date(t.createdAt)) === todayStr;
  }).length;

  const dailyProgressPercent =
    completedToday + pendingToday > 0
      ? Math.round((completedToday / (completedToday + pendingToday)) * 100)
      : 0;

  // Weekly stats
  const completedThisWeek = todos.filter((t) => {
    if (t.status !== 'completed' || !t.updatedAt) return false;
    const diffTime = new Date() - new Date(t.updatedAt);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  // Quick Statistics variables
  const highPriorityPending = todos.filter((t) => t.status === 'pending' && t.priority === 'high').length;

  const overdueCount = todos.filter((t) => {
    if (t.status !== 'pending' || !t.dueDate) return false;
    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);
    return new Date(t.dueDate) < todayZero;
  }).length;

  const dueTodayCount = todos.filter((t) => {
    if (t.status !== 'pending' || !t.dueDate) return false;
    return getLocalDateString(new Date(t.dueDate)) === todayStr;
  }).length;

  const dueThisWeekCount = todos.filter((t) => {
    if (t.status !== 'pending' || !t.dueDate) return false;
    const diffTime = new Date(t.dueDate) - new Date();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  // Upcoming Deadlines (Next 5)
  const upcomingDeadlines = todos
    .filter((t) => t.status === 'pending' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Recent Activity Feed entries
  const buildActivityFeed = () => {
    const feeds = [];
    todos.forEach((t) => {
      // Created feed
      feeds.push({
        id: `${t.id}-created`,
        type: 'created',
        message: `Task "${t.title}" created`,
        time: new Date(t.createdAt),
        todoId: t.id
      });
      // Completed feed
      if (t.status === 'completed' && t.updatedAt) {
        feeds.push({
          id: `${t.id}-completed`,
          type: 'completed',
          message: `Task "${t.title}" checked off`,
          time: new Date(t.updatedAt),
          todoId: t.id
        });
      }
      // Updated feed (if updated date differs and not completed status)
      if (t.updatedAt && t.createdAt !== t.updatedAt && t.status !== 'completed') {
        feeds.push({
          id: `${t.id}-updated`,
          type: 'updated',
          message: `Task "${t.title}" details edited`,
          time: new Date(t.updatedAt),
          todoId: t.id
        });
      }
    });
    return feeds.sort((a, b) => b.time - a.time).slice(0, 5);
  };

  const activityFeed = buildActivityFeed();

  // Extract unique categories for the filter list
  const categoriesList = [...new Set(todos.map((t) => t.category))].filter(Boolean);

  // Compute Stats
  const totalCount = todos.length;
  const overallCompletionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter and Sort Logic
  const filteredTodos = todos
    .filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || todo.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === 'all' || todo.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'createdAt-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'createdAt-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'dueDate-asc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'dueDate-desc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const hasFiltersActive =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'all';

  return (
    <div className="todo-dashboard">
      {/* Toast Notification Box */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Completion Celebration modal pop up overlay */}
      {celebration && (
        <div
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '1rem 2rem',
            borderRadius: '12px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            animation: 'celebratePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>✓ Task Completed</span>
          <span style={{ fontSize: '1rem', opacity: 0.9 }}>+{celebration.xp} XP</span>
        </div>
      )}

      {/* Header Info with XP System */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(to right, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            My Workspace
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Manage tasks, set deadlines, and track goals.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* XP Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              border: '1px solid var(--primary)',
              padding: '0.6rem 1.2rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#818cf8',
              boxShadow: '0 4px 12px var(--primary-glow)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>✨</span>
            <span>{currentXP} XP</span>
          </div>

          <button className="btn btn-primary" onClick={openCreateForm}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Task
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-title">Total Tasks</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-card completed-stat clickable-stat" onClick={() => navigate('/completed')} style={{ cursor: 'pointer' }}>
          <span className="stat-title">Completed</span>
          <span className="stat-value">{completedCount}</span>
        </div>
        <div className="stat-card pending-stat clickable-stat" onClick={() => navigate('/pending')} style={{ cursor: 'pointer' }}>
          <span className="stat-title">Pending</span>
          <span className="stat-value">{pendingCount}</span>
        </div>
        <div className="stat-card clickable-stat" onClick={() => navigate('/progress')} style={{ cursor: 'pointer' }}>
          <span className="stat-title">Progress</span>
          <span className="stat-value">{overallCompletionRate}%</span>
        </div>
      </div>

      {/* Habitica-inspired Productivity Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Daily Progress Card */}
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>Daily Progress</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              <span>Completed Today: <strong style={{ color: 'var(--success)' }}>{completedToday}</strong></span>
              <span>Pending Today: <strong style={{ color: 'var(--warning)' }}>{pendingToday}</strong></span>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Daily Completion</span>
              <span>{dailyProgressPercent}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${dailyProgressPercent}%`, height: '100%', backgroundColor: 'var(--success)', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>

        {/* Weekly Productivity & Streak Card */}
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>Weekly Productivity</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Completed in last 7 days: <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>{completedThisWeek}</strong>
            </span>
          </div>
          
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '100px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🔥</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24', textTransform: 'uppercase' }}>Streak</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{currentStreak} Day{currentStreak === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Analytics & Activities block */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Upcoming Deadlines & Recent Activities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Upcoming Deadlines Widget */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>Upcoming Deadlines</h3>
            {upcomingDeadlines.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No upcoming task deadlines found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingDeadlines.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => navigate(`/todo?id=${t.id}`)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      borderLeft: '3px solid var(--warning)',
                      transition: 'var(--transition)'
                    }}
                    className="feed-item-hover"
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{t.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Feed */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>Recent Activity</h3>
            {activityFeed.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent task activity recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activityFeed.map((feed) => (
                  <div
                    key={feed.id}
                    onClick={() => navigate(`/todo?id=${feed.todoId}`)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.15rem',
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    className="feed-item-hover"
                  >
                    <span style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{feed.message}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(feed.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(feed.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Statistics overview widgets */}
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>Quick Statistics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⚡ Highest Priority Tasks (High Priority Pending)</span>
              <strong style={{ color: 'var(--danger)', fontSize: '1.1rem' }}>{highPriorityPending}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🚨 Overdue Tasks</span>
              <strong style={{ color: overdueCount > 0 ? '#ef4444' : 'var(--text-muted)', fontSize: '1.1rem' }}>{overdueCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 Tasks Due Today</span>
              <strong style={{ color: dueTodayCount > 0 ? 'var(--warning)' : 'var(--text-muted)', fontSize: '1.1rem' }}>{dueTodayCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🗓️ Tasks Due This Week</span>
              <strong style={{ color: dueThisWeekCount > 0 ? 'var(--primary-light)' : 'var(--text-muted)', fontSize: '1.1rem' }}>{dueThisWeekCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Timeline Section */}
      <TimelineChart todos={todos} />

      {/* Controls: Search, Filters, Sort */}
      <div className="controls-panel">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categoriesList}
        />
      </div>

      {/* Todo Cards List Container */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--border-radius)', border: '1px dashed var(--danger)' }}>
          <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{error}</p>
          <button className="btn btn-secondary" onClick={fetchTodos} style={{ marginTop: '1rem' }}>
            Try Again
          </button>
        </div>
      ) : filteredTodos.length === 0 ? (
        <EmptyState
          title={hasFiltersActive ? 'No Search Matches' : 'No Tasks Found'}
          description={
            hasFiltersActive
              ? 'Try widening your search terms or clearing your status/priority/category filters.'
              : 'Add your first task to get started.'
          }
          hasFiltersActive={hasFiltersActive}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div className="todos-grid">
          {filteredTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggleStatus={handleToggleStatus}
              onEdit={openEditForm}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      )}

      {/* Modal form */}
      {isFormOpen && (
        <TodoForm
          todo={currentEditingTodo}
          onSubmit={currentEditingTodo ? handleUpdateTodo : handleCreateTodo}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default TodoList;
