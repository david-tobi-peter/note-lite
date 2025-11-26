import React, { useMemo, useEffect } from "react";
import { Menu, Plus, Search, ChevronsLeft, ChevronsRight, X } from "lucide-react"
import { NoteListItemProps, SidebarProps } from "@/lib";
import { useBodyScrollLock, useMediaQuery } from "@/hooks";

type PickedSidebarFields = Pick<SidebarProps, "searchTerm" | "setSearchTerm"| "onNewNote" | "isDesktopCollapsed" | "handleToggleCollapse">

const SidebarHeader: React.FC<PickedSidebarFields> = ({
  searchTerm,
  setSearchTerm,
  onNewNote,
  isDesktopCollapsed,
  handleToggleCollapse
}) => (
  <>
    <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <h1 className={`text-xl font-bold transition-opacity duration-300 dark:text-white ${isDesktopCollapsed ? "opacity-0 hidden md:block" : ""}`}>
        Notion-Lite
      </h1>
      
      <button 
        onClick={handleToggleCollapse}
        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark: hover:bg-gray-700 transition-colors"
        aria-label="Toggle Sidebar"
      >
        {
          isDesktopCollapsed ? 
            (<ChevronsRight className="w-5 h-5"/>) :
            (<ChevronsLeft className="w-5 h-5"/>)
          
        }
      </button>
    </div>

    <div className={`p-3 border-b border-gray-200 dark:border-gray-700 tranition-opacity duration-300 ${isDesktopCollapsed ? "hidden" : "block"}`}>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors dark:text-white"
        />
      </div>
      <button
        onClick={onNewNote}
        className="flex items-center justify-center w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md active:shadow-none"
      >
        <Plus className="w-4 h-4 mr-2"/>
      </button>
    </div>
  </>
);

const NoteListItem: React.FC<NoteListItemProps> = React.memo(({ note, isActive, onClick, isCollapsed }) => (
  <div
    className={`flex items-center p-3 cursor-pointer rounded-lg mx-2 my-1 transition-colors 
    ${isActive
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-semibold"
      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
    }
    ${isCollapsed ? "justify-center" : "justify-start"}`}
    onClick={() => onClick(note.id)}
  >
    <span className={`${isCollapsed ? "mr-0" : "mr-3"} text-lg transition-all duration-300`}>{note.icon || "📄"}</span>
    <span className={`text-sm truncate flex-1 ${isCollapsed ? "hidden" : "block"}`}>
      {note.title || "Untitled Note"}
    </span>
  </div>
));

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNoteId,
  setActiveNoteId,
  onNewNote,
  isSidebarOpen,
  setIsSidebarOpen,
  isDesktopCollapsed,
  handleToggleCollapse,
  searchTerm,
  setSearchTerm
}) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  const desktopWidthClass = isDesktopCollapsed ? "md:w-16" : "md:w-72";

  useBodyScrollLock(isMobile && isSidebarOpen);

  return (
    <div className={`fixed top-0 left-0 h-full z-30 transition-all duration-30 ease-in-out
    w-full sm:w-80 md:relative md:translate-x-0
    ${desktopWidthClass} 
    bg-white dark:bg-gray-800 shadow-xl md:shadow-none border-r border-gray-200 dark:border-gray-700
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

      <div className="flex flex-col h-full">
          {isMobile && isSidebarOpen && (
            <div className="flex justify-end p-2 md:hidden">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>
          )}

          {(!isDesktopCollapsed || isMobile) && (
            <SidebarHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onNewNote={() => {
                onNewNote();
                if (isMobile) setIsSidebarOpen(false);
              }}
              isDesktopCollapsed={isDesktopCollapsed}
              handleToggleCollapse={handleToggleCollapse}
            />
          )}

          {isDesktopCollapsed && !isMobile && (
            <div className="p-3 flex justify-end items-center border-b border-gray-200 dark:border-gray-700">
              <button
                  onClick={handleToggleCollapse}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle Sidebar"
              >
                  <ChevronsRight className="w-5 h-5" />
              </button>
          </div>
        )}

        <div className="overflow-y-auto flex-1 pb-4">
          {notes.length === 0 && (
            <p className={`p-4 text-center text-sm text-gray-500 dark:text-gray-400 ${isDesktopCollapsed ? "hidden" : "block"}`}>
              No notes found.
            </p>
          )}
          {notes.map((note) => (
            <NoteListItem 
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={(id) => {
                setActiveNoteId(id);
                if (isMobile) setIsSidebarOpen(false);
              }}
              isCollapsed={isDesktopCollapsed && !isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  )
}