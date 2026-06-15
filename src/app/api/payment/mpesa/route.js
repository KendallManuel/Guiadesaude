import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { initiateC2BPayment } from "../../../lib/mpesaHelper";
import { sendOrderReceiptEmail } from "../../../lib/mailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, amount, orderId, pharmacyName, meds, code } = body;

    // Validation checks
    if (!email || !email.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "E-mail inválido para envio de recibo." }, { status: 400 });
    }
    
    // Mozambique Vodacom M-Pesa phone number validation (84xxxxxxx or 85xxxxxxx, 9 digits)
    const phoneClean = phone.trim().replace("+", "").replace(/\s/g, "");
    const mzPhoneRegex = /^(258)?(84|85)\d{7}$/;
    if (!mzPhoneRegex.test(phoneClean)) {
      return NextResponse.json({ error: "Número M-Pesa inválido. Use um número Vodacom Moçambique (ex: 84XXXXXXX ou 85XXXXXXX)." }, { status: 400 });
    }

    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: "Valor de pagamento inválido." }, { status: 400 });
    }

    if (!orderId || !pharmacyName || !meds || !meds.length) {
      return NextResponse.json({ error: "Dados do pedido incompletos." }, { status: 400 });
    }

    // Call M-Pesa client helper
    const mpesaResult = await initiateC2BPayment(phoneClean, amount, orderId);

    if (!mpesaResult.success) {
      return NextResponse.json({
        error: mpesaResult.responseDesc || "A transacção M-Pesa falhou ou foi cancelada."
      }, { status: 400 });
    }

    // Save order payload locally
    const dataDir = path.join(process.cwd(), "src", "app", "data");
    const filePath = path.join(dataDir, "orders.json");

    await fs.mkdir(dataDir, { recursive: true });

    let orders = [];
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      orders = JSON.parse(fileData);
    } catch (e) {
      // Ignore if file doesn't exist
    }

    const newOrder = {
      orderId,
      pharmacyName,
      meds,
      totalAmount: amount,
      clientEmail: email.trim().toLowerCase(),
      clientPhone: phoneClean,
      mpesaTransactionId: mpesaResult.transactionId,
      code,
      status: "PAID",
      createdAt: new Date().toISOString(),
      simulated: !!mpesaResult.simulated
    };

    orders.push(newOrder);
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), "utf-8");

    // Send confirmation email
    const emailResult = await sendOrderReceiptEmail(email.trim().toLowerCase(), {
      orderId,
      pharmacyName,
      meds,
      totalAmount: amount,
      mpesaTransactionId: mpesaResult.transactionId,
      code
    });

    return NextResponse.json({
      success: true,
      transactionId: mpesaResult.transactionId,
      simulated: !!mpesaResult.simulated,
      emailSent: emailResult.success,
      message: "Pagamento recebido e recibo enviado."
    });
  } catch (error) {
    console.error("Error in /api/payment/mpesa route:", error);
    return NextResponse.json({ error: "Erro interno do servidor ao processar o pagamento." }, { status: 500 });
  }
}
