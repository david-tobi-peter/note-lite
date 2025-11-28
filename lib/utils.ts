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

export const renderMarkdown = (markdown: string | undefined): string => {
  if (!markdown) return "";

  let html = markdown;

  html = html.replace(/^#\s+(.*)$/gm, '<h1 class="text-3xl font-extrabold mb-4 pt-4">$1</h1>');
  html = html.replace(/^##\s+(.*)$/gm, '<h2 class="text-2xl font-semibold mt-6 mb-3">$2</h2>');

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  html = html.replace(/^- (.*)$/gm, '<li class="ml-4 list-disc marker:text-blue-500">$1</li>');
  html = html.replace(/<li.*?>.*?<\/li>/, (match) => `<ul class="list-inside space-y-2 pl-4 text-gray-700 dark:text-gray-300">${match}</ul>`).replace(/<\/ul>\s*<ul/, '');

  html = html.split(/\n\n+/).map(block => {
    if (block.match(/<h[12]|<ul/)) {
      return block;
    }
    return `<p class="text-lg leading-relaxed dark:text-gray-200 mb-4">${block}</p>`;
  }).join("");

  return html;
};

export const LOCAL_STORAGE_KEY = "notion-lite-notes";
export const COLLAPSE_KEY = "isDesktopCollapsed";

export const createNewNote = (): Note => ({
  id: v4(),
  title: "Untitled Note",
  content: "# New Note\nStart typing here! Use Markdown for formatting.\n\n- Bullet point 1\n- Bullet point 2\n\n**Bold Text Example**",
  createdAt: Date.now().toString(),
  updatedAt: Date.now().toString(),
  icon: "📄",
});