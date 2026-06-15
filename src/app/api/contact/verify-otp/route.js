import { NextResponse } from "next/server";
import { getOTP, deleteOTP, verifyOTP } from "../../../lib/otpStore";
import { sendSupportNotification } from "../../../lib/mailer";
import { supabase } from "../../../lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "E-mail é obrigatório." }, { status: 400 });
    }
    if (!otp || !otp.trim()) {
      return NextResponse.json({ error: "Código OTP é obrigatório." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    // Verify OTP
    const isValid = verifyOTP(trimmedEmail, trimmedOtp);
    if (!isValid) {
      return NextResponse.json({ error: "Código incorreto ou expirado." }, { status: 400 });
    }

    // Retrieve the cached form data
    const record = getOTP(trimmedEmail);
    if (!record) {
      return NextResponse.json({ error: "Sessão expirada. Por favor submeta o formulário novamente." }, { status: 400 });
    }

    // Save to Supabase
    if (supabase) {
      const { error: dbError } = await supabase.from("contacts").insert({
        name: record.name,
        email: record.email,
        subject: record.subject,
        message: record.message,
        verified_at: new Date().toISOString(),
      });
      if (dbError) {
        console.error("[Supabase] Failed to insert contact:", dbError.message);
      }
    } else {
      console.warn("[Contact] Supabase not configured — contact not persisted.");
    }

    // Attempt to notify support via SMTP email
    const emailResult = await sendSupportNotification({
      name: record.name,
      email: record.email,
      subject: record.subject,
      message: record.message,
    });

    // Clear the OTP from memory
    deleteOTP(trimmedEmail);

    return NextResponse.json({
      success: true,
      message: "Mensagem verificada e enviada com sucesso!",
      notificationSent: emailResult.success,
    });
  } catch (error) {
    console.error("Error in /api/contact/verify-otp:", error);
    return NextResponse.json({ error: "Erro interno ao verificar o código." }, { status: 500 });
  }
}
