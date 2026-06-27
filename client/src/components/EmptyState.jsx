import React from 'react';

function EmptyState({ title, description, onClearFilters, hasFiltersActive }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📝</div>
      <h3 className="empty-state-title">{title || 'No Tasks Found'}</h3>
      <p className="empty-state-desc">
        {description || 'Get started by creating a new task to stay organized and productive!'}
      </p>
      {hasFiltersActive && onClearFilters && (
        <button className="btn btn-secondary" onClick={onClearFilters} style={{ marginTop: '0.5rem' }}>
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default EmptyState;
