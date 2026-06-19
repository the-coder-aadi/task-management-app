import * as Brevo from "@getbrevo/brevo"

const client = new Brevo.TransactionalEmailsApi()

// 🔥 IMPORTANT FIX (this is the correct way now)
client.setApiKey(process.env.BREVO_API_KEY)

export default client