import Redis from "ioredis";
// import { ApiError } from "../utils/ApiError";

const redis = new Redis(process.env.REDIS_URL as string);

redis.on("connect", () => {
  console.log("Redis connected successfully!");
});

redis.on("error", (err) => {
  console.log("Redis error:", err);
});

export default redis;

