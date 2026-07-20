import { useState } from "react";
import type { IRoom } from "../../../../types/room-types";
import Button from "../../../../components/ui/button";

interface RoomCreatedModalProps {
  room: IRoom;
  onClose: () => void;
  inviteLink: string;
}

const RoomCreatedModal = ({
  room,
  onClose,
  inviteLink,
}: RoomCreatedModalProps) => {
  const [copied, setCopied] = useState(false);

  console.log(inviteLink);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Board created
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border cursor-pointer border-border bg-surface px-3 py-2 text-sm text-text-secondary transition hover:bg-surface-2"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm text-text-primary">
          <p>
            <span className="font-medium">Name:</span> {room.name}
          </p>
          {room.description && (
            <p>
              <span className="font-medium">Description:</span>{" "}
              {room.description}
            </p>
          )}
          <p>
            <span className="font-medium">Max members:</span>{" "}
            {room.inviteCode.maxMembers}
          </p>
          {room.inviteCode.expiresAt && (
            <p>
              <span className="font-medium">Expires:</span>{" "}
              {new Date(room.inviteCode.expiresAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Invite link
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
            <p className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-text-primary">
              {inviteLink}
            </p>
            <Button label={copied ? "Copied" : "Copy"} onClick={handleCopy} />
          </div>
          <p className="mt-1.5 text-xs text-text-secondary">
            Anyone with this link can join the board.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomCreatedModal;
