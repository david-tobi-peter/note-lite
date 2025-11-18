interface Note {
  id: string;
  title: string;
  content: string;
  icon: string;
  createdAt: string;
  updatedAt: string
}

export interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  onNewNote: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isDesktopCollapsed: boolean;
  handleToggleCollapse: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export interface NoteListItemProps {
  note: Note;
  isActive: boolean;
  onClick: (id: string) => void;
  isCollapsed: boolean;
}