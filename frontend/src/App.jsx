import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LeafletMap from './components/map';
import './index.css';
import Tasks from './components/tasks';
import Teams from './components/teams';
import Notifications from './components/notifications';
import ReportDumpForm from './components/reportDump';
function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<LeafletMap/>} />
          <Route path="/map" element={<LeafletMap/>} />
          <Route path="/tasks" element={<Tasks/>} />
          <Route path="/teams" element={<Teams/>} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/reportdump" element={<ReportDumpForm/>} />

          {/* Add more routes for Dashboard, Teams, etc. */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
