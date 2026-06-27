import React from 'react';
import { useNavigate } from 'react-router-dom';
import PriorityStars from './PriorityStars';

function TodoCard({ todo, onToggleStatus, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate(`/todo?id=${todo.id}`);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleStatus(todo);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(todo);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDeadlineHighlight = () => {
    if (!todo.dueDate || todo.status === 'completed') return {};

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        border: '2px solid #ef4444',
        isOverdue: true,
        badgeText: '⚠ Overdue'
      };
    } else if (diffDays <= 2) {
      return {
        border: '2px solid #ef4444',
        isWarning: true,
        badgeText: `⚠ Near Due (${diffDays}d)`
      };
    } else if (diffDays <= 5) {
      return {
        border: '2px solid #f97316',
        isNotice: true,
        badgeText: `Near Due (${diffDays}d)`
      };
    }
    return {};
  };

  const deadlineInfo = getDeadlineHighlight();

  return (
    <div
      className={`todo-card priority-${todo.priority} ${todo.status} ${todo.status === 'completed' ? 'completed' : ''}`}
      style={{
        border: deadlineInfo.border || undefined,
        boxShadow: deadlineInfo.isOverdue ? '0 0 10px rgba(239, 68, 68, 0.25)' : undefined
      }}
    >
      <div>
        <div className="todo-card-header">
          <div className="todo-title-container">
            <div
              className={`todo-checkbox ${todo.status === 'completed' ? 'checked' : ''}`}
              onClick={handleCheckboxClick}
              title={todo.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
              role="checkbox"
              aria-checked={todo.status === 'completed'}
            />
            <h4 className="todo-title" onClick={handleTitleClick} title="View Details">
              {todo.title}
            </h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <span className="todo-category-badge">{todo.category}</span>
            <PriorityStars priority={todo.priority} />
          </div>
        </div>

        <p className="todo-description">{todo.description || 'No description provided.'}</p>
      </div>

      <div className="todo-card-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="todo-due-date">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(todo.dueDate)}
          </span>
          {deadlineInfo.badgeText && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: deadlineInfo.isOverdue || deadlineInfo.isWarning ? '#ef4444' : '#f97316',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              {deadlineInfo.badgeText}
            </span>
          )}
        </div>

        <div className="todo-actions">
          <button
            className="action-btn edit-btn"
            onClick={handleEditClick}
            title="Edit Todo"
            aria-label="Edit todo"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button
            className="action-btn delete-btn"
            onClick={handleDeleteClick}
            title="Delete Todo"
            aria-label="Delete todo"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoCard;
