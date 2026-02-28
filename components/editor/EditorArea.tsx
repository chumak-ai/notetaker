"use client";

import { useState, useEffect } from "react";
import { SparklesIcon } from "lucide-react";
import TiptapEditor from "./TiptapEditor";

interface EditorAreaProps {
  noteId: string | null;
}

export default function EditorArea({ noteId }: EditorAreaProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (noteId) {
      fetchNote(noteId);
    } else {
      setTitle("");
      setContent("");
    }
  }, [noteId]);

  const fetchNote = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notes/${id}`);
      if (response.ok) {
        const note = await response.json();
        setTitle(note.title);
        setContent(note.content);
      }
    } catch (error) {
      console.error("Failed to fetch note:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!noteId) return;

    setSaving(true);
    try {
      await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!noteId) return;

    const timer = setTimeout(() => {
      saveNote();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, noteId]);

  if (!noteId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium mb-2">No note selected</p>
          <p className="text-sm">Select a note or create a new one to start writing</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading note...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header with Title and AI Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="flex-1 text-3xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
          />
          <div className="flex items-center gap-4 ml-4">
            {saving && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Saving...
              </span>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tiptap Editor */}
      <TiptapEditor
        content={content}
        onChange={setContent}
        placeholder="Start writing your note..."
      />
    </div>
  );
}
