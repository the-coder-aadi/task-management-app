const BREVO_API_KEY = process.env.BREVO_API_KEY

async function sendEmail({ to, subject, html }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: "TaskForge",
        email: "codearscommunity@gmail.com"
      },
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err)
  }

  return res.json()
}

export default sendEmail