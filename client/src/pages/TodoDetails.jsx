import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { todoService } from '../services/todoService';
import Loader from '../components/Loader';
import PriorityStars from '../components/PriorityStars';
import '../styles/Details.css';

function TodoDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('No task identifier was provided in the query string.');
      setLoading(false);
      return;
    }

    const fetchTodoDetails = async () => {
      try {
        setLoading(true);
        const res = await todoService.getTodoById(id);
        if (res.success && res.data) {
          setTodo(res.data);
        } else {
          setError('Task not found.');
        }
      } catch (err) {
        setError(err.message || 'Error occurred while loading task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodoDetails();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!todo) return;
    const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
    try {
      setUpdating(true);
      const res = await todoService.updateTodo(todo.id, { status: nextStatus });
      if (res.success) {
        setTodo(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to update task status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!todo) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this task? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setUpdating(true);
      const res = await todoService.deleteTodo(todo.id);
      if (res.success) {
        alert('Task deleted successfully.');
        navigate('/');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="details-wrapper" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ color: 'var(--danger)', fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Failed to Load Task</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/" className="btn btn-secondary">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!todo) return null;

  return (
    <div className="details-wrapper">
      <div className="details-header-nav">
        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="details-card">
        {/* Card Header section */}
        <div className="details-hero">
          <div className="details-badges">
            <span className={`badge badge-priority-${todo.priority}`}>{todo.priority} Priority</span>
            <span className={`badge badge-status-${todo.status}`}>{todo.status}</span>
            <span className="badge badge-category">{todo.category}</span>
          </div>
          <h2 className="details-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {todo.title}
            <PriorityStars priority={todo.priority} />
          </h2>
        </div>

        {/* Card Body details section */}
        <div className="details-body">
          <div className="details-section">
            <h3 className="details-section-title">Description</h3>
            <p className="details-desc-text">{todo.description || 'No description provided for this task.'}</p>
          </div>

          <div className="details-section">
            <h3 className="details-section-title">Task Parameters</h3>
            <div className="details-metadata-grid">
              <div className="metadata-item">
                <span className="metadata-label">Identifier</span>
                <span className="metadata-value" style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>{todo.id}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Due Date</span>
                <span className="metadata-value" style={{ color: todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed' ? 'var(--danger)' : 'inherit' }}>
                  {formatDate(todo.dueDate)}
                </span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Created At</span>
                <span className="metadata-value">{formatDate(todo.createdAt)}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Last Updated</span>
                <span className="metadata-value">{formatDate(todo.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer section */}
        <div className="details-card-footer">
          <button
            className={`btn ${todo.status === 'completed' ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleToggleStatus}
            disabled={updating}
          >
            {todo.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
          </button>
          
          <button className="btn btn-danger" onClick={handleDelete} disabled={updating}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoDetails;
