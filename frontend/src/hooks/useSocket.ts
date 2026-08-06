import { useEffect, useState } from "react";
import { socket } from "../config/socket";
import { useCanvasStore } from "../store/canvas-store"
import { transformToKonvaShape } from "../utils/transformElement"

export const useSocket = (roomId: string) => {
    const [onlineMembers, setOnlineMembers] = useState<any[]>([]);
    const [cursors, setCursors] = useState<{
        [userId: string]: {
            x: number;
            y: number;
            fullName: string;
            cursorColor: string;
        }
    }>({});

    useEffect(() => {
        if (!roomId) return;

        socket.connect();

        socket.on("connect", () => {
            socket.emit("room:join", roomId);
        });

        //  backend sends full member objects — use directly
        socket.on("room:joined", (data) => {
            console.log("room:joined:", data);
            setOnlineMembers(data.members);
        });

        socket.on("user:joined", (data) => {
            console.log("user:joined:", data);
            setOnlineMembers(prev => {
                const exists = prev.find(m => m.userId === data.userId);
                if (exists) return prev;
                return [...prev, data];
            });
        });

        socket.on("element:created", (data) => {
            console.log("element:created:", data)
            const { addElement } = useCanvasStore.getState();
            addElement(transformToKonvaShape(data.element));
        })

        socket.on("user:left", (data) => {
            console.log("user:left:", data);
            setOnlineMembers(prev =>
                prev.filter(m => m.userId !== data.userId)
            );
        });

        socket.on("error", (error) => {
            console.log("socket error:", error);
        });

        socket.on("disconnect", (reason) => {
            console.log("socket disconnected:", reason);

        })
        socket.on("cursor:moved", (data) => {
            setCursors(prev => ({
                ...prev,
                [data.userId]: {
                    x: data.cursorPosition.x,
                    y: data.cursorPosition.y,
                    fullName: data.fullName || "",
                    cursorColor: data.cursorColor || "#6366F1"
                }
            }));
        });
        socket.on("user:left", (data) => {
            setCursors(prev => {
                const updated = { ...prev };
                delete updated[data.userId];
                return updated;
            });
            setOnlineMembers(prev =>
                prev.filter(m => m.userId !== data.userId)
            );
        });
        return () => {
            socket.emit("room:leave", roomId);
            socket.off("connect");
            socket.off("room:joined");
            socket.off("user:joined");
            socket.off("user:left");
            socket.off("error");
            socket.off("cursor:moved");
            socket.disconnect();

        };
    }, [roomId]);

    return { onlineMembers, socket,cursors };
};
