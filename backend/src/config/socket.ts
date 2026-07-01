import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env";
import { ERROR_MESSAGE } from "../constants/error-message";
import jwt from 'jsonwebtoken';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ENV.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.use((socket: any, next) => {
    try {
        const token =
            socket.handshake.auth?.token
            || socket.handshake.headers.authorization?.split("Bearer ")[1]
            || socket.handshake.query.token as string;;

        if (!token) {
            return next(new Error(ERROR_MESSAGE.INVALID_TOKEN))
        }

        const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET_KEY) as { userId: string };

        socket.userId = decoded.userId;
        next()

    } catch (error: any) {
        next(error instanceof Error ? error : new Error(ERROR_MESSAGE.INVALID_TOKEN));
    }
})


export { io, server, app };