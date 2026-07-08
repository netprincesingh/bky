import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Users, FileText, Layers, AlignLeft, LogOut, LayoutDashboard } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/AuthSlice';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Book className="logo-icon" />
          <span>BKY Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} end>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-section-title">Content</li>
          <li>
            <NavLink to="/authors" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Users size={20} />
              <span>Authors</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Book size={20} />
              <span>Books</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/nodes" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <Layers size={20} />
              <span>Book Nodes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/articles" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <FileText size={20} />
              <span>Articles</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/chunks" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
              <AlignLeft size={20} />
              <span>Content Chunks</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
