import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transportOptions: SMTPTransport.Options = {
      host: process.env.SMTP_HOST,
      service: process.env.SERVICE,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 15_000,
      socketTimeout: 15_000,
    };

    const transporter = nodemailer.createTransport(transportOptions);

    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject,
      text,
    });

    console.log(`✅ Email enviado: ${email} (${info.messageId ?? "no-id"})`);
    return info;
  } catch (error: any) {
    console.error(`❌ Erro ao enviar email: ${error.message}`);
    throw error;
  }
}

export default sendEmail;