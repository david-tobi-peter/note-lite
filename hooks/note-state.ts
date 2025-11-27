import { COLLAPSE_KEY, createNewNote, LOCAL_STORAGE_KEY, Note, UseNotesResult } from "@/lib";
import { useCallback, useEffect, useMemo, useState } from "react";

const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

export const useNotes = (): UseNotesResult => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState<boolean>(() => {
    return isDesktop && localStorage.getItem(COLLAPSE_KEY) === "true";
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes) as Note[];
        const sortedNotes = parsedNotes.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setNotes(sortedNotes);

        if (sortedNotes.length > 0) {
          setActiveNoteId(sortedNotes[0].id);
        }
      } else {
        const firstNote = createNewNote();

        setNotes([firstNote]);
        setActiveNoteId(firstNote.id);
      }
    } catch (error) {
      console.error("Could not load notes from localStorage:", error);
      const firstNote = createNewNote();
      setNotes([firstNote]);
      setActiveNoteId(firstNote.id);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Could not save notes to localStorage:", error);
    }
  }, [notes]);

  const handleToggleCollapse = useCallback(() => {
    setIsDesktopCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem(COLLAPSE_KEY, newState.toString());
      return newState;
    });
  }, []);

  const handleNewNote = useCallback(() => {
    const newNote = createNewNote();
    setNotes((prevNotes) => [newNote, ...prevNotes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ));
    setActiveNoteId(newNote.id);
  }, []);

  const handleUpdateNote = useCallback((updates: Partial<Note>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === activeNoteId) {
          return {
            ...note,
            ...updates,
            updatedAt: Date.now().toString(),
          };
        }
        return note;
      }).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    );
  }, [activeNoteId]);

  const handleDeleteNote = useCallback((idToDelete: string) => {
    const remainingNotes = notes.filter((note) => note.id !== idToDelete);
    setNotes(remainingNotes.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ));

    if (idToDelete === activeNoteId) {
      setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
    }
  }, [notes, activeNoteId]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        handleNewNote();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleNewNote]);

  const activeNote = useMemo(() => notes.find((note) => note.id === activeNoteId), [notes, activeNoteId]);

  const filteredNotes = useMemo(() => {
    if (!searchTerm) return notes;
    const lowerCaseTerm = searchTerm.toLowerCase();
    return notes
      .filter(
        (note) =>
          note.title.toLowerCase().includes(lowerCaseTerm) ||
          note.content.toLowerCase().includes(lowerCaseTerm)
      )
      .sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [notes, searchTerm]);

  return {
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
  };
};