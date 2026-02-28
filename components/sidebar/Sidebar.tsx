"use client";

import { useState, useEffect } from "react";
import {
  FolderIcon,
  PlusIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SearchIcon,
  HomeIcon,
  StarIcon,
  ArchiveIcon,
  SettingsIcon,
  LogOutIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon
} from "lucide-react";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface Folder {
  id: string;
  name: string;
  color?: string | null;
  children?: Folder[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  selectedFolderId,
  onSelectFolder,
}: SidebarProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/folders");
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      }
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName }),
      });

      if (response.ok) {
        const newFolder = await response.json();
        setFolders([...folders, newFolder]);
        setNewFolderName("");
        setIsCreatingFolder(false);
      }
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            isSelected ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => onSelectFolder(folder.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          )}
          <FolderIcon className="w-4 h-4" style={{ color: folder.color || undefined }} />
          <span className="flex-1 text-sm truncate">{folder.name}</span>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {folder.children!.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (collapsed) {
    return (
      <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 gap-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <PanelLeftOpenIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={() => onSelectFolder(null)}
          className={`p-2 rounded-lg transition-colors ${
            selectedFolderId === null
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <HomeIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">NoteTaker</h1>
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <PanelLeftCloseIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => onSelectFolder(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            selectedFolderId === null
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-sm font-medium">All Notes</span>
        </button>
        <button
          onClick={() => onSelectFolder("favorites")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            selectedFolderId === "favorites"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <StarIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Favorites</span>
        </button>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Folders
          </h2>
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <PlusIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {isCreatingFolder && (
          <div className="mb-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") {
                  setIsCreatingFolder(false);
                  setNewFolderName("");
                }
              }}
              onBlur={handleCreateFolder}
              autoFocus
              placeholder="Folder name"
              className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}

        <div className="space-y-1">
          {folders.map((folder) => renderFolder(folder))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <div className="px-3">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Theme
          </div>
          <ThemeToggle />
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
