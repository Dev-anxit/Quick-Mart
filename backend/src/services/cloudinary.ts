import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary keys are configured in environment
const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload a local file to Cloudinary
 * @param filePath Absolute path to local file
 * @returns Secure URL of uploaded image
 */
export async function uploadToCloudinary(filePath: string): Promise<string> {
  if (!isConfigured) {
    throw new Error("Cloudinary credentials are not configured in environment");
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'quick-mart',
  });

  return result.secure_url;
}

export function isCloudinaryConfigured(): boolean {
  return isConfigured;
}
