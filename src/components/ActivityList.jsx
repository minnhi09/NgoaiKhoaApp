export default function ActivityList({ items, onEdit, onDelete }) {
  if (!items?.length)
    return <div className="text-sm text-gray-500">Chưa có hoạt động nào.</div>;
  return (
    <ul className="grid gap-3">
      {items.map((a) => (
        <li key={a.id} className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-gray-600">
                {a.date} • {a.category} • {a.points ?? 0} điểm
              </div>
              {a.notes && <div className="text-sm mt-1">{a.notes}</div>}
            </div>
            <div className="flex gap-2">
              <button
                className="text-blue-600 underline"
                onClick={() => onEdit(a)}
              >
                Sửa
              </button>
              <button
                className="text-red-600 underline"
                onClick={() => onDelete(a.id)}
              >
                Xoá
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
