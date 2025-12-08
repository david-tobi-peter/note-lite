import { v4 } from "uuid";
import { Note } from "./interfaces";

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> => {
  let timeoutId: number | undefined;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay) as unknown as number;
  };

  (debounced as DebouncedFunction<T>).cancel = () => clearTimeout(timeoutId);

  return debounced as DebouncedFunction<T>;
};

export const LOCAL_STORAGE_KEY = "notion-lite-notes";
export const COLLAPSE_KEY = "isDesktopCollapsed";

export const createNewNote = (): Note => ({
  id: v4(),
  title: "Untitled Note",
  content: "# New Note\nStart typing here! Use Markdown for formatting.\n\n- Bullet point 1\n- Bullet point 2\n\n**Bold Text Example**",
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
  icon: "📝",
});