// src/services/uploadService.js
import { storage } from "../lib/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

/**
 * Upload file to Firebase Storage
 * @param {File} file - File to upload
 * @param {string} uid - User ID
 * @param {string} activityId - Activity document ID (optional, auto-generate if not provided)
 * @param {function} onProgress - Progress callback (optional)
 * @returns {Promise<object>} - File metadata with download URL
 */
export async function uploadActivityFile(
  file,
  uid,
  activityId = null,
  onProgress = null
) {
  if (!file) throw new Error("No file provided");

  // Generate activity ID if not provided
  const docId = activityId || `temp_${Date.now()}`;

  // Create file path: /{uid}/activities/{docId}/{filename}
  const filename = `${Date.now()}_${file.name}`;
  const filePath = `${uid}/activities/${docId}/${filename}`;
  const storageRef = ref(storage, filePath);

  // Create upload task
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress callback
        if (onProgress) {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        }
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        try {
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Return file metadata
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            url: downloadURL,
            path: filePath,
            filename: filename,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

/**
 * Delete file from Firebase Storage
 * @param {string} filePath - File path in storage
 */
export async function deleteActivityFile(filePath) {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    console.log("File deleted successfully:", filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {string} uid - User ID
 * @param {string} activityId - Activity document ID
 * @param {function} onProgress - Progress callback for each file
 * @returns {Promise<object[]>} - Array of file metadata
 */
export async function uploadMultipleFiles(
  files,
  uid,
  activityId = null,
  onProgress = null
) {
  const uploadPromises = files.map((file, index) => {
    const fileProgress = onProgress
      ? (progress) => onProgress(index, progress)
      : null;
    return uploadActivityFile(file, uid, activityId, fileProgress);
  });

  return Promise.all(uploadPromises);
}

/**
 * Validate file type and size
 * @param {File} file - File to validate
 * @param {number} maxSize - Max size in bytes (default 5MB)
 * @returns {boolean|string} - true if valid, error message if invalid
 */
export function validateFile(file, maxSize = 5 * 1024 * 1024) {
  // Check file type (images and PDFs only)
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type)) {
    return "Chỉ cho phép file ảnh (JPG, PNG, GIF, WebP) và PDF";
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return `Kích thước file không được vượt quá ${maxSizeMB}MB`;
  }

  return true;
}

/**
 * Generate preview URL for images
 * @param {File} file - Image file
 * @returns {string} - Preview URL
 */
export function generatePreviewURL(file) {
  if (file.type.startsWith("image/")) {
    return URL.createObjectURL(file);
  }
  return null;
}
