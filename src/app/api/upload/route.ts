import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { checkRateLimit } from "@/lib/rateLimit";
import { UPLOAD_LIMITS, validateImageSignature } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting (Max 15 uploads per 10 mins per IP)
    const ip = request.headers.get("x-forwarded-for") || "client-ip";
    const limitCheck = checkRateLimit(`upload_${ip}`, 15, 10 * 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: "Upload rate limit reached. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileType = (formData.get("type") as string) || "photo"; // "photo" | "video"

    if (!file) {
      return NextResponse.json({ error: "No media file was uploaded." }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const fileExt = fileName.slice(fileName.lastIndexOf("."));

    // 3. Convert to buffer for byte inspection
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (fileType === "photo") {
      // Validate Extension & MIME
      if (!UPLOAD_LIMITS.ALLOWED_IMAGE_EXTENSIONS.includes(fileExt as any)) {
        return NextResponse.json(
          { error: `Invalid image extension '${fileExt}'. Allowed extensions: ${UPLOAD_LIMITS.ALLOWED_IMAGE_EXTENSIONS.join(", ")}` },
          { status: 400 }
        );
      }
      if (!UPLOAD_LIMITS.ALLOWED_IMAGE_MIMES.includes(file.type as any)) {
        return NextResponse.json(
          { error: "Invalid image MIME format. Only JPG, PNG, and WebP images are permitted." },
          { status: 400 }
        );
      }
      if (buffer.length > UPLOAD_LIMITS.MAX_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Headshot photo exceeds maximum size limit of 5MB." },
          { status: 400 }
        );
      }
      // Validate Magic Bytes
      if (!validateImageSignature(buffer)) {
        return NextResponse.json(
          { error: "Image file signature verification failed. File content does not match expected image headers." },
          { status: 400 }
        );
      }

      const result = await uploadToCloudinary(buffer, "borderbound_photos", "image");
      return NextResponse.json({ success: true, ...result });
    } else {
      // Video Validation
      if (!UPLOAD_LIMITS.ALLOWED_VIDEO_EXTENSIONS.includes(fileExt as any)) {
        return NextResponse.json(
          { error: `Invalid video format. Allowed extensions: ${UPLOAD_LIMITS.ALLOWED_VIDEO_EXTENSIONS.join(", ")}` },
          { status: 400 }
        );
      }
      if (!UPLOAD_LIMITS.ALLOWED_VIDEO_MIMES.includes(file.type as any)) {
        return NextResponse.json(
          { error: "Invalid video MIME format. Accepted formats: MP4, WebM, and MOV." },
          { status: 400 }
        );
      }
      if (buffer.length > UPLOAD_LIMITS.MAX_VIDEO_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Audition video exceeds 50MB. Submissions must be concise clips (30–60 seconds)." },
          { status: 400 }
        );
      }

      const result = await uploadToCloudinary(buffer, "borderbound_videos", "video");
      return NextResponse.json({ success: true, ...result });
    }
  } catch (err: unknown) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Media upload failed. Please try again." },
      { status: 500 }
    );
  }
}
