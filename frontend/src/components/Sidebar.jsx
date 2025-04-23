import { Link } from 'react-router-dom';
import { FaMap, FaTasks, FaUsers, FaBell, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <h2 className="logo">Eco Pulse</h2>
      </div>

      <div className="sidebar-scrollable">
        <ul className="nav-links">
          <li><Link to="/map"><FaMap /> Map</Link></li>
          <li><Link to="/teams"><FaUsers /> Teams</Link></li>
          <li><Link to="/tasks"><FaTasks /> Tasks</Link></li>
          <li><Link to="/notifications"><FaBell /> Notifications</Link></li>
        </ul>
      </div>

      <div className="sidebar-bottom">
        <div className="account-links">
          <Link to="#"><FaSignInAlt /> Sign In</Link>
          <Link to="#"><FaUserPlus /> Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
