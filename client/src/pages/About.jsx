import React from 'react';

function About() {
  return (
    <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '2rem', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--border-radius)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(to right, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
        About the Application
      </h2>
      <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.9)', marginBottom: '1.25rem' }}>
        This application is a complete, production-ready Full Stack Todo management platform designed to help users structure their daily workflow, classify obligations, prioritize urgent work, and meet strict project deadlines.
      </p>
      <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
        The backend service is powered by a robust Node.js Express server utilizing the core file system modules for direct JSON file serialization and data persistence. The user interface leverages React (Vite) and React Router to build a highly responsive, modern Multi-Page Application workflow.
      </p>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>
        Developer Information
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Author</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>Reshma</span>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Registration Number</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', fontFamily: 'monospace' }}>22MID0251</span>
        </div>
      </div>
    </div>
  );
}

export default About;
