import { useMemo, useState } from "react";
import { ArrowDownUp, LayoutGrid, Search, Users } from "lucide-react";
import { useRoomStore } from "../../../../store/room-store";
import RoomCard from "./RoomCard";
import { useAuthStore } from "../../../../store/auth-store";
import EmptyState from "./EmptyState";
import { useNavigate } from "react-router-dom";
import type { IRoom } from "../../../../types/room-types";

interface UserBoardProps {
  openCreateModal: () => void;
}

type BoardFilter = "all" | "owned" | "shared";

const isOwnedBy = (room: IRoom, userId?: string) =>
  room.members.some((member) => (typeof member.userId === "string" ? member.userId : member.userId?._id) === userId && member.role === "owner");

const UserBoard = ({ openCreateModal }: UserBoardProps) => {
  const { rooms, deleteRoom } = useRoomStore();
  const { authUser } = useAuthStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<BoardFilter>("all");
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();

  const visibleRooms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return rooms
      .filter((room) => {
        const matchesQuery = !normalizedQuery || `${room.name} ${room.description ?? ""}`.toLowerCase().includes(normalizedQuery);
        const owner = isOwnedBy(room, authUser?.id);
        const matchesFilter = filter === "all" || (filter === "owned" ? owner : !owner);
        return matchesQuery && matchesFilter;
      })
      .sort((left, right) => sortBy === "name"
        ? left.name.localeCompare(right.name)
        : new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  }, [rooms, query, filter, sortBy, authUser?.id]);

  const sharedRooms = rooms.filter((room) => room.members.length > 1).length;
  const collaboratorCount = new Set(rooms.flatMap((room) => room.members.map((member) => typeof member.userId === "string" ? member.userId : member.userId?._id).filter(Boolean))).size;

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-light text-primary"><LayoutGrid size={19} /></span>
          <span><span className="block text-2xl font-semibold tracking-tight text-text-primary">{rooms.length}</span><span className="text-xs text-text-secondary">Your boards</span></span>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Users size={19} /></span>
          <span><span className="block text-2xl font-semibold tracking-tight text-text-primary">{collaboratorCount}</span><span className="text-xs text-text-secondary">People in your workspace</span></span>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700"><Users size={19} /></span>
          <span><span className="block text-2xl font-semibold tracking-tight text-text-primary">{sharedRooms}</span><span className="text-xs text-text-secondary">Boards with collaborators</span></span>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
          <EmptyState title="Your first board is a blank canvas" description="Start a brainstorm, map a project, or invite your team to sketch something out." actionLabel="Create your first board" onAction={openCreateModal} />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-text-primary">Your boards <span className="ml-1 text-sm font-normal text-text-muted">{rooms.length}</span></h2>
              <p className="mt-1 text-xs text-text-secondary">Pick up where your team left off.</p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your boards" className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10" />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-xl border border-border bg-surface p-1" aria-label="Filter boards">
              {([['all', 'All boards'], ['owned', 'Owned by me'], ['shared', 'Shared with me']] as const).map(([value, label]) => (
                <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`rounded-lg px-3 py-2 text-xs font-medium transition ${filter === value ? "bg-primary-light text-primary" : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"}`}>
                  {label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text-secondary">
              <ArrowDownUp size={14} />
              <span className="sr-only">Sort boards</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="cursor-pointer bg-transparent text-xs font-medium text-text-primary outline-none">
                <option value="recent">Newest first</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>

          {visibleRooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {visibleRooms.map((room) => (
                <RoomCard key={room._id} onClick={() => navigate(`/canvas/${room._id}`)} room={room} currentUserId={authUser?.id || ""} onDelete={deleteRoom} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
              <Search size={22} className="mx-auto text-text-muted" />
              <h3 className="mt-3 text-sm font-semibold text-text-primary">No boards match that search</h3>
              <p className="mt-1 text-xs text-text-secondary">Try another name or switch the board filter.</p>
              <button type="button" onClick={() => { setQuery(""); setFilter("all"); }} className="mt-4 text-xs font-semibold text-primary hover:text-primary-hover">Clear filters</button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default UserBoard;
