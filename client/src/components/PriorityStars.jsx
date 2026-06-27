import React from 'react';

function PriorityStars({ priority }) {
  const tooltipText = `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`;

  const getStarColors = () => {
    switch (priority) {
      case 'high':
        return {
          filled: '#fbbf24', // Gold
          empty: 'rgba(255, 255, 255, 0.1)',
          count: 3
        };
      case 'medium':
        return {
          filled: '#f97316', // Orange
          empty: 'rgba(255, 255, 255, 0.1)',
          count: 2
        };
      case 'low':
      default:
        return {
          filled: '#94a3b8', // Gray-slate
          empty: 'rgba(255, 255, 255, 0.1)',
          count: 1
        };
    }
  };

  const config = getStarColors();

  return (
    <div
      className="priority-stars-wrapper"
      title={tooltipText}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        cursor: 'help',
        transition: 'transform 0.2s ease'
      }}
    >
      {[1, 2, 3].map((starIdx) => {
        const isFilled = starIdx <= config.count;
        return (
          <svg
            key={starIdx}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={isFilled ? config.filled : 'none'}
            stroke={isFilled ? config.filled : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.2s ease',
              color: isFilled ? config.filled : '#475569',
            }}
            className="priority-star-svg"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      })}
    </div>
  );
}

export default PriorityStars;
