import { useState } from "react";

export default function ScoreTargetCard({
  currentScore,
  target,
  onUpdateTarget,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(target || 100);
  const [saving, setSaving] = useState(false);

  const percentage =
    target > 0 ? Math.min((currentScore / target) * 100, 100) : 0;

  const handleSave = async () => {
    if (newTarget <= 0) {
      alert("Mục tiêu phải lớn hơn 0");
      return;
    }

    setSaving(true);
    try {
      await onUpdateTarget(newTarget);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating target:", error);
      alert("Có lỗi xảy ra khi cập nhật mục tiêu");
    } finally {
      setSaving(false);
    }
  };

  const getProgressColor = () => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Mục tiêu điểm</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mục tiêu điểm mới
            </label>
            <input
              type="number"
              min="1"
              value={newTarget}
              onChange={(e) => setNewTarget(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewTarget(target);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Progress Info */}
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">
              {currentScore}
            </span>
            <span className="text-lg text-gray-600">/ {target} điểm</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>

          {/* Percentage */}
          <div className="text-center">
            <span className={`text-2xl font-bold ${getTextColor()}`}>
              {percentage.toFixed(1)}%
            </span>
            <p className="text-sm text-gray-600 mt-1">
              {percentage >= 100
                ? "🎉 Chúc mừng! Bạn đã hoàn thành mục tiêu!"
                : `Còn ${target - currentScore} điểm nữa để đạt mục tiêu`}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            {percentage >= 100 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Hoàn thành
              </span>
            ) : percentage >= 75 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🚀 Gần hoàn thành
              </span>
            ) : percentage >= 50 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ⚡ Đang tiến bộ
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                💪 Bắt đầu nào!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
