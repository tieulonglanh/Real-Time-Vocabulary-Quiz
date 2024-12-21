import { Server } from "socket.io";
import redisClient from "infras/redis/redis";
import formatRedisSortedSetData from 'helpers/common';

export class BroadcastService {
    private io: Server;

    constructor(server: any) {
        this.io = new Server(server, {
            cors: { origin: "*" },
        });
    }

    registerHandlers(): void {
        this.io.on("connection", (socket) => {
            console.log("User connected:", socket.id);
        
            // Join a quiz session
            socket.on("joinQuiz", async (data: { quizId: string; userId: string }) => {
                const { quizId, userId } = data;
                socket.join(quizId);
                console.log(`User ${userId} joined quiz ${quizId}`);
                const leaderboard = await redisClient.sendCommand(['ZREVRANGE', `quiz:${quizId}:leaderboard`, '0', '-1', 'WITHSCORES']);
                this.io.to(quizId).emit('userJoined',  formatRedisSortedSetData(leaderboard));
            });
        
            // Process when user submit answer
            socket.on("submitAnswer", async (data: { quizId: string; userId: string; score: number }) => {
                const { quizId, userId, score } = data;
                console.log(data);
                await redisClient.zIncrBy(`quiz:${quizId}:leaderboard`, score, userId);
                const leaderboard = await redisClient.sendCommand(['ZREVRANGE', `quiz:${quizId}:leaderboard`, '0', '-1', 'WITHSCORES']);
                // Broadcast updated leaderboard to the quiz room
                this.io.to(quizId).emit("updateLeaderboard", formatRedisSortedSetData(leaderboard));
            });
        
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }
}