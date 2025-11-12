import nodemailer from 'nodemailer';

async function sendEmail(email: string,
  subject: string,
  text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.SECURE === 'true',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text
    });
    console.log("Email enviado com sucesso!");
  } catch (error) {
    console.error('Erro, email não enviado', error);
  }
};

export default sendEmail;