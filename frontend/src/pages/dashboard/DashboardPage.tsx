import { useRoomStore } from "../../store/room-store";

const DashboardPage = () => {
  const { rooms } = useRoomStore();
  console.log(rooms);
  return (
    <div>
      <h1>welcome to the Dashboard</h1>
      
    </div>
  );
};

export default DashboardPage;
