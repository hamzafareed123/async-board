import { Socket,Server } from "socket.io";

export const registerSocketHandler =(io:Server)=>{
    io.on("connection",(socket)=>{
        console.log("user connected", (socket as any).userId)
    })
}