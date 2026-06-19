import Brevo from "@getbrevo/brevo"

const client = new Brevo.TransactionalEmailsApi()

client.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
)

export default client