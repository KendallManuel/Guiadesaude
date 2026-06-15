import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getOTP, deleteOTP, verifyOTP } from "../../../lib/otpStore";
import { sendSupportNotification } from "../../../lib/mailer";

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

    // Save to local JSON database
    const dataDir = path.join(process.cwd(), "src", "app", "data");
    const filePath = path.join(dataDir, "contacts.json");
    
    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });

    let contacts = [];
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      contacts = JSON.parse(fileData);
    } catch (e) {
      // File doesn't exist yet, we keep the empty array
    }

    const newContact = {
      id: Math.random().toString(36).substring(2, 11),
      name: record.name,
      email: record.email,
      subject: record.subject,
      message: record.message,
      verifiedAt: new Date().toISOString(),
    };

    contacts.push(newContact);
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2), "utf-8");

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
