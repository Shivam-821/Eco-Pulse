// App.js
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import "./index.css";
import Tasks from "./components/Tasks";
import Teams from "./components/Teams";
import Notifications from "./components/Notifications";
import ReportDumpForm from "./components/ReportDumpForm";
import {
  Complain,
  Auth,
  Home,
  RegisterRecycle,
  AboutUs,
  ViewAllRecycle,
  StatsDashboardPage,
  AssignedTask,
} from "./pages/index";
import { useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import ChatBot from "./pages/ChatBot";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()

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
        <main className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-slate-900 relative">
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/map" element={<Map />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/reportdump" element={<ReportDumpForm />} />
              <Route path="/loadge-complain" element={<Complain />} />
              <Route path="/register-recycle" element={<RegisterRecycle />} />
              <Route path="/viewrecycle" element={<ViewAllRecycle />} />
              <Route path="/stats" element={<StatsDashboardPage />} />
              <Route
                path="/assigned-task/:teamname"
                element={<AssignedTask />}
              />
              <Route path="/chat-bot" element={<ChatBot />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
          <Footer />
          <div className="group fixed bottom-6 right-7.5 flex flex-col items-end">
            <div className="relative">
              {/* Tooltip / Dialog box */}
              <div className="hidden w-76 group-hover:flex absolute bottom-8 right-20 bg-gradient-to-r from-lime-600 to-green-600 text-white px-4 py-2 rounded-2xl shadow-xl transition-all duration-300 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 before:content-[''] before:absolute before:top-1/2 before:-right-3 before:-translate-y-1/2 before:border-[7px] before:border-transparent before:border-l-green-600 text-sm">
                <strong className="text-green-100">PrakritiAI</strong>{" "} {" — "}
                Your Personal Eco Companion.
              </div>

              {/* Bot Icon */}
              <img
                onClick={() => navigate('/chat-bot')}
                className="w-[62px] cursor-pointer hover:scale-110 transition-transform drop-shadow-lg z-50"
                src="/chat-bot.png"
                alt="chat-bot"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
