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
  const [maxMembers, setMaxMembers] = useState<number>(10);
  const [expireAt, setExpireAt] = useState<string>("");
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
      await onSubmit({
        name,
        description,
        isPublic,
        maxMembers,
        expiresAt: expireAt || undefined,
      });
    } catch {
      setError("Unable to create board. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const fieldLabelClass = "block text-sm font-medium text-text-primary mb-1.5";
  const fieldControlClass =
    "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header */}
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

        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Group 1: identity */}
          <div className="flex flex-col gap-4">
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
          </div>

          {/* Group 2: settings — related fields sit side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={fieldLabelClass} htmlFor="maxMembers">
                Max members
              </label>
              <select
                id="maxMembers"
                name="members"
                value={maxMembers}
                onChange={(e) => setMaxMembers(parseInt(e.target.value, 10))}
                className={`${fieldControlClass} cursor-pointer`}
              >
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>

            <div>
              <label className={fieldLabelClass} htmlFor="expireAt">
                Expires on
                <span className="ml-1 font-normal text-text-secondary">
                  (optional)
                </span>
              </label>
              <input
                id="expireAt"
                type="date"
                value={expireAt}
                onChange={(e) => setExpireAt(e.target.value)}
                className={fieldControlClass}
              />
            </div>
          </div>

          <label className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary">
            <span>
              <span className="block font-medium">Make board public</span>
              <span className="block text-xs text-text-secondary">
                Anyone with the link can view this board
              </span>
            </span>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="mt-1 flex items-center gap-3">
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