import { NextResponse } from "next/server";
import { initiateC2BPayment } from "../../../lib/mpesaHelper";
import { sendOrderReceiptEmail } from "../../../lib/mailer";
import { supabase } from "../../../lib/supabase";

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

    // Save order to Supabase
    const newOrder = {
      order_id: orderId,
      pharmacy_name: pharmacyName,
      meds: meds,
      total_amount: amount,
      client_email: email.trim().toLowerCase(),
      client_phone: phoneClean,
      mpesa_transaction_id: mpesaResult.transactionId,
      code,
      status: "PAID",
      simulated: !!mpesaResult.simulated,
    };

    if (supabase) {
      const { error: dbError } = await supabase.from("orders").insert(newOrder);
      if (dbError) {
        console.error("[Supabase] Failed to insert order:", dbError.message);
      }
    } else {
      console.warn("[Order] Supabase not configured — order not persisted.");
    }

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
