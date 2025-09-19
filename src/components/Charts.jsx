import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

// Đăng ký các component Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export function CategoryChart({ activities }) {
  // Tính toán dữ liệu theo category
  const categoryData = activities.reduce((acc, activity) => {
    const cat = activity.category || "other";
    acc[cat] = (acc[cat] || 0) + (activity.score || 0);
    return acc;
  }, {});

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

  const colors = [
    "#3B82F6", // blue
    "#10B981", // green
    "#8B5CF6", // purple
    "#F59E0B", // yellow
    "#EF4444", // red
    "#F97316", // orange
    "#6366F1", // indigo
    "#6B7280", // gray
  ];

  const data = {
    labels: Object.keys(categoryData).map((cat) => categoryNames[cat] || cat),
    datasets: [
      {
        label: "Điểm theo danh mục",
        data: Object.values(categoryData),
        backgroundColor: colors.slice(0, Object.keys(categoryData).length),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} điểm (${percentage}%)`;
          },
        },
      },
    },
  };

  if (Object.keys(categoryData).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8">
          <div className="text-4xl mb-3">📊</div>
          <h4 className="font-medium text-gray-900 mb-2">Biểu đồ thống kê</h4>
          <p className="text-gray-500 text-sm">
            Thêm hoạt động để xem phân bố theo danh mục
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
}

export function MonthlyChart({ activities }) {
  // Tính toán dữ liệu theo tháng
  const monthlyData = activities.reduce((acc, activity) => {
    if (!activity.date) return acc;

    const date = new Date(activity.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = {
        activities: 0,
        score: 0,
      };
    }

    acc[monthKey].activities += 1;
    acc[monthKey].score += activity.score || 0;

    return acc;
  }, {});

  // Sắp xếp theo thời gian và lấy 6 tháng gần nhất
  const sortedMonths = Object.keys(monthlyData).sort().slice(-6);

  const data = {
    labels: sortedMonths.map((month) => {
      const [year, monthNum] = month.split("-");
      return `${monthNum}/${year}`;
    }),
    datasets: [
      {
        label: "Số hoạt động",
        data: sortedMonths.map((month) => monthlyData[month].activities),
        backgroundColor: "#3B82F6",
        borderColor: "#1D4ED8",
        borderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Tổng điểm",
        data: sortedMonths.map((month) => monthlyData[month].score),
        backgroundColor: "#10B981",
        borderColor: "#059669",
        borderWidth: 2,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Xu hướng hoạt động theo tháng (6 tháng gần nhất)",
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Tháng/Năm",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Số hoạt động",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Điểm",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (sortedMonths.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8">
          <div className="text-4xl mb-3">📈</div>
          <h4 className="font-medium text-gray-900 mb-2">
            Xu hướng theo tháng
          </h4>
          <p className="text-gray-500 text-sm">
            Thêm hoạt động để xem xu hướng theo thời gian
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
