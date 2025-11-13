import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(email: string, subject: string, text: string) {
  // ✅ Em desenvolvimento local, redireciona para seu email
  // ✅ Em produção (Render), usa o email real do usuário
  const targetEmail = process.env.NODE_ENV === 'development' 
    ? 'willianpereirasilva69@gmail.com' 
    : email;

  const isRedirected = targetEmail !== email;

  if (isRedirected) {
    console.log(`⚠️ [DEV] Email redirecionado: ${email} → ${targetEmail}`);
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'MERN Auth <onboarding@resend.dev>',
      to: targetEmail,
      subject: isRedirected ? `[${email}] ${subject}` : subject,
      text,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:20px;line-height:1.6">
          ${isRedirected ? `<p style="background:#fef3c7;border-left:4px solid #f59e0b;padding:10px;margin-bottom:20px">⚠️ <strong>Dev:</strong> ${email}</p>` : ''}
          <h2>${subject}</h2>
          <p><a href="${text}" style="color:#4f46e5">${text}</a></p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Erro Resend:', error);
      throw new Error(`Falha ao enviar email: ${error.message}`);
    }

    console.log(`✅ Email enviado! ID: ${data?.id}`);
    return data;
  } catch (error: any) {
    console.error('❌ Email não enviado:', error.message);
    throw error;
  }
}

export default sendEmail;