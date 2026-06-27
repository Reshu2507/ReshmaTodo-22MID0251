import React from 'react';
import { useNavigate } from 'react-router-dom';

function TimelineChart({ todos }) {
  const navigate = useNavigate();

  // Filter out todos without valid dates if needed, or handle fallback
  // Sort tasks by nearest deadline (dueDate ascending, empty due dates at the end)
  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  if (sortedTodos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No tasks available to construct timeline.
      </div>
    );
  }

  // Calculate overall start and end dates for the Gantt scale range
  const now = new Date();
  let minDate = new Date(now);
  minDate.setDate(minDate.getDate() - 3); // Start scale 3 days ago by default

  let maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + 7); // End scale 7 days from now by default

  // Adjust range dynamically if tasks exceed default boundaries
  todos.forEach((todo) => {
    const created = new Date(todo.createdAt);
    if (created < minDate) {
      minDate = new Date(created);
    }
    if (todo.dueDate) {
      const due = new Date(todo.dueDate);
      if (due > maxDate) {
        maxDate = new Date(due);
      }
    }
  });

  // Zero out times for date math
  minDate.setHours(0, 0, 0, 0);
  maxDate.setHours(23, 59, 59, 999);

  const totalTimeSpan = maxDate.getTime() - minDate.getTime();

  // Create date ticks for the chart header (e.g. 5 intervals)
  const ticksCount = 5;
  const ticks = [];
  for (let i = 0; i < ticksCount; i++) {
    const tickDate = new Date(minDate.getTime() + (totalTimeSpan / (ticksCount - 1)) * i);
    ticks.push(tickDate);
  }

  // Calculate current date marker position in percent
  const todayPositionPercent = ((now.getTime() - minDate.getTime()) / totalTimeSpan) * 100;

  const formatDateLabel = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return 'None';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className="gantt-chart-container"
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--surface-border)',
        borderRadius: 'var(--border-radius)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        overflowX: 'auto',
        marginTop: '1.5rem'
      }}
    >
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>Project Timeline (Gantt Chart)</h3>

      <div style={{ minWidth: '700px', position: 'relative' }}>
        {/* Gantt Header Date scale */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--surface-border)',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}
        >
          <div style={{ width: '220px', flexShrink: 0 }}>Task Name</div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {ticks.map((tick, idx) => (
              <span key={idx} style={{ transform: 'translateX(-50%)', position: 'absolute', left: `${(idx / (ticksCount - 1)) * 100}%` }}>
                {formatDateLabel(tick)}
              </span>
            ))}
          </div>
        </div>

        {/* Current Day vertical indicator line */}
        {todayPositionPercent >= 0 && todayPositionPercent <= 100 && (
          <div
            title="Today"
            style={{
              position: 'absolute',
              left: `calc(220px + (100% - 220px) * ${todayPositionPercent / 100})`,
              top: '0px',
              bottom: '0px',
              width: '2px',
              backgroundColor: '#ef4444',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-4px',
                width: '10px',
                height: '10px',
                backgroundColor: '#ef4444',
                borderRadius: '50%'
              }}
            />
          </div>
        )}

        {/* Gantt Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {sortedTodos.map((todo) => {
            const startDate = new Date(todo.createdAt);
            const endDate = todo.dueDate ? new Date(todo.dueDate) : new Date(now.getTime() + 24 * 60 * 60 * 1000);

            // Compute positions
            let startPct = ((startDate.getTime() - minDate.getTime()) / totalTimeSpan) * 100;
            let endPct = ((endDate.getTime() - minDate.getTime()) / totalTimeSpan) * 100;

            // Constrain percentages to bounds
            startPct = Math.max(0, Math.min(100, startPct));
            endPct = Math.max(0, Math.min(100, endPct));
            
            // Bar width must be at least a small block if creation and due dates match
            let barWidth = endPct - startPct;
            if (barWidth < 3) barWidth = 3;

            const isCompleted = todo.status === 'completed';
            const barColor = isCompleted ? 'var(--success)' : 'var(--primary)';
            const hoverColor = isCompleted ? 'var(--success-light)' : 'var(--primary-light)';

            const tooltipText = `
Task: ${todo.title}
Priority: ${todo.priority.toUpperCase()}
Status: ${todo.status.toUpperCase()}
Created: ${formatFullDate(todo.createdAt)}
Due Date: ${formatFullDate(todo.dueDate)}
            `.trim();

            return (
              <div
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 0',
                  transition: 'background-color 0.2s ease',
                  borderRadius: '6px'
                }}
                className="gantt-row-hover"
              >
                {/* Left side name label */}
                <div
                  style={{
                    width: '220px',
                    paddingRight: '1rem',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    color: isCompleted ? 'var(--text-muted)' : 'var(--text)',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/todo?id=${todo.id}`)}
                  title="View Details"
                >
                  {todo.title}
                </div>

                {/* Right side Gantt bar canvas */}
                <div style={{ flex: 1, position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                  {/* Outer bar track for hover click */}
                  <div
                    title={tooltipText}
                    onClick={() => navigate(`/todo?id=${todo.id}`)}
                    style={{
                      position: 'absolute',
                      left: `${startPct}%`,
                      width: `${barWidth}%`,
                      height: '14px',
                      backgroundColor: barColor,
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      opacity: isCompleted ? 0.6 : 0.9
                    }}
                    className="gantt-bar-item"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = hoverColor;
                      e.currentTarget.style.transform = 'scaleY(1.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = barColor;
                      e.currentTarget.style.transform = 'scaleY(1)';
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimelineChart;
