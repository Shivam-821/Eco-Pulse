import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Map from './components/Map';
import './index.css';
import Tasks from './components/Tasks';
import Teams from './components/Teams';
import Notifications from './components/Notifications';
import ReportDumpForm from './components/ReportDumpForm';

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<LeafletMap/>} />
          <Route path="/map" element={<Map/>} />
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
