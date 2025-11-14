import * as brevo from '@getbrevo/brevo';

async function sendEmail(email: string, subject: string, text: string) {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error("❌ BREVO_API_KEY não configurada");
    throw new Error("BREVO_API_KEY missing");
  }

  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { 
      email: process.env.BREVO_FROM_EMAIL || "willianpereirasilva69@gmail.com",
      name: "MERN Auth"
    };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:20px;line-height:1.6">
        <h2>${subject}</h2>
        <p>
          <a href="${text}" style="display:inline-block;padding:12px 24px;background:#667eea;color:white;text-decoration:none;border-radius:5px">
            Verificar Email
          </a>
        </p>
        <p style="color:#666;font-size:12px">Ou copie: <code style="background:#f5f5f5;padding:2px 6px">${text}</code></p>
      </div>
    `;
    sendSmtpEmail.textContent = text;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email enviado via Brevo: ${email} (ID: ${response.body.messageId})`);
    return response;
  } catch (error: any) {
    console.error(`❌ Erro ao enviar email via Brevo: ${error.message}`);
    throw error;
  }
}

export default sendEmail;