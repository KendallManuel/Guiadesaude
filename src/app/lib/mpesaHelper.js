import crypto from "crypto";

/**
 * Generates the M-Pesa API Bearer token by encrypting the API key using RSA PKCS#1 padding.
 * Vodacom Mozambique standard requires encrypting the API key with their public key.
 * @param {string} apiKey 
 * @param {string} publicKeyPEM 
 * @returns {string} Base64 encoded encrypted token
 */
export function generateMpesaToken(apiKey, publicKeyPEM) {
  try {
    let key = publicKeyPEM.trim();
    // Add public key headers if they are missing
    if (!key.startsWith("-----BEGIN PUBLIC KEY-----")) {
      key = `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`;
    }

    const buffer = Buffer.from(apiKey);
    const encrypted = crypto.publicEncrypt(
      {
        key: key,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );
    return encrypted.toString("base64");
  } catch (error) {
    console.error("Error generating M-Pesa authorization token:", error);
    throw new Error("Falha na encriptação da chave M-Pesa.");
  }
}

/**
 * Initiates an M-Pesa C2B (Customer to Business) USSD push transaction.
 * @param {string} phone - User M-Pesa phone number (e.g. 841234567)
 * @param {string|number} amount - Total billing amount
 * @param {string} orderId - Unique order id
 * @returns {Promise<{success: boolean, transactionId?: string, simulated?: boolean, responseCode: string, responseDesc: string}>}
 */
export async function initiateC2BPayment(phone, amount, orderId) {
  const apiKey = process.env.MPESA_API_KEY;
  const publicKey = process.env.MPESA_PUBLIC_KEY;
  const serviceProviderCode = process.env.MPESA_SERVICE_PROVIDER_CODE || "171717";

  // Check if API settings are present; if not, return mock success (developer simulation)
  if (!apiKey || !publicKey) {
    console.warn("[M-PESA CONFIG MISSING] Running in simulated mode.");
    
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    // Generate a simulated transaction reference (standard 10 alphanumeric caps)
    const simTxId = "MP" + Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      success: true,
      simulated: true,
      transactionId: simTxId,
      responseCode: "INS-0",
      responseDesc: "Request processed successfully (Simulated)"
    };
  }

  // Format phone number to Vodacom standards (e.g., 25884xxxxxxx)
  let msisdn = phone.trim().replace("+", "");
  if (!msisdn.startsWith("258")) {
    msisdn = "258" + msisdn;
  }

  try {
    const token = generateMpesaToken(apiKey, publicKey);
    
    // Vodacom Mozambique Sandbox IPG Endpoint
    const url = "https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/";

    const body = {
      input_TransactionReference: `T${orderId.slice(0, 5).toUpperCase()}`,
      input_CustomerMSISDN: msisdn,
      input_Amount: parseFloat(amount).toFixed(2),
      input_ThirdPartyReference: orderId,
      input_ServiceProviderCode: serviceProviderCode
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Origin": "developer.mpesa.vm.co.mz"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (response.ok && data.output_ResponseCode === "INS-0") {
      return {
        success: true,
        transactionId: data.output_TransactionID,
        conversationId: data.output_ConversationID,
        responseCode: data.output_ResponseCode,
        responseDesc: data.output_ResponseDesc
      };
    } else {
      return {
        success: false,
        responseCode: data?.output_ResponseCode || "INS-XX",
        responseDesc: data?.output_ResponseDesc || "Transacção rejeitada pelo utilizador ou saldo insuficiente."
      };
    }
  } catch (error) {
    console.error("M-Pesa API transaction request failed:", error);
    return {
      success: false,
      responseCode: "ERR-CONN",
      responseDesc: `Erro ao comunicar com a plataforma M-Pesa: ${error.message}`
    };
  }
}
