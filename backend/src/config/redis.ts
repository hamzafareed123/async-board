import Redis from "ioredis"
import { ENV } from "./env";

const redis = new Redis({
    host:ENV.REDIS_HOST,
    port:ENV.REDIS_PORT,

    retryStrategy:(times)=>Math.min(times*50,2000)
})

redis.on("connect",()=>{
    console.log("redis connected")
})

redis.on("error",(err)=>{
    console.log("redis error",err)
})

export default redis;