// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to={user ? '/dashboard' : '/'} className="brand-link">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">TaskFlow</span>
        </Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-greeting">
              Hello, <strong>{user.name.split(' ')[0]}</strong>
            </span>
            <button className="btn btn-outline-sm" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <div className="nav-links">
            <Link to="/login"  className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary-sm">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
