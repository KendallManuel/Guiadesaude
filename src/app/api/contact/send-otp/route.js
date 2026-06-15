import { NextResponse } from "next/server";
import { saveOTP } from "../../../lib/otpStore";
import { sendOTPEmail } from "../../../lib/mailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate inputs
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    }
    if (!email || !email.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }
    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: "Assunto é obrigatório." }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Mensagem é obrigatória." }, { status: 400 });
    }

    // Generate a 6-digit OTP (e.g. 102938)
    const otpVal = Math.floor(100000 + Math.random() * 900000).toString();

    // Cache the form details and OTP in memory (5-minute expiration)
    saveOTP(email.trim(), {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      otp: otpVal,
    }, 5);

    // Attempt to send SMTP email
    const emailResult = await sendOTPEmail(email.trim(), name.trim(), otpVal);

    const response = {
      success: true,
      message: "Código de verificação enviado para o seu e-mail.",
      emailSent: emailResult.success,
    };

    // Include the OTP in development/simulation mode if SMTP isn't set up
    if (!emailResult.success && emailResult.error === "SMTP_NOT_CONFIGURED") {
      response.simulated = true;
      if (process.env.NODE_ENV !== "production") {
        response.debugOtp = otpVal;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in /api/contact/send-otp:", error);
    return NextResponse.json({ error: "Erro interno do servidor ao processar o pedido." }, { status: 500 });
  }
}
