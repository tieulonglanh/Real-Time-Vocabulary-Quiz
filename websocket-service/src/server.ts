import express from "express";
import http from "http";
import { Server } from "socket.io";
import { LeaderboardBroadcastService } from 'services/leaderboardBroadcastService';
import redisClient from "infras/redis/redis";
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});
const broadcastService = new LeaderboardBroadcastService({server: io, redis: redisClient});
broadcastService.registerHandlers();

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});