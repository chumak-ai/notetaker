"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import NoteList from "@/components/notes/NoteList";
import EditorArea from "@/components/editor/EditorArea";
import { useSession } from "next-auth/react";

export default function AppPage() {
  const { data: session } = useSession();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [noteListCollapsed, setNoteListCollapsed] = useState(false);

  // Determine view mode based on selectedFolderId
  const getViewMode = (): "all" | "favorites" | "folder" => {
    if (selectedFolderId === "favorites") return "favorites";
    if (selectedFolderId === null) return "all";
    return "folder";
  };

  // Get actual folderId (null for "all" and "favorites" views)
  const getActualFolderId = (): string | null => {
    if (selectedFolderId === "favorites") return null;
    return selectedFolderId;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Folders Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
      />

      {/* Note List */}
      <NoteList
        collapsed={noteListCollapsed}
        onToggleCollapse={() => setNoteListCollapsed(!noteListCollapsed)}
        folderId={getActualFolderId()}
        viewMode={getViewMode()}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
      />

      {/* Editor Area */}
      <EditorArea noteId={selectedNoteId} />
    </div>
  );
}
