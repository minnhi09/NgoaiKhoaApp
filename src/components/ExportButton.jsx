import { exportToCSV } from "../utils/csvExport.js";

export default function ExportButton({
  data,
  disabled = false,
  className = "",
}) {
  const handleExport = () => {
    exportToCSV(data);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || !data || data.length === 0}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
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
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Xuất CSV ({data?.length || 0})
    </button>
  );
}
