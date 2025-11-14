import { JournalEntry } from "@/types/journal";

const STORAGE_KEY = "performance-journal-entries";

export const getEntries = (): JournalEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading entries:", error);
    return [];
  }
};

export const saveEntries = (entries: JournalEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving entries:", error);
  }
};

export const addEntry = (entry: Omit<JournalEntry, "id" | "no" | "createdAt">): JournalEntry => {
  const entries = getEntries();
  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    no: entries.length + 1,
    createdAt: new Date().toISOString(),
  };
  saveEntries([...entries, newEntry]);
  return newEntry;
};

export const updateEntry = (id: string, updates: Partial<JournalEntry>): void => {
  const entries = getEntries();
  const updatedEntries = entries.map(entry =>
    entry.id === id ? { ...entry, ...updates } : entry
  );
  saveEntries(updatedEntries);
};

export const deleteEntry = (id: string): void => {
  const entries = getEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  // Renumber entries
  const renumbered = filteredEntries.map((entry, index) => ({
    ...entry,
    no: index + 1,
  }));
  saveEntries(renumbered);
};
