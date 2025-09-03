"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Note, NoteInput } from "@/lib/types";

type EditorProps = {
  note: Note | null;
  isNew?: boolean;
  onSave: (data: NoteInput) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export default function Editor({
  note,
  isNew = false,
  onSave,
  onDelete,
}: EditorProps) {
  const [title, setTitle] = useState<string>(note?.title || "");
  const [content, setContent] = useState<string>(note?.content || "");
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isDirty = useMemo(
    () => title !== (note?.title || "") || content !== (note?.content || ""),
    [title, content, note?.title, note?.content]
  );

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setError(null);
  }, [note?.id, note?.title, note?.content]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave({ title: title.trim(), content: content.trim() });
    } catch (e) {
      const err = e as { message?: string };
      setError(err?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    if (!note) return;
    const confirmed = window.confirm("Delete this note?");
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    try {
      await onDelete();
    } catch (e) {
      const err = e as { message?: string };
      setError(err?.message ?? "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  if (!note && !isNew) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Select a note or create a new one.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg font-medium outline-none focus:border-[var(--color-primary)]"
        />
        <div className="ml-3 flex gap-2">
          {onDelete && !isNew && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || (!isNew && !isDirty)}
            className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          className="h-full w-full resize-none p-4 outline-none bg-white"
        />
      </div>
      {error && (
        <div className="border-t border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!isNew && note && (
        <div className="border-t border-gray-200 bg-[var(--color-secondary)] p-2 text-right text-xs text-gray-500">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}
