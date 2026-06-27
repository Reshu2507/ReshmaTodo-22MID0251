import React, { useState, useEffect } from 'react';
import { todoService } from '../services/todoService';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import '../styles/Todo.css';

function TodoList() {
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
        addToast(
          `"${todo.title}" marked as ${nextStatus === 'completed' ? 'completed' : 'pending'}`,
          'success'
        );
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

  // Extract unique categories for the filter list
  const categoriesList = [...new Set(todos.map((t) => t.category))].filter(Boolean);

  // Compute Stats
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.status === 'completed').length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(to right, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            My Workspace
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Manage tasks, set deadlines, and track goals.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateForm}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Task
        </button>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-title">Total Tasks</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-card completed-stat">
          <span className="stat-title">Completed</span>
          <span className="stat-value">{completedCount}</span>
        </div>
        <div className="stat-card pending-stat">
          <span className="stat-title">Pending</span>
          <span className="stat-value">{pendingCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Progress</span>
          <span className="stat-value">{completionRate}%</span>
        </div>
      </div>

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
