import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: '4px' }}
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          ReshmaTodo
        </NavLink>
        <ul className="navbar-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/calendar"
              className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
            >
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
            >
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
