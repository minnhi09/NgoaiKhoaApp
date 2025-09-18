import { useState } from "react";
import FileUpload from "./FileUpload.jsx";

export default function ActivityForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("volunteer");
  const [location, setLocation] = useState("");
  const [score, setScore] = useState(0);
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onCreate({
        title,
        date,
        category,
        location,
        score,
        note,
        attachments,
      });
      setTitle("");
      setDate("");
      setCategory("volunteer");
      setLocation("");
      setScore(0);
      setNote("");
      setAttachments([]);
    } finally {
      setSaving(false);
    }
  }

  const handleFileUpload = (uploadedFiles) => {
    setAttachments((prev) => [...prev, ...uploadedFiles]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Thêm hoạt động mới
      </h2>

      {/* Tên hoạt động */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên hoạt động <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nhập tên hoạt động"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

      {/* Địa điểm */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa điểm
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Địa điểm tổ chức"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Điểm */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Điểm đạt được
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="number"
          min="0"
          placeholder="0"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </div>

      {/* Ghi chú */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ghi chú thêm về hoạt động..."
          rows="3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* File Upload */}
      <FileUpload onUpload={handleFileUpload} existingFiles={attachments} />

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={saving}
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
                fill="none"
              />
              <path
                fill="currentColor"
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Đang lưu...
          </span>
        ) : (
          "Lưu hoạt động"
        )}
      </button>
    </form>
  );
}
