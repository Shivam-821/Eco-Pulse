import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const DarkMode = ({ isSidebarCollapsed = false }) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? true : false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => setIsDark((prev) => !prev)}
        className={`flex items-center justify-center rounded-full p-2 ${
          isDark
            ? "bg-gray-700 text-yellow-200 hover:bg-gray-600"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        } transition duration-300 ease-in-out`}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? (
          <FaSun className={isSidebarCollapsed ? "text-lg" : ""} />
        ) : (
          <FaMoon className={isSidebarCollapsed ? "text-lg" : ""} />
        )}
        {!isSidebarCollapsed && (
          <span className="ml-2">
            {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </span>
        )}
      </button>
    </div>
  );
};

export default DarkMode;
