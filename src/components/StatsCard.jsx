export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}) {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-600 bg-blue-50",
    green: "bg-green-500 text-green-600 bg-green-50",
    purple: "bg-purple-500 text-purple-600 bg-purple-50",
    orange: "bg-orange-500 text-orange-600 bg-orange-50",
    red: "bg-red-500 text-red-600 bg-red-50",
  };

  const [bgColor, textColor, containerBg] = colorClasses[color].split(" ");

  return (
    <div className={`${containerBg} rounded-lg p-6 border border-gray-200`}>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`${bgColor} p-3 rounded-lg`}>
            <div className={`${textColor} h-6 w-6`}>{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}
