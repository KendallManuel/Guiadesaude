import nodemailer from "nodemailer";

// Create transporter only if environment variables are configured
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port || "587"),
    secure: port === "465", // true for 465, false for others
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Sends a styled OTP email to the visitor.
 * @param {string} toEmail - Visitor's email address
 * @param {string} name - Visitor's name
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendOTPEmail(toEmail, name, otp) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || `"Guia de Saúde Bairro" <noreply@guia-saude.co.mz>`;

  if (!transporter) {
    console.warn(`[SMTP CONFIG MISSING] Could not send email. OTP for ${toEmail} is ${otp}`);
    return { success: false, error: "SMTP_NOT_CONFIGURED" };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Código de Verificação - Guia de Saúde</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #437df4, #2F6FED); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .greeting { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
        .intro { font-size: 15px; color: #475569; margin-bottom: 24px; }
        .otp-container { background-color: #eef5ff; border: 2px dashed #97c3fd; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #2F6FED; font-family: monospace; margin: 0; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; }
        .warning { font-size: 12px; color: #ef4444; margin-top: 16px; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Guia de Saúde Bairro</h1>
        </div>
        <div class="content">
          <div class="greeting">Olá, ${name}!</div>
          <div class="intro">
            Obrigado por nos contactar. Para submeter a sua mensagem de forma segura e verificar o seu endereço de e-mail, por favor introduza o código de verificação de uso único (OTP) abaixo:
          </div>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
          </div>
          
          <div class="intro">
            Este código é válido por <strong>5 minutos</strong>. Se não solicitou esta verificação, por favor ignore este e-mail.
          </div>
          
          <div class="warning">
            * Importante: Nunca partilhe este código com ninguém. A nossa equipa nunca lhe pedirá este código.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Guia de Saúde Bairro. Todos os direitos reservados.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: `Código de Verificação OTP: ${otp} - Guia de Saúde Bairro`,
      text: `Olá ${name}. O seu código de verificação é ${otp}. Válido por 5 minutos.`,
      html,
    });

    console.log(`[SMTP SUCCESS] Sent OTP email to ${toEmail}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send OTP email to ${toEmail}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a notification email to the support inbox with the verified message.
 * @param {object} contactData - { name, email, subject, message }
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendSupportNotification(contactData) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || `"Guia de Saúde Bairro" <noreply@guia-saude.co.mz>`;
  const supportEmail = process.env.SUPPORT_EMAIL || "suporte@guia-saude.co.mz";

  if (!transporter) {
    console.warn(`[SMTP CONFIG MISSING] Could not send support notification email.`);
    return { success: false, error: "SMTP_NOT_CONFIGURED" };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nova Mensagem de Contacto - Guia de Saúde Bairro</title>
      <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; max-width: 600px; margin: 20px auto; background-color: #fafafa; }
        .header { border-bottom: 2px solid #2F6FED; padding-bottom: 10px; margin-bottom: 20px; }
        .field { margin-bottom: 12px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 4px; padding: 8px; background: white; border: 1px solid #eee; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 style="margin:0; color:#2F6FED;">Nova Mensagem de Contacto (Verificada via OTP)</h2>
        </div>
        <div class="field">
          <div class="label">Nome:</div>
          <div class="value">${contactData.name}</div>
        </div>
        <div class="field">
          <div class="label">E-mail:</div>
          <div class="value">${contactData.email}</div>
        </div>
        <div class="field">
          <div class="label">Assunto:</div>
          <div class="value">${contactData.subject}</div>
        </div>
        <div class="field">
          <div class="label">Mensagem:</div>
          <div class="value" style="white-space: pre-wrap;">${contactData.message}</div>
        </div>
        <div style="font-size:11px; color:#888; margin-top:20px; border-top:1px solid #eee; padding-top:10px;">
          Esta mensagem foi autenticada via código de verificação enviado para o e-mail do remetente.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: supportEmail,
      subject: `[Suporte] ${contactData.subject} - De: ${contactData.name}`,
      text: `Nome: ${contactData.name}\nE-mail: ${contactData.email}\nAssunto: ${contactData.subject}\nMensagem:\n${contactData.message}`,
      html,
    });

    console.log(`[SMTP SUCCESS] Sent support notification. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send support notification email:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a detailed order receipt email to the client after M-Pesa payment.
 * @param {string} toEmail - Customer's email
 * @param {object} order - { orderId, pharmacyName, meds, totalAmount, mpesaTransactionId, code }
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendOrderReceiptEmail(toEmail, order) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || `"Guia de Saúde Bairro" <noreply@guia-saude.co.mz>`;

  if (!transporter) {
    console.warn(`[SMTP CONFIG MISSING] Could not send receipt email. Order ${order.orderId} receipt logged to console.`);
    return { success: false, error: "SMTP_NOT_CONFIGURED" };
  }

  const medsHtml = order.meds.map(med => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 500; color: #334155;">${med.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: center; color: #64748b;">${med.qty}x</td>
      <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: right; font-weight: bold; color: #1e293b;">${med.price} MZN</td>
    </tr>
  `).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Pagamento - Guia de Saúde</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #e11d48, #be123c); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .status-badge { display: inline-block; background-color: #10b981; color: white; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; }
        .intro { font-size: 15px; color: #475569; margin-bottom: 24px; }
        .order-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .order-title { font-size: 14px; font-weight: 800; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; text-transform: uppercase; }
        .med-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .total-row { border-top: 2px solid #e2e8f0; font-weight: 800; }
        .total-row td { padding-top: 15px; }
        .code-container { background-color: #eef5ff; border: 2px dashed #97c3fd; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .code-val { font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #2F6FED; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Confirmação de Pagamento M-Pesa</h1>
        </div>
        <div class="content">
          <div class="status-badge">Pago via M-Pesa</div>
          <div class="intro">
            Confirmamos a recepção do seu pagamento de <strong>${order.totalAmount} MZN</strong> referente ao pedido de medicamentos para levantamento na farmácia <strong>${order.pharmacyName}</strong>.
          </div>

          <div class="code-container">
            <div style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; tracking-wider; margin-bottom: 8px;">Código de Levantamento</div>
            <div class="code-val">${order.code}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 8px;">Apresente este código na farmácia para levantar a sua medicação.</div>
          </div>
          
          <div class="order-card">
            <div class="order-title">Detalhes da Transacção</div>
            <div style="font-size: 13px; color: #475569; margin-bottom: 6px;"><strong>ID do Pedido:</strong> ${order.orderId}</div>
            <div style="font-size: 13px; color: #475569; margin-bottom: 12px;"><strong>Referência M-Pesa:</strong> ${order.mpesaTransactionId}</div>
            
            <div class="order-title" style="margin-top: 16px;">Medicamentos Adquiridos</div>
            <table class="med-table">
              <thead>
                <tr style="text-align: left; font-size: 11px; color: #64748b; border-bottom: 1px solid #e2e8f0;">
                  <th style="padding-bottom: 8px;">Medicamento</th>
                  <th style="padding-bottom: 8px; text-align: center;">Qtd</th>
                  <th style="padding-bottom: 8px; text-align: right;">Preço</th>
                </tr>
              </thead>
              <tbody>
                ${medsHtml}
                <tr class="total-row">
                  <td colspan="2" style="font-size: 15px; color: #1e293b;">Total Pago</td>
                  <td style="font-size: 16px; text-align: right; color: #2F6FED;">${order.totalAmount} MZN</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Guia de Saúde Bairro. Todos os direitos reservados.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: `Recibo de Medicamentos M-Pesa - Pedido #${order.orderId.slice(0, 8).toUpperCase()}`,
      text: `Confirmamos o pagamento de ${order.totalAmount} MZN na farmácia ${order.pharmacyName}. Código de levantamento: ${order.code}.`,
      html,
    });

    console.log(`[SMTP SUCCESS] Sent order receipt to ${toEmail}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send order receipt email to ${toEmail}:`, error);
    return { success: false, error: error.message };
  }
}
