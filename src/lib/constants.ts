export const UPLOAD_LIMITS = {
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_VIDEO_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
  MAX_VIDEO_DURATION_SECONDS: 60, // Strict 60 seconds
  ALLOWED_IMAGE_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
  ALLOWED_IMAGE_MIMES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_VIDEO_EXTENSIONS: [".mp4", ".webm", ".mov"],
  ALLOWED_VIDEO_MIMES: ["video/mp4", "video/webm", "video/quicktime"],
} as const;

/**
 * Validates file magic bytes/header signature to prevent extension-spoofing
 */
export function validateImageSignature(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }

  // WebP: RIFF ... WEBP
  if (
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46 && // F
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50 // P
  ) {
    return true;
  }

  return false;
}
