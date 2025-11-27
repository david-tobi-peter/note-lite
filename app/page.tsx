"use client";

import React from "react";
import { Archive, Menu, Sparkles } from "lucide-react";
import { Sidebar, Editor } from "@/components";
import { useNotes } from "@/hooks";

export default function Home() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    handleNewNote,
    handleUpdateNote,
    handleDeleteNote,
    isSidebarOpen,
    setIsSidebarOpen,
    isDesktopCollapsed,
    handleToggleCollapse,
    searchTerm,
    setSearchTerm,
    filteredNotes,
  } = useNotes();

  if (notes.length === 0 && activeNoteId === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-medium dark:text-gray-300">Loading App...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans relative">
      <Sidebar
        notes={filteredNotes}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        onNewNote={handleNewNote}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDesktopCollapsed={isDesktopCollapsed}
        handleToggleCollapse={handleToggleCollapse}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="flex-1 flex flex-col relative min-w-0">
        {!isSidebarOpen && !isDesktopCollapsed && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden absolute top-4 left-4 z-20 p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {activeNote ? (
          <Editor
            note={activeNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote} />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-gray-100 dark:bg-gray-800">
            <Archive className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold dark:text-gray-300">All caught up!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Use the sidebar to select a note or click the button below to create a new one.
            </p>
            <button
              onClick={handleNewNote}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg active:shadow-none flex items-center"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Start Fresh Note (Cmd/Ctrl+N)
            </button>
          </div>
        )}
      </div>

      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};