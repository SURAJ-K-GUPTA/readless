"use client";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // On mount, check localStorage or system preference
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleDark() {
    setDark(d => {
      const newDark = !d;
      if (newDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newDark;
    });
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <span className="text-xs font-medium text-gray-700 dark:text-gray-200 select-none">Dark mode</span>
      <button
        aria-label="Toggle dark mode"
        role="switch"
        aria-checked={dark}
        onClick={toggleDark}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          ${dark ? "bg-gray-600" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200
            ${dark ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
} 