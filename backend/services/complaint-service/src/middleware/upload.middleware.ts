import multer from 'multer';
import { config } from '../config';
import { ApiResponse } from '../types';
import { Request, Response, NextFunction } from 'express';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`));
  }
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize, // 10MB by default
    files: 5, // Max 5 files per upload
  },
});

// Error handler for multer errors
export function handleMulterError(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: `File size exceeds ${config.upload.maxFileSize / (1024 * 1024)}MB limit`,
        },
      } as ApiResponse);
      return;
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        success: false,
        error: {
          code: 'TOO_MANY_FILES',
          message: 'Maximum 5 files allowed per upload',
        },
      } as ApiResponse);
      return;
    }

    res.status(400).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: error.message,
      },
    } as ApiResponse);
    return;
  }

  if (error.message && error.message.includes('not allowed')) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: error.message,
      },
    } as ApiResponse);
    return;
  }

  next(error);
}
