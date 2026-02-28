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
        folderId={selectedFolderId}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
      />

      {/* Editor Area */}
      <EditorArea noteId={selectedNoteId} />
    </div>
  );
}
