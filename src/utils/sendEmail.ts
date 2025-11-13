import nodemailer from "nodemailer";

async function sendEmail(email: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587),
      secure: (process.env.SMTP_SECURE || process.env.SECURE) === "true",
      auth: {
        user: process.env.SMTP_USER || process.env.USER,
        pass: process.env.SMTP_PASS || process.env.PASS,
      },
      connectionTimeout: 15_000,
      socketTimeout: 15_000,
    });

    await transporter.verify();
    console.log("✅ SMTP OK");

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email enviado com sucesso!");
  } catch (error: any) {
    console.error('Email não pode ser enviado:', error.message);
    throw error;
  }
}

export default sendEmail;
