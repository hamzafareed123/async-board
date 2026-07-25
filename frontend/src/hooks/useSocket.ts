import { useEffect, useState } from "react";
import { socket } from "../config/socket";

export const useSocket = (roomId: string) => {
    const [onlineMembers, setOnlineMembers] = useState([]);

    const onConnect = ()=>{
        
    }
    const onRoomJoin = (id:string)=>{
        
    }

    useEffect(() => {
        // connect
        socket.on("connection",onConnect);
        // emit room:join
        socket.emit("room:join",onRoomJoin)
        // listen for user:joined
        // listen for user:left
        // return cleanup → disconnect
    }, [roomId]);

    return { onlineMembers, socket };
};