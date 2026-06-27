import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 900, background: 'linear-gradient(to right, #ef4444, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '1rem 0' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
        The link you followed may be broken, or the page has been moved. Use the button below to return to the workspace.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
