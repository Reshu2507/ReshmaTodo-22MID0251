import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <span>&copy; {currentYear} ReshmaTodo Application. All rights reserved.</span>
        </div>
        <div>
          <span className="footer-author">Author: Reshma</span>
          <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
          <span className="footer-reg">Registration Number: 22MID0251</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
