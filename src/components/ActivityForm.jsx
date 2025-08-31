import { useState } from "react";

export default function ActivityForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [points, setPoints] = useState(0);
  const [category, setCategory] = useState("volunteer");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onCreate({ title, date, points, category, notes });
      setTitle("");
      setDate("");
      setPoints(0);
      setCategory("volunteer");
      setNotes("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow p-4 grid gap-3"
    >
      <h2 className="text-lg font-semibold">Thêm hoạt động</h2>
      <input
        className="border rounded-xl px-3 py-2"
        placeholder="Tên hoạt động"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          className="border rounded-xl px-3 py-2"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          className="border rounded-xl px-3 py-2"
          type="number"
          min="0"
          placeholder="Điểm"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </div>
      <select
        className="border rounded-xl px-3 py-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="volunteer">Tình nguyện</option>
        <option value="club">CLB/Đội nhóm</option>
        <option value="competition">Cuộc thi</option>
        <option value="seminar">Hội thảo</option>
        <option value="other">Khác</option>
      </select>
      <textarea
        className="border rounded-xl px-3 py-2"
        placeholder="Ghi chú"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button
        className="rounded-xl px-3 py-2 bg-black text-white"
        disabled={saving}
      >
        {saving ? "Đang lưu…" : "Lưu hoạt động"}
      </button>
    </form>
  );
}
