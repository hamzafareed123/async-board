import { useState } from "react";
import { Copy, Check, X, Users, Pencil, Eye } from "lucide-react";
import { useRoomStore } from "../../../../store/room-store";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Role = "editor" | "viewer";

const ShareModal = ({ isOpen, onClose }: ShareModalProps) => {
    const { room } = useRoomStore();
    const [selectedRole, setSelectedRole] = useState<Role>("viewer");
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const inviteLink = `${window.location.origin}/join/${room?.inviteCode?.code}?role=${selectedRole}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.log("failed to copy:", error);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-full max-w-md bg-surface border border-border rounded-2xl
                shadow-xl z-50 p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-primary" />
                        <h2 className="text-base font-semibold text-text-primary">
                            Share board
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-7 h-7 rounded-md
                            text-text-secondary hover:bg-surface-2 cursor-pointer hover:text-text-primary
                            transition"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Role selection */}
                <p className="text-xs font-medium text-text-secondary uppercase
                    tracking-wider mb-3">
                    Invite as
                </p>

                <div className="grid grid-cols-2 gap-2 mb-5">
                    {/* Editor */}
                    <button
                        onClick={() => setSelectedRole("editor")}
                        className={`flex items-start gap-3 p-3 rounded-xl border
                            transition text-left cursor-pointer
                            ${selectedRole === "editor"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-border-focus hover:bg-surface-2"
                            }`}
                    >
                        <div className={`mt-0.5 flex items-center justify-center
                            w-7 h-7 rounded-lg shrink-0
                            ${selectedRole === "editor"
                                ? "bg-primary text-white"
                                : "bg-surface-2 text-text-secondary"
                            }`}>
                            <Pencil size={13} />
                        </div>
                        <div>
                            <p className={`text-sm font-medium
                                ${selectedRole === "editor"
                                    ? "text-primary"
                                    : "text-text-primary"
                                }`}>
                                Editor
                            </p>
                            <p className="text-xs text-text-secondary mt-0.5">
                                Can draw and edit
                            </p>
                        </div>
                    </button>

                    {/* Viewer */}
                    <button
                        onClick={() => setSelectedRole("viewer")}
                        className={`flex items-start gap-3 p-3 rounded-xl border
                            transition text-left cursor-pointer
                            ${selectedRole === "viewer"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-border-focus hover:bg-surface-2"
                            }`}
                    >
                        <div className={`mt-0.5 flex items-center justify-center
                            w-7 h-7 rounded-lg shrink-0
                            ${selectedRole === "viewer"
                                ? "bg-primary text-white"
                                : "bg-surface-2 text-text-secondary"
                            }`}>
                            <Eye size={13} />
                        </div>
                        <div>
                            <p className={`text-sm font-medium
                                ${selectedRole === "viewer"
                                    ? "text-primary"
                                    : "text-text-primary"
                                }`}>
                                Viewer
                            </p>
                            <p className="text-xs text-text-secondary mt-0.5">
                                Can view only
                            </p>
                        </div>
                    </button>
                </div>

                {/* Invite link */}
                <p className="text-xs font-medium text-text-secondary uppercase
                    tracking-wider mb-2">
                    Invite link
                </p>

                <div className="flex items-center gap-2 p-3 bg-surface-2
                    border border-border rounded-xl mb-4">
                    <p className="flex-1 text-xs text-text-secondary truncate font-mono">
                        {inviteLink}
                    </p>
                </div>

                {/* Copy button */}
                <button
                    onClick={handleCopy}
                    className={`w-full flex items-center justify-center gap-2
                        h-9 rounded-xl cursor-pointer text-sm font-medium transition-all
                        ${copied
                            ? "bg-green-500 text-white"
                            : "bg-primary text-white hover:bg-primary-hover"
                        }`}
                >
                    {copied ? (
                        <>
                            <Check size={15} />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={15} />
                            Copy invite link
                        </>
                    )}
                </button>

            </div>
        </>
    );
};

export default ShareModal;