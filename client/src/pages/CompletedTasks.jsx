import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { todoService } from '../services/todoService';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';

function CompletedTasks() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals / Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEditingTodo, setCurrentEditingTodo] = useState(null);

  const fetchCompletedTodos = async () => {
    try {
      setLoading(true);
      const res = await todoService.getTodos();
      if (res.success) {
        setTodos(res.data.filter((t) => t.status === 'completed'));
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
    fetchCompletedTodos();
  }, []);

  const handleToggleStatus = async (todo) => {
    const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await todoService.updateTodo(todo.id, { status: nextStatus });
      if (res.success) {
        // Since this page displays only completed, remove if toggled to pending
        setTodos((prev) => prev.filter((t) => t.id !== todo.id));
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
        // If status was changed from completed, filter it out
        if (res.data.status !== 'completed') {
          setTodos((prev) => prev.filter((t) => t.id !== currentEditingTodo.id));
        } else {
          setTodos((prev) =>
            prev.map((t) => (t.id === currentEditingTodo.id ? res.data : t))
          );
        }
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
        <h2 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(to right, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Completed Tasks
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Total completed tasks: <strong style={{ color: 'var(--success)' }}>{todos.length}</strong>
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>
      ) : todos.length === 0 ? (
        <EmptyState
          title="No Completed Tasks"
          description="None of your tasks have been marked as completed yet. Keep working to check items off your list!"
        />
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

export default CompletedTasks;
