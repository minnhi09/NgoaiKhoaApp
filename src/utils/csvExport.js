export function exportToCSV(data, filename = "hoat-dong-ngoai-khoa") {
  if (!data || data.length === 0) {
    alert("Không có dữ liệu để xuất");
    return;
  }

  // Define CSV headers
  const headers = [
    "STT",
    "Tên hoạt động",
    "Ngày tham gia",
    "Danh mục",
    "Ban tổ chức",
    "Địa điểm",
    "Số giờ",
    "Điểm",
    "Ghi chú",
    "Số file đính kèm",
  ];

  // Category mapping
  const categoryNames = {
    volunteer: "Tình nguyện",
    club: "CLB/Đội nhóm",
    competition: "Cuộc thi",
    seminar: "Hội thảo",
    cultural: "Văn hóa - Nghệ thuật",
    sports: "Thể thao",
    academic: "Học thuật",
    other: "Khác",
  };

  // Convert data to CSV rows
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((item, index) => {
      const row = [
        index + 1,
        `"${(item.title || "").replace(/"/g, '""')}"`,
        item.date || "",
        categoryNames[item.category] || item.category || "",
        `"${(item.organizer || "").replace(/"/g, '""')}"`,
        `"${(item.location || "").replace(/"/g, '""')}"`,
        item.hours || 0,
        item.score || 0,
        `"${(item.note || "").replace(/"/g, '""')}"`,
        (item.attachments && item.attachments.length) || 0,
      ];
      return row.join(",");
    }),
  ];

  // Create CSV content
  const csvContent = csvRows.join("\n");

  // Add BOM for UTF-8 to display Vietnamese characters correctly in Excel
  const BOM = "\uFEFF";
  const csvWithBOM = BOM + csvContent;

  // Create and download file
  const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
