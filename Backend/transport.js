import { Resend } from "resend";

const transport = new Resend(process.env.RESEND_API_KEY);

export default transport;