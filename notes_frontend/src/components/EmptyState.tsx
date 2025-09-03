import React from "react";

type EmptyStateProps = {
  onAdd: () => void;
};

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">No notes yet</h2>
        <p className="text-gray-600 mb-4">
          Create your first note to get started.
        </p>
        <button
          onClick={onAdd}
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-white hover:opacity-90"
        >
          Create Note
        </button>
      </div>
    </div>
  );
}
