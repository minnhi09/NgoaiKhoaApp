import { useState } from "react";

export default function SearchFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    dateFrom: "",
    dateTo: "",
    scoreMin: "",
    scoreMax: "",
    hoursMin: "",
    hoursMax: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      category: "",
      dateFrom: "",
      dateTo: "",
      scoreMin: "",
      scoreMax: "",
      hoursMin: "",
      hoursMax: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 text-gray-400"
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
          <h3 className="text-lg font-medium text-gray-900">Tìm kiếm và lọc</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Đang lọc
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Xóa bộ lọc
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isExpanded ? "Thu gọn" : "Mở rộng"}
          </button>
        </div>
      </div>

      {/* Search bar - always visible */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoạt động, ban tổ chức, địa điểm..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Advanced filters - collapsible */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả danh mục</option>
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

            {/* Date range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Score and hours range */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm từ
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.scoreMin}
                onChange={(e) => handleFilterChange("scoreMin", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm đến
              </label>
              <input
                type="number"
                min="0"
                placeholder="100"
                value={filters.scoreMax}
                onChange={(e) => handleFilterChange("scoreMax", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giờ từ
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={filters.hoursMin}
                onChange={(e) => handleFilterChange("hoursMin", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giờ đến
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="100"
                value={filters.hoursMax}
                onChange={(e) => handleFilterChange("hoursMax", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to apply filters
export function applyFilters(activities, filters) {
  return activities.filter((activity) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        activity.title,
        activity.organizer,
        activity.location,
        activity.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && activity.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom && activity.date && activity.date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && activity.date && activity.date > filters.dateTo) {
      return false;
    }

    // Score range filter
    if (filters.scoreMin && (activity.score || 0) < Number(filters.scoreMin)) {
      return false;
    }
    if (filters.scoreMax && (activity.score || 0) > Number(filters.scoreMax)) {
      return false;
    }

    // Hours range filter
    if (filters.hoursMin && (activity.hours || 0) < Number(filters.hoursMin)) {
      return false;
    }
    if (filters.hoursMax && (activity.hours || 0) > Number(filters.hoursMax)) {
      return false;
    }

    return true;
  });
}
