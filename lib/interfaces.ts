export interface Note {
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

export interface EditorProps {
  note: Note;
  onUpdateNote: (updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  isSaving: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean | ((prev: boolean) => boolean)) => void;
}

export interface NoteListItemProps {
  note: Note;
  isActive: boolean;
  onClick: (id: string) => void;
  isCollapsed: boolean;
}

export interface UseNotesResult {
  notes: Note[];
  activeNote: Note | undefined;
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  handleNewNote: () => void;
  handleUpdateNote: (updates: Partial<Note>) => void;
  handleDeleteNote: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isDesktopCollapsed: boolean;
  handleToggleCollapse: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredNotes: Note[];
}

export type Theme = "light" | "dark";