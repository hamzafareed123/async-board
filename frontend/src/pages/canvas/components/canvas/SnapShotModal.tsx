import { useEffect, useState } from "react";
import { Clock3, Plus, RotateCcw, Save, X } from "lucide-react";
import { useCanvasStore } from "../../../../store/canvas-store";
import { useSnapshotStore } from "../../../../store/snapshot-store";

interface SnapshotModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
    currentUserRole: "owner" | "editor" | "viewer";
}

const SnapshotModal = ({ isOpen, onClose, roomId, currentUserRole }: SnapshotModalProps) => {
    const { snapshots, isLoading, getSnapshots, saveSnapshot, restoreSnapshot } = useSnapshotStore();
    const { loadElements } = useCanvasStore();
    const [label, setLabel] = useState("");
    const [showLabelInput, setShowLabelInput] = useState(false);
    const canSave = currentUserRole === "owner" || currentUserRole === "editor";
    const canRestore = currentUserRole === "owner";

    useEffect(() => {
        if (isOpen && roomId) void getSnapshots(roomId);
    }, [isOpen, roomId, getSnapshots]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const trimmedLabel = label.trim();
        if (!trimmedLabel) return;
        await saveSnapshot(roomId, trimmedLabel);
        setLabel("");
        setShowLabelInput(false);
    };

    const handleRestore = async (snapshotId: string) => {
        await restoreSnapshot(roomId, snapshotId);
        await loadElements(roomId);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <section
                className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-5 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="snapshot-history-title"
            >
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock3 size={18} className="text-primary" />
                        <div>
                            <h2 id="snapshot-history-title" className="text-base font-semibold text-text-primary">History</h2>
                            <p className="text-xs text-text-secondary">Saved board snapshots</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="flex h-7 w-7 items-center cursor-pointer justify-center rounded-md text-text-secondary transition hover:bg-surface-2 hover:text-text-primary" aria-label="Close history">
                        <X size={16} />
                    </button>
                </div>

                {canSave && (
                    <div className="mb-4">
                        {showLabelInput ? (
                            <div className="flex gap-2">
                                <input autoFocus value={label} onChange={(event) => setLabel(event.target.value)} onKeyDown={(event) => {
                                    if (event.key === "Enter") void handleSave();
                                    if (event.key === "Escape") setShowLabelInput(false);
                                }} placeholder="Snapshot name" className="h-9 min-w-0 flex-1 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary" />
                                <button onClick={() => void handleSave()} disabled={!label.trim() || isLoading} className="flex h-9 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
                                    <Save size={14} /> Save
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setShowLabelInput(true)} disabled={isLoading} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/50 text-sm font-medium text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60">
                                <Plus size={15} /> Save current version
                            </button>
                        )}
                    </div>
                )}

                <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                    {isLoading && snapshots.length === 0 ? (
                        <p className="py-8 text-center text-sm text-text-secondary">Loading history…</p>
                    ) : snapshots.length === 0 ? (
                        <p className="py-8 text-center text-sm text-text-secondary">No snapshots have been saved yet.</p>
                    ) : snapshots.map((snapshot) => (
                        <div key={snapshot._id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Clock3 size={15} /></div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-text-primary">{snapshot.label}</p>
                                <p className="text-xs text-text-secondary">{new Date(snapshot.createdAt).toLocaleString()} · {snapshot.elements.length} elements</p>
                            </div>
                            {canRestore && (
                                <button onClick={() => void handleRestore(snapshot._id)} disabled={isLoading} className="flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs font-medium text-text-secondary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60">
                                    <RotateCcw size={13} /> Restore
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {!canRestore && snapshots.length > 0 && <p className="mt-4 text-xs text-text-secondary">Only the board owner can restore a snapshot.</p>}
            </section>
        </>
    );
};

export default SnapshotModal;
