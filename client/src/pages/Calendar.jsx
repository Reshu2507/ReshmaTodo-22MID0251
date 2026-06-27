import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { todoService } from '../services/todoService';
import Loader from '../components/Loader';
import '../styles/Calendar.css';

function Calendar() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const res = await todoService.getTodos();
        if (res.success) {
          setTodos(res.data);
        } else {
          setError('Failed to fetch tasks.');
        }
      } catch (err) {
        setError(err.message || 'Error occurred while fetching tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week index (0 = Sun, 1 = Mon...)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  // Get todos due on a specific calendar day
  const getTodosForDate = (day) => {
    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const dueDateObj = new Date(todo.dueDate);
      return (
        dueDateObj.getDate() === day &&
        dueDateObj.getMonth() === month &&
        dueDateObj.getFullYear() === year
      );
    });
  };

  // Assign color classification to a calendar task item
  const getTaskColorClass = (todo) => {
    if (todo.status === 'completed') {
      return 'cal-task-completed';
    }
    switch (todo.priority) {
      case 'high':
        return 'cal-task-priority-high';
      case 'medium':
        return 'cal-task-priority-medium';
      case 'low':
      default:
        return 'cal-task-priority-low';
    }
  };

  // Render Calendar Grid Cells
  const renderCells = () => {
    const cells = [];
    const todayObj = new Date();

    // Render empty slots for preceding month days
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
    }

    // Render active month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === todayObj.getDate() &&
        month === todayObj.getMonth() &&
        year === todayObj.getFullYear();

      const dayTodos = getTodosForDate(day);

      cells.push(
        <div key={`day-${day}`} className={`calendar-cell ${isToday ? 'today' : ''}`}>
          <span className="cell-day-num">{day}</span>
          <div className="calendar-cell-tasks">
            {dayTodos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => navigate(`/todo?id=${todo.id}`)}
                className={`calendar-task-badge ${getTaskColorClass(todo)}`}
                title={`${todo.title} (${todo.priority} priority - ${todo.status})`}
              >
                {todo.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="calendar-container">
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Calendar Header with Controls */}
      <div className="calendar-header-panel">
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(to right, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Calendar Workspace
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            View tasks and deadlines in a monthly calendar layout.
          </p>
        </div>
        <div className="calendar-nav-buttons">
          <button className="btn btn-secondary btn-sm" onClick={prevMonth} aria-label="Previous month">
            ◀
          </button>
          <button className="btn btn-secondary btn-sm" onClick={today}>
            Today
          </button>
          <button className="btn btn-secondary btn-sm" onClick={nextMonth} aria-label="Next month">
            ▶
          </button>
        </div>
      </div>

      <div className="calendar-view-card">
        {/* Month Title */}
        <div className="calendar-current-month">
          {monthNames[month]} {year}
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>
        ) : (
          <>
            {/* Days of the week row */}
            <div className="calendar-weekdays">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Grid cells */}
            <div className="calendar-grid">{renderCells()}</div>
          </>
        )}
      </div>

      {/* Legend list */}
      <div className="calendar-legend">
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>Legend</h4>
        <div className="legend-items">
          <div className="legend-item"><span className="legend-dot completed"></span> Completed</div>
          <div className="legend-item"><span className="legend-dot pending"></span> Pending (Low)</div>
          <div className="legend-item"><span className="legend-dot medium"></span> Pending (Medium)</div>
          <div className="legend-item"><span className="legend-dot high"></span> Pending (High)</div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
