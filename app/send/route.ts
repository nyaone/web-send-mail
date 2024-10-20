import * as nodemailer from "nodemailer";
import { SendRequest } from "@/types/sendRequest";

export async function POST(req: Request) {
  // Parse request data
  const reqData: SendRequest = await req.json();
  console.log(reqData);

  // Initialize nodemailer instance
  const transporter = nodemailer.createTransport({
    host: reqData.server.host,
    port: reqData.server.port,
    secure: reqData.server.secure,
    auth: reqData.server.username
      ? {
          user: reqData.server.username,
          pass: reqData.server.password,
        }
      : undefined,
  });

  // Send mail
  const info = await transporter.sendMail({
    from: reqData.sender,
    to: reqData.receivers,
    subject: reqData.mail.subject,
    // text: ???
    html: reqData.mail.body,
  });

  // Respond with status
  return new Response(`${info.messageId} 发送！`, {
    status: 202,
  });
}
