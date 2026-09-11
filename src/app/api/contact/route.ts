import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";

const ContactSchema = z.object({
  fullName: z.string().min(2, "Full name required").max(100),
  email: z.string().email("Valid email required"),
  organization: z.string().max(100).optional(),
  category: z.enum([
    "brand_sponsorship",
    "press_media",
    "broadcast_licensing",
    "casting_inquiry",
    "general",
  ]),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
});

// In-memory inquiry store for demo/development
const contactInquiries: Array<Record<string, unknown>> = [];

export async function POST(request: NextRequest) {
  try {
    // 1. Free-tier code-level rate limiting (max 5 messages per 10 mins per IP)
    const ip = request.headers.get("x-forwarded-for") || "contact-client";
    const limit = checkRateLimit(`contact_${ip}`, 5, 10 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    // 2. Server-side validation
    const body = await request.json();
    const validated = ContactSchema.safeParse(body);

    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(". ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const data = validated.data;
    const inquiryId = `INQ-${Date.now().toString().slice(-6)}`;

    const record = {
      inquiryId,
      ...data,
      receivedAt: new Date().toISOString(),
    };

    contactInquiries.push(record);
    console.log(`[Contact] New inquiry received [${inquiryId}]: ${data.category} from ${data.email}`);

    return NextResponse.json({
      success: true,
      inquiryId,
      message: "Your inquiry has been routed to The Borderbound executive team.",
    });
  } catch (err: unknown) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to process transmission. Please try again." },
      { status: 500 }
    );
  }
}
