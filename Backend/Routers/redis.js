import dotenv from "dotenv"
dotenv.config()

import { createClient } from "redis"

console.log("REDIS URL:", process.env.REDIS_URL)

const client = createClient({
    url: process.env.REDIS_URL
})

client.on("error", (err) => {
    console.log("Redis Error:", err)
})

await client.connect()

console.log("Redis connected successfully")

export default client