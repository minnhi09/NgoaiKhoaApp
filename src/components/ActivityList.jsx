export default function ActivityList({ items, onEdit, onDelete }) {
  if (!items?.length)
    return (
      <div className="text-center py-16 px-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-6xl mb-4">😋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Bạn chưa có hoạt động nào?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Hãy thêm hoạt động đầu tiên ngay nhé ✨
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Thêm hoạt động đầu tiên</span>
          </div>
        </div>
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

  const getCategoryIcon = (category) => {
    const icons = {
      volunteer: "🤝", // Tình nguyện
      club: "👥", // CLB/Đội nhóm
      competition: "🏆", // Cuộc thi
      seminar: "💡", // Hội thảo
      cultural: "🎨", // Văn hóa - Nghệ thuật
      sports: "⚽", // Thể thao
      academic: "📚", // Học thuật
      other: "📝", // Khác
    };
    return icons[category] || icons.other;
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
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {getCategoryIcon(activity.category)}
                  </span>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {activity.title}
                  </h3>
                </div>
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
                {activity.location && (
                  <div>
                    <span className="font-medium">Địa điểm:</span>
                    <div>{activity.location}</div>
                  </div>
                )}
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

              {/* Attachments Display */}
              {activity.attachments && activity.attachments.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Minh chứng:
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {activity.attachments.map((file, index) => (
                      <div key={index} className="flex-shrink-0">
                        {file.type?.startsWith("image/") ? (
                          <div className="relative group">
                            <img
                              src={file.url}
                              alt={file.name}
                              className="h-20 w-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => window.open(file.url, "_blank")}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                              <svg
                                className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => window.open(file.url, "_blank")}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-sm font-medium truncate max-w-20">
                              {file.name}
                            </span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activity.note && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mt-3">
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
