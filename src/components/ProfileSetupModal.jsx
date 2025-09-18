import { useState } from "react";
import { updateDisplayName } from "../services/userService";

export default function ProfileSetupModal({
  user,
  userProfile,
  onSave,
  onClose,
}) {
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setError("Vui lòng nhập tên hiển thị");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await updateDisplayName(user.uid, displayName);
      onSave(displayName.trim());
    } catch (err) {
      console.error("Error updating display name:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {userProfile?.displayName
              ? "Chỉnh sửa tên hiển thị"
              : "Thiết lập tên hiển thị"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {userProfile?.displayName
              ? "Thay đổi tên hiển thị của bạn"
              : "Hãy đặt một tên hiển thị để bắt đầu sử dụng ứng dụng"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên hiển thị *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên của bạn..."
              disabled={isSubmitting}
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            {userProfile?.displayName && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                disabled={isSubmitting}
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !displayName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
