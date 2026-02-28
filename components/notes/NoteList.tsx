"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  SearchIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  ClockIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tags: string[];
}

interface NoteListProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  folderId: string | null;
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
}

export default function NoteList({
  collapsed,
  onToggleCollapse,
  folderId,
  selectedNoteId,
  onSelectNote,
}: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const url = folderId
        ? `/api/notes?folderId=${folderId}`
        : `/api/notes`;
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
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedNoteId === note.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent"
                }`}
              >
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
