import redisClient from "infras/redis/redis";

export type LeaderboardBroadcastServiceOps = {
    server: any, 
    redis: typeof redisClient
}