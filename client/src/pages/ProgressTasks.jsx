import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { todoService } from '../services/todoService';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import Loader from '../components/Loader';

function ProgressTasks() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals / Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEditingTodo, setCurrentEditingTodo] = useState(null);

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
      setError(err.message || 'Error occurred while loading tasks.');
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
      }
    } catch (err) {
      alert(err.message || 'Failed to update task status.');
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
      }
    } catch (err) {
      alert(err.message || 'Failed to update task.');
    }
  };

  const handleDeleteTodo = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      const res = await todoService.deleteTodo(id);
      if (res.success) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
    }
  };

  const openEditForm = (todo) => {
    setCurrentEditingTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentEditingTodo(null);
  };

  // Compute metrics
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.status === 'completed').length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="todo-dashboard">
      <div>
        <Link to="/" className="btn btn-secondary" style={{ display: 'inline-flex', padding: '0.5rem 1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Progress Workspace
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Completion overview and list analysis.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>
      ) : (
        <>
          {/* Progress Visual Component Card */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--border-radius)', padding: '2rem', marginBottom: '2rem', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 700 }}>Task Completion Status</h3>
            
            {/* Progress Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Total Tasks</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalCount}</span>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Completed</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{completedCount}</span>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Pending</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>{pendingCount}</span>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Percentage</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{completionRate}%</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', height: '14px', overflow: 'hidden', border: '1px solid var(--surface-border)' }}>
              <div
                style={{
                  width: `${completionRate}%`,
                  background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%)',
                  height: '100%',
                  borderRadius: '9999px',
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              All Tasks
            </h3>
          </div>

          {todos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No tasks found in repository.</div>
          ) : (
            <div className="todos-grid">
              {todos.map((todo) => (
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
        </>
      )}

      {isFormOpen && (
        <TodoForm
          todo={currentEditingTodo}
          onSubmit={handleUpdateTodo}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default ProgressTasks;
