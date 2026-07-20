import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useRoomStore } from "../../store/room-store";
import CreateRoomModal from "./DashboardLayout/MainContent/CreateRoomModal";
import DashboardHeader from "./DashboardLayout/MainContent/DashboardHeader";
import NavItem from "./DashboardLayout/Sidebar/NavItem";
import UserBoard from "./DashboardLayout/MainContent/UserBoard";
import type { ICreateRoomDTO } from "../../types/room-types";
import RoomCreatedModal from "./DashboardLayout/MainContent/RoomCreatedModal";
import UserProfile from "./DashboardLayout/MainContent/UserProfile";
import { useAuthStore } from "../../store/auth-store";

type ModalStatus = "closed" | "create" | "created";

export const DashboardPage = () => {
  const { getRooms, isLoading, createRoom, room, inviteLink } = useRoomStore();
  const { authUser } = useAuthStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modalStatus, setModalStatus] = useState<ModalStatus>("closed");
  const [activePanel, setActivePanel] = useState<string>("");

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const openCreateModal = () => setModalStatus("create");
  const closeModal = () => setModalStatus("closed");

  const handleCreateRoom = async (data: ICreateRoomDTO) => {
    await createRoom(data);
    setModalStatus("created");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-background">
      <div className="flex min-h-screen w-full">
        <aside
          className={`sticky top-0 h-screen shrink-0 border-r border-border bg-surface shadow-sm transition-all duration-200 ${
            isSidebarOpen ? "w-50" : "w-0 overflow-hidden border-r-0"
          }`}
        >
          {isSidebarOpen && (
            <div className="flex h-full flex-col">
              <div className="flex justify-end p-4">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-full p-2 cursor-pointer text-text-secondary transition hover:bg-surface-2 hover:text-text-primary"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>
              <NavItem onSelect={(panel) => setActivePanel(panel)} />
            </div>
          )}
        </aside>

        <section className="flex-1 overflow-y-auto p-8">
          {!isSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="mb-4 inline-flex items-center cursor-pointer rounded-full border border-border bg-surface p-2 text-text-secondary shadow-sm transition hover:bg-surface-2 hover:text-text-primary"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          <DashboardHeader onCreate={openCreateModal} />

          <div className="mt-8">
            {activePanel === "boards" && (
              <UserBoard openCreateModal={openCreateModal} />
            )}
            {activePanel === "user-profile" && authUser && (
              <UserProfile authUser={authUser} />
            )}
          </div>
        </section>
      </div>

      {modalStatus === "create" && (
        <CreateRoomModal onClose={closeModal} onSubmit={handleCreateRoom} />
      )}

      {modalStatus === "created" && room && inviteLink && (
        <RoomCreatedModal
          room={room}
          onClose={closeModal}
          inviteLink={inviteLink}
        />
      )}
    </main>
  );
};
