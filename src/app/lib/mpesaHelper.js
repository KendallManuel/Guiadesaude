import crypto from "crypto";

/**
 * Generates the M-Pesa API Bearer token by encrypting the API key
 * using RSA PKCS#1 v1.5 padding with Vodacom Mozambique's public key.
 * @param {string} apiKey - The raw API key string
 * @param {string} publicKeyBase64 - The RSA public key (raw Base64 or PEM)
 * @returns {string} Base64 encoded encrypted Bearer token
 */
export function generateMpesaToken(apiKey, publicKeyBase64) {
  try {
    let key = publicKeyBase64.trim();

    // Add PEM headers if missing (Vodacom provides raw Base64)
    if (!key.startsWith("-----BEGIN PUBLIC KEY-----")) {
      key = `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`;
    }

    const buffer = Buffer.from(apiKey, "utf8");
    const encrypted = crypto.publicEncrypt(
      {
        key,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );

    return encrypted.toString("base64");
  } catch (error) {
    console.error("[M-Pesa] Token generation error:", error.message);
    throw new Error("Falha na encriptação da chave M-Pesa: " + error.message);
  }
}

/**
 * Initiates an M-Pesa C2B (Customer-to-Business) USSD Push transaction.
 *
 * Sandbox endpoint: https://{MPESA_API_HOST}:18352/ipg/v1x/c2bPayment/singleStage/
 * Origin header must match the app registered in the developer portal.
 *
 * @param {string} phone   - Subscriber MSISDN, e.g. "841234567" or "258841234567"
 * @param {string|number} amount - Amount in MZN (e.g. 150 or "150.00")
 * @param {string} orderId - Unique order reference (alphanumeric, max ~20 chars)
 * @returns {Promise<{
 *   success: boolean,
 *   transactionId?: string,
 *   conversationId?: string,
 *   simulated?: boolean,
 *   responseCode: string,
 *   responseDesc: string
 * }>}
 */
export async function initiateC2BPayment(phone, amount, orderId) {
  const apiKey             = process.env.MPESA_API_KEY;
  const publicKey          = process.env.MPESA_PUBLIC_KEY;
  const apiHost            = process.env.MPESA_API_HOST || "api.sandbox.vm.co.mz";
  const origin             = process.env.MPESA_ORIGIN   || "developer.mpesa.vm.co.mz";
  const serviceProviderCode = process.env.MPESA_SERVICE_PROVIDER_CODE || "171717";

  // ── Simulation mode (no credentials configured) ─────────────────────────────
  if (!apiKey || !publicKey) {
    console.warn("[M-Pesa] Credentials not configured — running in SIMULATION mode.");
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const simTxId =
      "SIM" + Math.random().toString(36).substring(2, 10).toUpperCase();

    return {
      success: true,
      simulated: true,
      transactionId: simTxId,
      responseCode: "INS-0",
      responseDesc: "Request processed successfully (Simulated)",
    };
  }

  // ── Normalise phone to E.164 (258XXXXXXXXX) ─────────────────────────────────
  let msisdn = phone.trim().replace(/\+/g, "").replace(/\s/g, "");
  if (!msisdn.startsWith("258")) {
    msisdn = "258" + msisdn;
  }

  // ── Build a safe transaction reference (max 16 alphanumeric chars) ───────────
  const txRef = ("T" + orderId.replace(/[^A-Z0-9]/gi, "").toUpperCase()).slice(0, 16);

  // ── Generate Bearer token ────────────────────────────────────────────────────
  let token;
  try {
    token = generateMpesaToken(apiKey, publicKey);
  } catch (err) {
    return {
      success: false,
      responseCode: "ERR-TOKEN",
      responseDesc: err.message,
    };
  }

  // ── Vodacom Mozambique sandbox API endpoint ───────────────────────────────────
  // Port 18352 is the published sandbox port for IPG v1x.
  const url = `https://${apiHost}:18352/ipg/v1x/c2bPayment/singleStage/`;

  const requestBody = {
    input_TransactionReference:  txRef,
    input_CustomerMSISDN:        msisdn,
    input_Amount:                String(parseFloat(amount).toFixed(2)),
    input_ThirdPartyReference:   orderId.slice(0, 20),
    input_ServiceProviderCode:   serviceProviderCode,
  };

  console.log("[M-Pesa] Initiating C2B payment:", {
    url,
    msisdn,
    amount: requestBody.input_Amount,
    txRef,
    orderId: requestBody.input_ThirdPartyReference,
  });

  try {
    const response = await fetch(url, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
        Origin:         origin,
      },
      body: JSON.stringify(requestBody),
      // Allow self-signed sandbox certificates (Node 18+ honours NODE_TLS_REJECT_UNAUTHORIZED)
      // If the sandbox has TLS issues, set NODE_TLS_REJECT_UNAUTHORIZED=0 in .env.local (dev only).
    });

    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text().catch(() => "(empty body)");
      console.error("[M-Pesa] Non-JSON response:", response.status, text);
      return {
        success: false,
        responseCode: "ERR-PARSE",
        responseDesc: `Resposta inesperada da API M-Pesa (HTTP ${response.status}).`,
      };
    }

    console.log("[M-Pesa] API response:", data);

    if (data.output_ResponseCode === "INS-0") {
      return {
        success: true,
        transactionId:  data.output_TransactionID,
        conversationId: data.output_ConversationID,
        responseCode:   data.output_ResponseCode,
        responseDesc:   data.output_ResponseDesc,
      };
    }

    return {
      success: false,
      responseCode: data.output_ResponseCode  || "INS-XX",
      responseDesc: data.output_ResponseDesc  ||
        "Transacção rejeitada pelo utilizador ou saldo insuficiente.",
    };
  } catch (error) {
    console.error("[M-Pesa] Network / fetch error:", error.message);
    return {
      success: false,
      responseCode: "ERR-CONN",
      responseDesc: `Erro ao comunicar com a plataforma M-Pesa: ${error.message}`,
    };
  }
}
