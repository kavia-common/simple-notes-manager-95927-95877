"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import EmptyState from "@/components/EmptyState";
import { Note } from "@/lib/types";
import {
  createNote as apiCreate,
  deleteNote as apiDelete,
  listNotes as apiList,
  updateNote as apiUpdate,
} from "@/lib/api";
import { generateTempId } from "@/lib/utils";

type ErrorLike = { message?: string };

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialError, setInitialError] = useState<string | null>(null);

  // load all notes
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setInitialError(null);
      try {
        const data = await apiList();
        if (!ignore) {
          setNotes(
            data.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
          );
          setActiveId((prev) => prev ?? data[0]?.id ?? null);
        }
      } catch (e) {
        const err = e as ErrorLike;
        if (!ignore) setInitialError(err?.message ?? "Failed to load notes");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeId) || null,
    [notes, activeId]
  );

  async function handleAdd() {
    // Optimistic placeholder note
    const tempId = generateTempId();
    const now = new Date().toISOString();
    const newNote: Note = {
      id: tempId,
      title: "Untitled",
      content: "",
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(tempId);

    try {
      const created = await apiCreate({ title: newNote.title, content: "" });
      // Replace temp with real
      setNotes((prev) => {
        const cloned = [...prev];
        const idx = cloned.findIndex((n) => n.id === tempId);
        if (idx !== -1) cloned[idx] = created;
        return cloned.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
      setActiveId(created.id);
    } catch (e) {
      const err = e as ErrorLike;
      // rollback
      setNotes((prev) => prev.filter((n) => n.id !== tempId));
      alert(err?.message ?? "Failed to create note");
    }
  }

  async function handleSave(data: { title: string; content: string }) {
    if (!activeNote) return;
    // Optimistic update
    const optimistic: Note = {
      ...activeNote,
      title: data.title,
      content: data.content,
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) =>
      prev
        .map((n) => (n.id === activeNote.id ? optimistic : n))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
    );

    try {
      // If it was a temp note, create already occurred in handleAdd
      const updated = await apiUpdate(activeNote.id, data);
      setNotes((prev) =>
        prev
          .map((n) => (n.id === activeNote.id ? updated : n))
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      );
    } catch (e) {
      const err = e as ErrorLike;
      alert(err?.message ?? "Failed to save note");
      // optional: re-fetch on error
    }
  }

  async function handleDelete() {
    if (!activeNote) return;
    const id = activeNote.id;

    // Optimistic removal
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setActiveId((prev) => {
      if (prev === id) {
        const remaining = notes.filter((n) => n.id !== id);
        return remaining[0]?.id ?? null;
      }
      return prev;
    });

    try {
      // If it's a temp note (not persisted), skip API
      if (!id.startsWith("tmp_")) {
        await apiDelete(id);
      }
    } catch (e) {
      const err = e as ErrorLike;
      alert(err?.message ?? "Failed to delete note");
      // re-add note on failure
      setNotes((prev) =>
        [...prev, activeNote].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      );
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[var(--color-primary)]" />
            <h1 className="text-lg font-semibold">Notes</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Simple Notes Manager</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[300px_1fr]">
        <div className="h-[calc(100vh-57px)] md:h-[calc(100vh-57px)]">
          <Sidebar
            notes={notes}
            activeId={activeId}
            onSelect={setActiveId}
            onAdd={handleAdd}
          />
        </div>
        <div className="h-[calc(100vh-57px)]">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-gray-500">Loading notes...</div>
            </div>
          ) : initialError ? (
            <div className="p-6 text-red-600">{initialError}</div>
          ) : notes.length === 0 ? (
            <EmptyState onAdd={handleAdd} />
          ) : (
            <Editor
              note={activeNote}
              isNew={activeNote?.id.startsWith("tmp_")}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          )}
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-[var(--color-secondary)]">
        <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-gray-500">
          Tip: Use the sidebar to switch between notes. Click New to create a note.
        </div>
      </footer>
    </main>
  );
}
