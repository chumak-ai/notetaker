"use client";

import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded transition-colors ${
          theme === "light"
            ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
        title="Light mode"
      >
        <SunIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded transition-colors ${
          theme === "system"
            ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
        title="System theme"
      >
        <MonitorIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded transition-colors ${
          theme === "dark"
            ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
        title="Dark mode"
      >
        <MoonIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
