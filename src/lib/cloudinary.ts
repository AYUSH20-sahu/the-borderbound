import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary if credentials exist in .env
if (
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
}

/**
 * Uploads a base64 or buffer file to Cloudinary with strict free-tier compression
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: "borderbound_photos" | "borderbound_videos",
  resourceType: "image" | "video"
): Promise<UploadResult> {
  const isCloudinaryConfigured =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!isCloudinaryConfigured) {
    // Development fallback if Cloudinary credentials aren't yet plugged into .env.local
    console.warn(
      "[Cloudinary] API keys not detected in .env. Falling back to secure mock storage pointer."
    );
    const mockId = `mock_${folder}_${Date.now()}`;
    const mockUrl =
      resourceType === "image"
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
        : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

    return {
      url: mockUrl,
      publicId: mockId,
      format: resourceType === "image" ? "jpg" : "mp4",
      bytes: fileBuffer.length,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // Free-tier optimization: compress images automatically, limit video
        transformation:
          resourceType === "image"
            ? [{ quality: "auto", fetch_format: "auto", width: 1200, crop: "limit" }]
            : [{ quality: "auto", max_video_duration: 60 }],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}
