import express from "express";
import http from "http";
import { Server } from "socket.io";
import redisClient from "infras/redis/redis";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }, // Allow all origins for simplicity
});

// connect websocket server
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a quiz session
    socket.on("joinQuiz", async (data: { quizId: string; userId: string }) => {
        const { quizId, userId } = data;
        socket.join(quizId);
        console.log(`User ${userId} joined quiz ${quizId}`);
        const leaderboard = await redisClient.sendCommand(['ZREVRANGE', `quiz:${quizId}:leaderboard`, '0', '-1', 'WITHSCORES']);
        io.to(quizId).emit('userJoined',  formatLeaderboard(leaderboard));
    });

    // Submit answer
    socket.on("submitAnswer", async (data: { quizId: string; userId: string; score: number }) => {
        const { quizId, userId, score } = data;
        console.log(data);
        await redisClient.zIncrBy(`quiz:${quizId}:leaderboard`, score, userId);
        const leaderboard = await redisClient.sendCommand(['ZREVRANGE', `quiz:${quizId}:leaderboard`, '0', '-1', 'WITHSCORES']);
        // Broadcast updated leaderboard to the quiz room
        io.to(quizId).emit("updateLeaderboard", formatLeaderboard(leaderboard));
    });

    // Helper: Format leaderboard data
    function formatLeaderboard(data: any) {
        const leaderboard = [];
        for (let i = 0; i < data.length; i += 2) {
            leaderboard.push({ id: data[i], score: parseInt(data[i + 1]) });
        }
        return leaderboard;
    }

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});