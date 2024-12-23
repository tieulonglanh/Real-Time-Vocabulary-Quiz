import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import redisClient from "infras/redis/redis";
import { LeaderboardBroadcastService } from "services/leaderboardBroadcastService";

describe("Test leaderboard socket.io", () => {
    let io: Server;
    let serverSocket: ServerSocket;
    let clientSocket: ClientSocket;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer, {
            cors: { origin: "*" },
        });
        const broadcastService = new LeaderboardBroadcastService({server: io, redis: redisClient});
        broadcastService.registerHandlers();
        
        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            clientSocket = ioc(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.disconnect();
    });

    test("should do connection and joinQuiz", (done) => {
        const quizId = 'quiz12345';
        const userId = 'tieulonglanh1';
        const score = 100;
        redisClient.sendCommand(['DEL', `quiz:${quizId}:leaderboard`]);
        redisClient.zIncrBy(`quiz:${quizId}:leaderboard`, score, userId);
        const mock = { "quizId": quizId, "userId": userId };
        clientSocket.on("userJoined", (arg) => {
            expect(arg).toEqual([{
                "id": "tieulonglanh1",
                "score": 100
            }]);
            done();
        });
        serverSocket.on("joinQuiz", (arg) => {
            expect(arg).toEqual(mock);
        });
        clientSocket.emit("joinQuiz", mock);
    });

    test("should do submitAnswer and updateLeaderboard", (done) => {
        const quizId = 'quiz12345';
        const firstUserId = 'tieulonglanh1';
        const firstScore = 100;

        const secondUserId = 'tieulonglanh2';
        const secondScore = 50;

        redisClient.sendCommand(['DEL', `quiz:${quizId}:leaderboard`]);
        redisClient.zIncrBy(`quiz:${quizId}:leaderboard`, firstScore, firstUserId);
        
        clientSocket.on("updateLeaderboard", (arg) => {
            expect(arg).toEqual([{
                "id": firstUserId,
                "score": firstScore
            },
            {
                "id": secondUserId,
                "score": secondScore
            }]);
            done();
        });

        serverSocket.on("submitAnswer", (arg) => {
            expect(arg).toEqual({ "quizId": quizId, "userId": secondUserId, "score": secondScore });
        });

        clientSocket.emit("submitAnswer", {
            quizId: quizId,
            userId: secondUserId,
            score: secondScore
        });
    });
});