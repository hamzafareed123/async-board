import React, { useState } from "react";
import FormInput from "../../../../components/forms/FormInput";
import type { ICreateRoomDTO } from "../../../../types/room-types";

interface CreateRoomModalProps {
  onClose: () => void;
  onSubmit: (data: ICreateRoomDTO) => Promise<void>;
}

const CreateRoomModal = ({ onClose, onSubmit }: CreateRoomModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Board name is required.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({ name, description, isPublic });
    } catch {
      setError("Unable to create board. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Create board
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Create a new board and start organizing your work.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border cursor-pointer border-border bg-surface px-3 py-2 text-sm text-text-secondary transition hover:bg-surface-2"
          >
            Close
          </button>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <FormInput
            label="Board name"
            type="text"
            placeholder="Enter board name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error ? "Board name is required." : undefined}
          />

          <FormInput
            label="Description"
            type="text"
            placeholder="Add an optional board description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="flex items-center gap-3 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Make board public
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex cursor-pointer flex-1 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create board"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
