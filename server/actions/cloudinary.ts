'use server';

import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/auth';

// Configure the SDK
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getSignature() {
  // 1. Authenticate the user (only logged-in users/vendors should be able to upload)
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  try {
    // 2. Generate a timestamp (required by Cloudinary)
    const timestamp = Math.round(new Date().getTime() / 1000);

    // 3. Generate the signature using the Cloudinary SDK
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET!
    );

    // 4. Return the necessary data to the client
    return { 
      timestamp, 
      signature, 
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
    };
  } catch (error) {
    console.error('Cloudinary signature error:', error);
    return { error: 'Failed to generate upload signature' };
  }
}

export async function uploadPodcastVideo(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  try {
    const file = formData.get('file') as File;
    if (!file) return { error: 'No file provided' };

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ secureUrl?: string; error?: string }>((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'podcasts' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary video upload error:', error);
            resolve({ error: 'Video upload failed' });
          } else {
            resolve({ secureUrl: result?.secure_url });
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Upload action error:', error);
    return { error: 'Internal server error during video upload' };
  }
}
