import React from 'react';
import './Sidebar.css'; // Make sure this CSS file exists and has the styles
import logo from '../assets/logo belantra.png';

// Assuming you'll add Font Awesome for icons later.
// You can link it in your public/index.html
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" ... />

const Sidebar = () => {
  // You can manage the active state properly later, e.g., with React Router
  const activeItem = 'Tickets'; // Example: Set 'Tickets' as active

  return (
    <aside className="sidebar">
      {/* Logo Placeholder - Style this div or replace with <img> */}
      <div className="logo-placeholder">
        <img src={logo} alt="Belantra Logo" style={{ width: "120px", height: "120px", objectFit: "contain", margin: "0 auto" }} />
      </div>

      {/* Navigation */}
      <nav>
        <ul>
          <li>
            {/* Use 'active' class conditionally based on state/route */}
            <a href="#" className={activeItem === 'Dashboard' ? 'active' : ''}>
              <i className="fas fa-th-large"></i> {/* Example Font Awesome icon */}
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" className={activeItem === 'Tickets' ? 'active' : ''}>
              <i className="fas fa-ticket-alt"></i> {/* Example Font Awesome icon */}
              <span>Tickets</span>
            </a>
          </li>
          <li>
            <a href="#" className={activeItem === 'Settings' ? 'active' : ''}>
              <i className="fas fa-cog"></i> {/* Example Font Awesome icon */}
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Social Icons */}
      <div className="sidebar-socials">
         {/* Ensure Font Awesome is linked in index.html for these to show */}
         <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
         <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
         <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
         <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
      </div>

      {/* Logout Button */}
      <button className="logout-btn">
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;