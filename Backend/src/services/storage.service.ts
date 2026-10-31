import { Readable } from 'stream';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { db } from '../config/db.js';
import { media } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { AppError } from '../middleware/error.middleware.js';

export interface UploadResult {
  publicId: string;
  secureUrl: string;
  originalName: string;
  mimeType: string;
  fileSizeBytes: number;
  resourceType: string;
}

class StorageService {
  /**
   * Upload an in-memory file buffer directly to Cloudinary.
   * Completely bypasses local disk storage to ensure serverless compatibility.
   */
  async uploadBuffer(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadResult> {
    const isConfigured = Boolean(
      env.CLOUDINARY_CLOUD_NAME &&
      env.CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET &&
      env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud'
    );

    // If Cloudinary is not configured (e.g. offline dev / testing), return simulated asset
    if (!isConfigured) {
      const mockPublicId = `portfolio/mock_${Date.now()}_${originalName.replace(/\s+/g, '_')}`;
      const mockUrl = mimeType.includes('pdf')
        ? `https://res.cloudinary.com/demo/raw/upload/portfolio/sample.pdf`
        : `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80`;

      // Record in media table if DB connection is active
      try {
        await db.insert(media).values({
          publicId: mockPublicId,
          originalName,
          mimeType,
          fileSizeBytes: buffer.length,
          secureUrl: mockUrl,
          resourceType: mimeType.includes('pdf') ? 'raw' : 'image',
        });
      } catch (e) {
        // Soft fail if DB is not connected during unit test
      }

      return {
        publicId: mockPublicId,
        secureUrl: mockUrl,
        originalName,
        mimeType,
        fileSizeBytes: buffer.length,
        resourceType: mimeType.includes('pdf') ? 'raw' : 'image',
      };
    }

    return new Promise((resolve, reject) => {
      const isPdf = mimeType.includes('pdf');
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: isPdf ? 'raw' : 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'pdf'],
        },
        async (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(
              new AppError(
                `Cloudinary upload failed: ${error?.message || 'Unknown error'}`,
                500,
                'MEDIA_UPLOAD_FAILED'
              )
            );
          }

          try {
            // Persist uploaded asset metadata in database
            await db.insert(media).values({
              publicId: result.public_id,
              originalName,
              mimeType,
              fileSizeBytes: result.bytes || buffer.length,
              secureUrl: result.secure_url,
              resourceType: result.resource_type || (isPdf ? 'raw' : 'image'),
            });

            resolve({
              publicId: result.public_id,
              secureUrl: result.secure_url,
              originalName,
              mimeType,
              fileSizeBytes: result.bytes || buffer.length,
              resourceType: result.resource_type || (isPdf ? 'raw' : 'image'),
            });
          } catch (dbErr) {
            console.error('Failed to log media asset in database:', dbErr);
            // Still resolve with Cloudinary URL
            resolve({
              publicId: result.public_id,
              secureUrl: result.secure_url,
              originalName,
              mimeType,
              fileSizeBytes: result.bytes || buffer.length,
              resourceType: result.resource_type || (isPdf ? 'raw' : 'image'),
            });
          }
        }
      );

      // Pipe file buffer into Cloudinary upload stream
      Readable.from(buffer).pipe(uploadStream);
    });
  }

  /**
   * Delete media asset from Cloudinary and remove its DB record.
   */
  async deleteMedia(publicId: string): Promise<boolean> {
    try {
      if (
        env.CLOUDINARY_CLOUD_NAME &&
        env.CLOUDINARY_API_KEY &&
        env.CLOUDINARY_API_SECRET &&
        env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud'
      ) {
        await cloudinary.uploader.destroy(publicId);
      }
      await db.delete(media).where(eq(media.publicId, publicId));
      return true;
    } catch (error) {
      console.error(`Failed to delete media asset ${publicId}:`, error);
      return false;
    }
  }
}

export const storageService = new StorageService();

