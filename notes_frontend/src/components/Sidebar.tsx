"use client";

import React, { useMemo, useState } from "react";
import { Note } from "@/lib/types";

type SidebarProps = {
  notes: Note[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
};

export default function Sidebar({
  notes,
  activeId,
  onSelect,
  onAdd,
}: SidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, query]);

  return (
    <aside className="flex h-full flex-col border-r border-gray-200 bg-[var(--color-secondary)]">
      <div className="p-3 border-b border-gray-200">
        <div className="flex gap-2">
          <input
            aria-label="Search notes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <button
            onClick={onAdd}
            className="shrink-0 rounded-md bg-[var(--color-accent)] px-3 py-2 text-white text-sm hover:opacity-90"
          >
            New
          </button>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No notes</p>
        ) : (
          <ul className="p-2 space-y-1">
            {filtered.map((n) => {
              const isActive = n.id === activeId;
              return (
                <li key={n.id}>
                  <button
                    onClick={() => onSelect(n.id)}
                    className={`w-full text-left rounded-md px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-white border border-[var(--color-primary)]"
                        : "hover:bg-white"
                    }`}
                    title={n.title}
                  >
                    <div className="truncate font-medium">{n.title || "Untitled"}</div>
                    <div className="truncate text-xs text-gray-500">
                      {new Date(n.updatedAt).toLocaleString()}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
