import { useEffect, useState } from "react";
import { socket } from "../config/socket";

export const useSocket = (roomId: string) => {
    const [onlineMembers, setOnlineMembers] = useState<any[]>([]);



    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("socket connected:", socket.id);
            console.log("roomId in socket", roomId)
            socket.emit("room:join", roomId);
        });

        socket.on("room:joined", (data) => {
            console.log("room:joined data:", data); // ← what comes back
            setOnlineMembers(data.members);
        });

        socket.on("user:joined", (data) => {
            console.log("user:joined data:", data); 
            /
            setOnlineMembers(prev => {
                const memberIndex = prev.findIndex(member => member.userId === data.userId);

                if (memberIndex === -1) {
                    return [...prev, data];
                }

                return prev.map((member, index) =>
                    index === memberIndex ? { ...member, ...data } : member
                );
            });
        });

        socket.on("user:left", (data) => {
            console.log("user:left data:", data);
            setOnlineMembers(prev =>
                prev.filter(m => m.userId !== data.userId)
            );
        });

        socket.on("error", (error) => {
            console.log("socket error:", error); // ← add this
        });

        return () => {
            socket.emit("room:leave", roomId);
            socket.off("connect");
            socket.off("room:joined");
            socket.off("user:joined");
            socket.off("user:left");
            socket.disconnect();
        };
    }, [roomId]);

    return { onlineMembers, socket };
};
