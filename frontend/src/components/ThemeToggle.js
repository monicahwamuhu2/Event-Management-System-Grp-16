import React, { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Toggle the 'dark' class on the root element (html)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="fixed right-2 bottom-5 flex items-center justify-center transition-colors duration-300 dark:text-white z-50">
      <div className="text-center">
      <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-3 rounded-full bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-300"
        >
          {isDarkMode ? (
            <FaSun className="text-xl text-yellow-600" />
          ) : (
          <FaMoon className="text-xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;
