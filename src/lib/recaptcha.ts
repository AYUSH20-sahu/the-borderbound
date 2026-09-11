export interface RecaptchaVerificationResult {
  success: boolean;
  score?: number;
  error?: string;
}

/**
 * Server-side verification for Google reCAPTCHA v3 tokens
 */
export async function verifyRecaptchaToken(token?: string): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[CRITICAL SECURITY] RECAPTCHA_SECRET_KEY is not defined in production.");
      return { success: false, error: "Bot verification system configuration error." };
    }
    // In local development, bypass with explicit logging
    console.warn("[Development Notice] RECAPTCHA_SECRET_KEY is unset. Bypassing captcha verification.");
    return { success: true, score: 1.0 };
  }

  if (!token) {
    return { success: false, error: "reCAPTCHA verification token is missing." };
  }

  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!data.success || (data.score !== undefined && data.score < 0.5)) {
      return {
        success: false,
        score: data.score,
        error: "Bot verification threshold failed. Request rejected.",
      };
    }

    return {
      success: true,
      score: data.score,
    };
  } catch (err: unknown) {
    console.error("reCAPTCHA verification call failed:", err);
    return {
      success: false,
      error: "Unable to verify reCAPTCHA response at this time.",
    };
  }
}
