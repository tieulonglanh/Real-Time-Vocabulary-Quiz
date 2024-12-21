import { createClient } from "redis";

// Initialize Redis client
const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis error:", err));
(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();

export default redisClient;