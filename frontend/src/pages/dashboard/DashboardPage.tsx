import { useEffect, useState } from "react";
import { useRoomStore } from "../../store/room-store";
import CreateRoomModal from "./DashboardLayout/MainContent/CreateRoomModal";
import DashboardHeader from "./DashboardLayout/MainContent/DashboardHeader";
import NavItem from "./DashboardLayout/Sidebar/NavItem";
import UserBoard from "./DashboardLayout/MainContent/UserBoard";

export const DashboardPage = () => {
  const { getRooms, isLoading, createRoom } = useRoomStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // default to showing boards on load
  const [activePanel, setActivePanel] = useState<string>("");

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleCreateRoom = async (data: {
    name: string;
    description?: string;
    isPublic?: boolean;
  }) => {
    await createRoom(data);
    closeCreateModal();
  };
  

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="w-72 sticky top-8 self-start">
            <NavItem onSelect={(panel) => setActivePanel(panel)} />
          </aside>

          <section className="flex-1">
            <DashboardHeader onCreate={openCreateModal} />

            <div className="mt-6">
              {activePanel === "boards" && (
                <UserBoard openCreateModal={openCreateModal} />
              )}
            </div>
          </section>
        </div>

        {isCreateModalOpen && (
          <CreateRoomModal
            onClose={closeCreateModal}
            onSubmit={handleCreateRoom}
          />
        )}
      </main>
    </>
  );
};
