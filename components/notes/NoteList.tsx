"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  SearchIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  ClockIcon,
  StarIcon,
  MoreVerticalIcon,
  FolderIcon,
  HomeIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
  folderId: string | null;
}

interface Folder {
  id: string;
  name: string;
}

interface NoteListProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  folderId: string | null;
  viewMode?: "all" | "favorites" | "folder";
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
}

export default function NoteList({
  collapsed,
  onToggleCollapse,
  folderId,
  viewMode = "all",
  selectedNoteId,
  onSelectNote,
}: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, viewMode]);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let url = "/api/notes";
      if (viewMode === "favorites") {
        url = "/api/notes?isFavorite=true";
      } else if (folderId) {
        url = `/api/notes?folderId=${folderId}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const toggleFavorite = async (noteId: string, currentValue: boolean, event: React.MouseEvent) => {
    event.stopPropagation();

    // Optimistic update
    setNotes((prevNotes) =>
      prevNotes.map((n) =>
        n.id === noteId ? { ...n, isFavorite: !currentValue } : n
      )
    );

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !currentValue }),
      });

      if (!response.ok) {
        // Revert on error
        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n.id === noteId ? { ...n, isFavorite: currentValue } : n
          )
        );
      } else if (viewMode === "favorites" && !currentValue) {
        // If we're in favorites view and unfavoriting, remove from list
        setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Revert on error
      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.id === noteId ? { ...n, isFavorite: currentValue } : n
        )
      );
    }
  };

  const moveToFolder = async (noteId: string, targetFolderId: string | null) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId: targetFolderId }),
      });

      if (response.ok) {
        // If moved out of current folder view, remove from list
        if (viewMode === "folder" && targetFolderId !== folderId) {
          setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId));
        } else {
          // Update in place
          setNotes((prevNotes) =>
            prevNotes.map((n) =>
              n.id === noteId ? { ...n, folderId: targetFolderId } : n
            )
          );
        }
      }
    } catch (error) {
      console.error("Failed to move note:", error);
    }
  };

  const handleCreateNote = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "",
          folderId,
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
        onSelectNote(newNote.id);
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPreviewText = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.slice(0, 100) + (plainText.length > 100 ? "..." : "");
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
          onClick={handleCreateNote}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notes
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNote}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleCollapse}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <PanelLeftCloseIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Loading notes...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 px-4 text-center">
            <p className="mb-2">
              {searchQuery ? "No notes found" : "No notes yet"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNote}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
              >
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotes.map((note) => {
              // Build dropdown menu items for moving note
              const dropdownItems: DropdownItem[] = [];

              // Add "Move to All Notes" if note is in a folder
              if (note.folderId) {
                dropdownItems.push({
                  label: "Move to All Notes",
                  icon: <HomeIcon className="w-4 h-4" />,
                  onClick: () => moveToFolder(note.id, null),
                });
              }

              // Add separator if we have items
              if (dropdownItems.length > 0 && folders.length > 0) {
                dropdownItems.push({ label: "", separator: true, onClick: () => {} });
              }

              // Add all folders (except current folder)
              folders.forEach((folder) => {
                if (folder.id !== note.folderId) {
                  dropdownItems.push({
                    label: folder.name,
                    icon: <FolderIcon className="w-4 h-4" />,
                    onClick: () => moveToFolder(note.id, folder.id),
                  });
                }
              });

              return (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedNoteId === note.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Star toggle button */}
                    <button
                      onClick={(e) => toggleFavorite(note.id, note.isFavorite, e)}
                      className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      <StarIcon
                        className={`w-4 h-4 ${
                          note.isFavorite
                            ? "fill-yellow-500 text-yellow-500"
                            : ""
                        }`}
                      />
                    </button>

                    {/* Note content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {getPreviewText(note.content)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <ClockIcon className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(note.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Three-dot menu */}
                    <Dropdown
                      trigger={
                        <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                          <MoreVerticalIcon className="w-4 h-4" />
                        </button>
                      }
                      items={dropdownItems}
                      align="right"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
