import React, { useState, useEffect } from 'react';

function TodoForm({ todo, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setPriority(todo.priority || 'medium');
      setCategory(todo.category || 'Work');
      setStatus(todo.status || 'pending');
      if (todo.dueDate) {
        // Format to YYYY-MM-DD for date input
        const dateObj = new Date(todo.dueDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        setDueDate(`${year}-${month}-${day}`);
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Work');
      setStatus('pending');
      setDueDate('');
    }
    setErrors({});
  }, [todo]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be under 100 characters';
    }

    if (description.trim().length > 500) {
      newErrors.description = 'Description must be under 500 characters';
    }

    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate);
      if (isNaN(selectedDate.getTime())) {
        newErrors.dueDate = 'Please select a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const todoData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category.trim(),
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    };

    onSubmit(todoData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{todo ? 'Edit Task' : 'Create New Task'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="form-title">Title *</label>
            <input
              type="text"
              id="form-title"
              className={`form-control ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Buy groceries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="form-description">Description</label>
            <textarea
              id="form-description"
              className={`form-control ${errors.description ? 'error' : ''}`}
              placeholder="Provide a detailed description of the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="form-priority">Priority</label>
              <select
                id="form-priority"
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="form-category">Category *</label>
              <input
                type="text"
                id="form-category"
                className={`form-control ${errors.category ? 'error' : ''}`}
                placeholder="e.g. Work, Shopping"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="form-dueDate">Due Date</label>
              <input
                type="date"
                id="form-dueDate"
                className={`form-control ${errors.dueDate ? 'error' : ''}`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
            </div>

            {todo && (
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="form-status">Status</label>
                <select
                  id="form-status"
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {todo ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoForm;
