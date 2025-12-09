import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Trash2, Save, Eye, Pencil } from "lucide-react";
import { debounce, EditorProps, Note } from "@/lib";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EditorTopBarProps extends Omit<EditorProps, "onUpdateNote" | "onDeleteNote" | "note"> {
  note: Note;
  onUpdateNote: (updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

const EditorTopBar: React.FC<EditorTopBarProps> = ({ note, onUpdateNote, onDeleteNote, isSaving, isEditing, setIsEditing }) => {
  const [localTitle, setLocalTitle] = useState(note.title);

  useEffect(() => {
    setLocalTitle(note.title);
  }, [note.title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    onUpdateNote({ title: newTitle });
  };

  const statusText = useMemo(() => {
    const date = new Date();
    return `Saved ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  }, [isSaving]);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
      <input
        id="note-title"
        type="text"
        value={localTitle}
        onChange={handleTitleChange}
        placeholder="Untitled Note"
        className="text-xl md:text-2xl font-bold bg-transparent focus:outline-none flex-1 truncate dark:text-white disabled:text-gray-600 dark:disabled:text-gray-400"
        disabled={!isEditing}
        aria-label="Note Title"
      />
      <div className="flex items-center space-x-2 md:space-x-4 ml-4 text-sm text-gray-500 dark:text-gray-400">
        <span className={`transition-opacity duration-300 hidden sm:inline ${isSaving ? 'opacity-100' : 'opacity-70'}`}>
          <Save className={`w-4 h-4 inline mr-1 ${isSaving ? 'animate-pulse text-blue-500' : ''}`} />
          {statusText}
        </span>

        <button
          onClick={() => setIsEditing(prev => !prev)}
          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center transition-colors dark:text-gray-200"
          aria-label={isEditing ? 'Switch to Preview Mode' : 'Switch to Edit Mode'}
        >
          {isEditing ? (
            <>
              <Eye className="w-4 h-4 mr-1" /> Preview
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </>
          )}
        </button>

        <button
          onClick={() => onDeleteNote(note.id)}
          className="p-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Delete Note"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

const EditorComponent: React.FC<Pick<EditorProps, "note" | "onUpdateNote" | "onDeleteNote">> = ({ note, onUpdateNote, onDeleteNote }) => {
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const [_, setLastSavedAt] = useState(note.updatedAt);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    debouncedSave.cancel();
    setContent(note.content);

    setLastSavedAt(note.updatedAt);
    setIsSaving(false);
    setIsEditing(true);

  }, [note.id, note.content, note.updatedAt]);

  const debouncedSave = useMemo(() => debounce((newContent: string) => {
    onUpdateNote({
      content: newContent,
    });

    setIsSaving(false);
    setLastSavedAt(Date.now().toString());

  }, 1000), [onUpdateNote]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    setContent(newContent);
    setIsSaving(true);
    debouncedSave(newContent);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement> | KeyboardEvent) => {
    if ((e.code === "KeyS" && e.shiftKey) && isEditing) {
      e.preventDefault();
      setIsSaving(true);
      debouncedSave.cancel();

      const newTitle = content.split("\n")[0].replace(/#|__|^\s*-\s*|^\s*\*/g, "").trim() || "Untitled Note";

      onUpdateNote({
        content: content,
        title: newTitle,
      });
      setIsSaving(false);
      setLastSavedAt(Date.now().toString());
    }
  }, [content, onUpdateNote, debouncedSave, isEditing]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <EditorTopBar
        note={note}
        onUpdateNote={onUpdateNote}
        onDeleteNote={onDeleteNote}
        isSaving={isSaving}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {isEditing ? (
          <textarea
            id="note-editor"
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown as (e: React.KeyboardEvent<HTMLTextAreaElement>) => void}
            className="w-full h-full text-lg leading-relaxed resize-none focus:outline-none bg-transparent dark:text-gray-100 font-mono min-h-[70vh]"
            placeholder="Start typing your thoughts..."
            aria-label="Note Content Editor"
          />
        ) : (
          <div className="w-full h-full">
            <div
              className="prose dark:prose-invert max-w-none transition-all duration-300"
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-extrabold mb-4 pt-4 dark:text-white"
                      {...props}
                    />
                  ),

                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-semibold mt-6 mb-3 dark:text-white"
                      {...props}
                    />
                  ),

                  h3: ({ node, ...props }) => (
                    <h3 className="text-xl font-medium mt-4 mb-2 dark:text-white" {...props} />
                  ),

                  h4: ({ node, ...props }) => (
                    <h4 className="text-lg font-normal mt-3 mb-1 dark:text-white" {...props} />
                  ),

                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-100 dark:bg-gray-800 italic text-gray-600 dark:text-gray-300"
                      {...props}
                    />
                  ),

                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-inside space-y-2 pl-4 text-gray-700 dark:text-gray-300"
                      {...props}
                    />
                  ),

                  li: ({ node, ...props }) => (
                    <li
                      className="ml-4 list-disc marker:text-blue-500"
                      {...props}
                    />
                  )
                }}
              >
                {content}
              </Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Editor = React.memo(EditorComponent);