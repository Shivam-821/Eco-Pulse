import React, {useState, useEffect} from 'react'

const DarkMode = () => {

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
    <div>
      {/* Can assign better something like toggle button or any icon  */}
        <button 
        onClick={() => setIsDark((prev) => !prev)}
        className="text-gray-600 cursor-pointer hover:bg-gray-100 px-2">
            change Mode
        </button>
    </div>
  )
}

export default DarkMode