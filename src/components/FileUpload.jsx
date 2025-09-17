import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

export default function FileUpload({ onUpload, existingFiles = [] }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return "Chỉ chấp nhận file JPG, PNG hoặc PDF";
    }
    if (file.size > maxSize) {
      return "File không được vượt quá 5MB";
    }
    return null;
  };

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      error: validateFile(file),
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const uploadFiles = async () => {
    const validFiles = files.filter((f) => !f.error);
    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = validFiles.map(async (fileObj) => {
        const storageRef = ref(
          storage,
          `activities/${Date.now()}_${fileObj.file.name}`
        );
        const snapshot = await uploadBytes(storageRef, fileObj.file);
        const url = await getDownloadURL(snapshot.ref);

        return {
          name: fileObj.file.name,
          type: fileObj.file.type,
          size: fileObj.file.size,
          url: url,
          uploadedAt: new Date().toISOString(),
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      onUpload(uploadedFiles);

      // Clear files after upload
      files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      setFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Có lỗi xảy ra khi upload file. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minh chứng (Ảnh/PDF)
        </label>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              Chọn file
            </label>
            <span> hoặc kéo thả file vào đây</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF tối đa 5MB</p>

          <input
            id="file-upload"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">File đã chọn:</h4>
          {files.map((fileObj) => (
            <div
              key={fileObj.id}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                {fileObj.preview ? (
                  <img
                    src={fileObj.preview}
                    alt="Preview"
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {fileObj.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {fileObj.error && (
                    <p className="text-xs text-red-600">{fileObj.error}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeFile(fileObj.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Xóa
              </button>
            </div>
          ))}

          {files.some((f) => !f.error) && (
            <button
              onClick={uploadFiles}
              disabled={uploading}
              className="w-full bg-green-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {uploading
                ? "Đang upload..."
                : `Upload ${files.filter((f) => !f.error).length} file`}
            </button>
          )}
        </div>
      )}

      {/* Existing files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            File đã tải lên:
          </h4>
          {existingFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                {file.type?.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <div className="h-10 w-10 bg-green-100 rounded flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Đã tải lên{" "}
                    {new Date(file.uploadedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Xem
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
