import { useState, useEffect } from "react";
import FileUpload from "./FileUpload.jsx";

export default function ActivityEditModal({ activity, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "volunteer",
    organizer: "",
    location: "",
    hours: 0,
    score: 0,
    note: "",
    attachments: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || "",
        date: activity.date || "",
        category: activity.category || "volunteer",
        organizer: activity.organizer || "",
        location: activity.location || "",
        hours: activity.hours || 0,
        score: activity.score || 0,
        note: activity.note || "",
        attachments: activity.attachments || [],
      });
    }
  }, [activity]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (uploadedFiles) => {
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...uploadedFiles],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(activity.id, formData);
      onClose();
    } catch (error) {
      console.error("Error saving activity:", error);
      alert("Có lỗi xảy ra khi lưu hoạt động. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (!activity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chỉnh sửa hoạt động</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên hoạt động */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên hoạt động <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Ngày và Danh mục */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày tham gia <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="volunteer">Tình nguyện</option>
                <option value="club">CLB/Đội nhóm</option>
                <option value="competition">Cuộc thi</option>
                <option value="seminar">Hội thảo</option>
                <option value="cultural">Văn hóa - Nghệ thuật</option>
                <option value="sports">Thể thao</option>
                <option value="academic">Học thuật</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          {/* Ban tổ chức và Địa điểm */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ban tổ chức
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.organizer}
                onChange={(e) => handleInputChange("organizer", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa điểm
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>

          {/* Số giờ và Điểm */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số giờ tham gia
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                min="0"
                step="0.5"
                value={formData.hours}
                onChange={(e) =>
                  handleInputChange("hours", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm đạt được
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                min="0"
                value={formData.score}
                onChange={(e) =>
                  handleInputChange("score", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
            />
          </div>

          {/* File attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minh chứng hiện tại
            </label>
            {formData.attachments.length > 0 ? (
              <div className="space-y-2 mb-4">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      {file.type?.startsWith("image/") ? (
                        <img
                          src={file.url}
                          alt={file.name}
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
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.uploadedAt &&
                            new Date(file.uploadedAt).toLocaleDateString(
                              "vi-VN"
                            )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Xem
                      </a>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">
                Chưa có file đính kèm
              </p>
            )}

            <FileUpload onUpload={handleFileUpload} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
