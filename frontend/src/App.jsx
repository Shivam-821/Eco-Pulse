// App.js
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import "./index.css";
import Tasks from "./components/Tasks";
import Teams from "./components/Teams";
import Notifications from "./components/Notifications"; // You had this commented out
import ReportDumpForm from "./components/ReportDumpForm";
import { Complain, Auth, Home, RegisterRecycle, AboutUs, ViewAllRecycle } from "./pages/index";
import { useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import Footer from './components/Footer'


function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Navbar setCollapsed={setCollapsed} />
        <main className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-slate-900">
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/reportdump" element={<ReportDumpForm />} />
              <Route path="/loadge-complain" element={<Complain />} />
              <Route path="/register-recycle" element={<RegisterRecycle />} />
              <Route path="/viewrecycle" element={<ViewAllRecycle />} />
            </Route>
            <Route
              path="/auth"
              element={
                  <Auth />
              }
            />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;