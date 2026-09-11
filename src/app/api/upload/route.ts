import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;  // 5MB
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB (Strict 60-second limit)

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limit (Free tier protection: max 15 uploads per 10 mins per IP)
    const ip = request.headers.get("x-forwarded-for") || "client-ip";
    const limitCheck = checkRateLimit(`upload_${ip}`, 15, 10 * 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: "Upload rate limit exceeded. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileType = (formData.get("type") as string) || "photo"; // "photo" | "video"

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // 3. Validate Mime Type & Size
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (fileType === "photo") {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid photo format. Only JPG, PNG, and WebP files are accepted." },
          { status: 400 }
        );
      }
      if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Photo file exceeds maximum free-tier size of 5MB." },
          { status: 400 }
        );
      }

      const result = await uploadToCloudinary(buffer, "borderbound_photos", "image");
      return NextResponse.json({ success: true, ...result });
    } else {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid video format. Only MP4, WebM, and MOV files are accepted." },
          { status: 400 }
        );
      }
      if (buffer.length > MAX_VIDEO_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Video file exceeds 50MB limit. Audition clips must be between 30 and 60 seconds." },
          { status: 400 }
        );
      }

      const result = await uploadToCloudinary(buffer, "borderbound_videos", "video");
      return NextResponse.json({ success: true, ...result });
    }
  } catch (err: unknown) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Media upload failed. Please try again." },
      { status: 500 }
    );
  }
}
