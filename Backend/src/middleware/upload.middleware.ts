import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { AppError } from './error.middleware.js';

// Allowed MIME types for portfolio uploads
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new AppError(
        `Unsupported file type: ${file.mimetype}. Allowed types are: JPG, PNG, WebP, AVIF, GIF, SVG, and PDF.`,
        400,
        'INVALID_FILE_TYPE'
      )
    );
  }
};

/**
 * In-memory Multer uploader.
 * Keeps uploaded files strictly in RAM buffers to allow serverless memory streaming.
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 Megabytes maximum limit
  },
  fileFilter,
});

