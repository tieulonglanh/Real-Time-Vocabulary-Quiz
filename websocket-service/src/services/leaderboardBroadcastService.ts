import { Server, Socket } from "socket.io";
import redisClient from "infras/redis/redis";
import formatRedisSortedSetData from 'helpers/common';
import { QuizApi } from 'infras/apis/quizApi';
import { UserApi } from 'infras/apis/userApi';
import { LeaderboardBroadcastServiceOps } from "types/leaderboardSchemas";

export class LeaderboardBroadcastService {
    private io: Server;
    private redis: typeof redisClient;

    constructor(ops: LeaderboardBroadcastServiceOps) {
        this.io = ops.server;
        this.redis = ops.redis;
    }

    registerHandlers(): void {
        this.io.on("connection", (socket: Socket) => {
            console.log("User connected:", socket.id);
        
            // Join a quiz session
            socket.on("joinQuiz", async (data: { quizId: string; userId: string }) => {
                await this.joinQuizLogic(data, socket);
            });
        
            // Process when user submit answer
            socket.on("submitAnswer", async (data: { quizId: string; userId: string; score: number }) => {
                await this.submitAnswerLogic(data);
            });
        
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }

    private async submitAnswerLogic(data: { quizId: string; userId: string; score: number; }) {
        const { quizId, userId, score } = data;
        const validation = await this.validate();
        if (validation === true) {
            // update score by user id
            const leaderboard = await this.updateLeaderboardData(quizId, score, userId);
            // Broadcast updated leaderboard to the quiz room
            this.io.to(quizId).emit("updateLeaderboard", formatRedisSortedSetData(leaderboard));
        }
    }
    // method to validate user and answer
    private async validate() {
        const quizApi = new QuizApi();
        const userApi = new UserApi();
        const validateAnswerResp = await quizApi.validateAnswer();
        const validateUserResp = await userApi.validateUser();

        return validateAnswerResp.data === true && validateUserResp.data === true ? true : false;
    }

    // update leaderboard data in Redis
    private async updateLeaderboardData(quizId: string, score: number, userId: string) {
        await this.redis.zIncrBy(`quiz:${quizId}:leaderboard`, score, userId);
        // get latest leaderboard data
        const leaderboard = await this.redis.sendCommand(['ZREVRANGE', `quiz:${quizId}:leaderboard`, '0', '-1', 'WITHSCORES']);
        return leaderboard;
    }

    // process logic when a new user join a quiz
    private async joinQuizLogic(data: { quizId: string; userId: string; }, socket: Socket) {
        const { quizId, userId } = data;
        socket.join(quizId);
        console.log(`User ${userId} joined quiz ${quizId}`);
        // get latest leaderboard data when new user joined
        const leaderboard = await this.redis.sendCommand(['ZREVRANGE', `quiz:${quizId}:leaderboard`, '0', '-1', 'WITHSCORES']);
        this.io.to(quizId).emit('userJoined', formatRedisSortedSetData(leaderboard));
    }
}