import { createClient } from "redis"

const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: false
    }
})

client.on("error", (err) => {
    console.log("Redis Error:", err.message)
})

export async function connectRedis() {
    try {
        await client.connect()
        console.log("Redis connected successfully")
    } catch (error) {
        console.log("Redis connection failed:", error.message)
    }
}

export default client