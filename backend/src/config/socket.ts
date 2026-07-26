import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env";
import { ERROR_MESSAGE } from "../constants/error-message";
import jwt from 'jsonwebtoken';
import { authRepository } from "../modules/auth/auth-repositories";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL, "null", "*"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.use(async (socket: any, next) => {
    try {
        const token =
            socket.handshake.auth?.token
            || socket.handshake.headers.authorization?.split("Bearer ")[1]
            || socket.handshake.query.token as string;;

        if (!token) {
            return next(new Error(ERROR_MESSAGE.INVALID_TOKEN))
        }

        const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET_KEY) as { userId: string };
        const user = await authRepository.findUserById(decoded.userId);
        if (!user) return next(new Error("User not Found"))

        socket.data.userId = user._id.toString();
        socket.data.fullName = user.fullName;
        socket.data.profilePic = user.profilePic;
        socket.data.cursorColor = user.cursorColor || "#6366F1";
         

        next()

    } catch (error: any) {
        next(error instanceof Error ? error : new Error(ERROR_MESSAGE.INVALID_TOKEN));
    }
})


export { io, server, app };
