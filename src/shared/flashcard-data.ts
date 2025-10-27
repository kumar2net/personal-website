export type Flashcard = {
  front: string;
  back: string;
};

export type FlashcardSet = {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  category: string;
  color: string;
  icon: string; // Icon name for dynamic import
  cards: Flashcard[];
};

export const flashcardSets: FlashcardSet[] = [
  {
    id: "macos-shortcuts",
    title: "macOS Keyboard Shortcuts",
    description:
      "Master the 12 most essential macOS keyboard shortcuts for productivity",
    cardCount: 12,
    difficulty: "Beginner",
    estimatedTime: "10 min",
    category: "Productivity",
    color: "bg-blue-500",
    icon: "Command",
    cards: [
      { front: "⌘ + C", back: "Copy selected item to clipboard" },
      { front: "⌘ + V", back: "Paste item from clipboard" },
      { front: "⌘ + X", back: "Cut selected item and copy to clipboard" },
      { front: "⌘ + Z", back: "Undo last action" },
      { front: "⌘ + A", back: "Select all items" },
      { front: "⌘ + F", back: "Find items in document or open Find window" },
      { front: "⌘ + S", back: "Save current document" },
      { front: "⌘ + Tab", back: "Switch between open applications" },
      { front: "⌘ + Space", back: "Open Spotlight search" },
      { front: "⌘ + W", back: "Close current window" },
      { front: "⌘ + Q", back: "Quit application completely" },
      {
        front: "⌘ + T",
        back: "Open new tab (in browsers/apps that support tabs)",
      },
    ],
  },
  {
    id: "browser-shortcuts",
    title: "Browser Keyboard Shortcuts",
    description:
      "Speed up your browsing with essential Safari and Chrome shortcuts",
    cardCount: 15,
    difficulty: "Beginner",
    estimatedTime: "12 min",
    category: "Web Browsing",
    color: "bg-green-500",
    icon: "BookOpen",
    cards: [
      { front: "⌘ + T", back: "Open new tab (Safari & Chrome)" },
      { front: "⌘ + W", back: "Close current tab (Safari & Chrome)" },
      { front: "⌘ + R", back: "Reload/refresh current page (Safari & Chrome)" },
      {
        front: "⌘ + L",
        back: "Focus address bar to type URL (Safari & Chrome)",
      },
      { front: "⌘ + D", back: "Bookmark current page (Safari & Chrome)" },
      {
        front: "⌘ + Shift + T",
        back: "Reopen recently closed tab (Safari & Chrome)",
      },
      { front: "⌘ + [", back: "Go back to previous page (Safari & Chrome)" },
      { front: "⌘ + ]", back: "Go forward to next page (Safari & Chrome)" },
      { front: "⌘ + 1-9", back: "Switch to tab by number (Safari & Chrome)" },
      {
        front: "⌘ + Shift + N",
        back: "Open incognito/private browsing window (Safari & Chrome)",
      },
      { front: "⌘ + F", back: "Find text on current page (Safari & Chrome)" },
      { front: "⌘ + +", back: "Zoom in on page (Safari & Chrome)" },
      { front: "⌘ + -", back: "Zoom out on page (Safari & Chrome)" },
      { front: "⌘ + 0", back: "Reset zoom to default size (Safari & Chrome)" },
      {
        front: "⌘ + Shift + Delete",
        back: "Clear browsing data (Chrome) / Clear history (Safari)",
      },
    ],
  },
  {
    id: "vim-shortcuts",
    title: "Vim Keyboard Shortcuts",
    description: "Master essential Vim commands for efficient text editing",
    cardCount: 25,
    difficulty: "Intermediate",
    estimatedTime: "18 min",
    category: "Text Editor",
    color: "bg-purple-500",
    icon: "Terminal",
    cards: [
      { front: "h j k l", back: "Basic navigation: left, down, up, right" },
      { front: "i", back: "Enter Insert mode (insert before cursor)" },
      { front: "a", back: "Enter Insert mode (insert after cursor)" },
      { front: "o", back: "Open new line below and enter Insert mode" },
      { front: "Esc", back: "Exit Insert mode, return to Normal mode" },
      { front: ":w", back: "Save (write) the current file" },
      { front: ":q", back: "Quit Vim (fails if unsaved changes)" },
      { front: ":wq", back: "Save and quit Vim" },
      { front: ":q!", back: "Quit without saving (force quit)" },
      { front: "x", back: "Delete character under cursor" },
      { front: "dd", back: "Delete (cut) entire current line" },
      { front: "yy", back: "Yank (copy) entire current line" },
      { front: "p", back: "Paste after cursor/current line" },
      { front: "u", back: "Undo last action" },
      { front: "Ctrl + r", back: "Redo (opposite of undo)" },
      { front: "/search", back: "Search for 'search' text in file" },
      { front: "n", back: "Go to next search result" },
      { front: "N", back: "Go to previous search result" },
      { front: "gg", back: "Go to beginning of file" },
      { front: "G", back: "Go to end of file" },
      { front: "0", back: "Go to beginning of current line" },
      { front: "$", back: "Go to end of current line" },
      { front: "w", back: "Jump forward to start of next word" },
      { front: "b", back: "Jump backward to start of previous word" },
      { front: "v", back: "Enter Visual mode (character selection)" },
    ],
  },
];
