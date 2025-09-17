export default function ActivityList({ items, onEdit, onDelete }) {
  if (!items?.length)
    return (
      <div className="text-center py-12 text-gray-500">
        <svg
          className="mx-auto h-12 w-12 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p>Chưa có hoạt động nào</p>
        <p className="text-sm">Hãy thêm hoạt động đầu tiên của bạn!</p>
      </div>
    );

  const getCategoryColor = (category) => {
    const colors = {
      volunteer: "bg-green-100 text-green-800",
      club: "bg-blue-100 text-blue-800",
      competition: "bg-purple-100 text-purple-800",
      seminar: "bg-yellow-100 text-yellow-800",
      cultural: "bg-pink-100 text-pink-800",
      sports: "bg-orange-100 text-orange-800",
      academic: "bg-indigo-100 text-indigo-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  const getCategoryName = (category) => {
    const names = {
      volunteer: "Tình nguyện",
      club: "CLB/Đội nhóm",
      competition: "Cuộc thi",
      seminar: "Hội thảo",
      cultural: "Văn hóa - Nghệ thuật",
      sports: "Thể thao",
      academic: "Học thuật",
      other: "Khác",
    };
    return names[category] || category;
  };

  return (
    <div className="space-y-4">
      {items.map((activity) => (
        <div
          key={activity.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  {activity.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                    activity.category
                  )}`}
                >
                  {getCategoryName(activity.category)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Ngày:</span>
                  <div>{activity.date || "Chưa cập nhật"}</div>
                </div>
                {activity.organizer && (
                  <div>
                    <span className="font-medium">Ban tổ chức:</span>
                    <div>{activity.organizer}</div>
                  </div>
                )}
                {activity.location && (
                  <div>
                    <span className="font-medium">Địa điểm:</span>
                    <div>{activity.location}</div>
                  </div>
                )}
                <div>
                  <span className="font-medium">Thời lượng:</span>
                  <div>
                    {activity.hours ? `${activity.hours} giờ` : "Chưa cập nhật"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="font-medium text-gray-900">
                    {activity.score || 0} điểm
                  </span>
                </div>
                {activity.attachments && activity.attachments.length > 0 && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <span>{activity.attachments.length} file đính kèm</span>
                  </div>
                )}
              </div>

              {activity.note && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  <span className="font-medium">Ghi chú: </span>
                  {activity.note}
                </div>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <button
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                onClick={() => onEdit(activity)}
              >
                Sửa
              </button>
              <button
                className="text-red-600 hover:text-red-800 font-medium text-sm"
                onClick={() => onDelete(activity.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
