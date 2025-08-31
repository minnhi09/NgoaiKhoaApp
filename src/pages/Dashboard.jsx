import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import ActivityForm from "../components/ActivityForm.jsx";
import ActivityList from "../components/ActivityList.jsx";
import {
  addActivity,
  subscribeMyActivities,
  removeActivity,
  updateActivity,
} from "../services/activitiesService.js";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeMyActivities(user.uid, setItems);
    return () => unsub && unsub();
  }, [user]);

  async function handleCreate(data) {
    await addActivity(user.uid, data);
  }

  async function handleDelete(id) {
    if (confirm("Xoá hoạt động này?")) {
      await removeActivity(id);
    }
  }

  async function handleEdit(activity) {
    const newTitle = prompt("Sửa tên hoạt động:", activity.title);
    if (newTitle && newTitle !== activity.title) {
      await updateActivity(activity.id, { title: newTitle });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard của {user?.email}</h1>
          <button onClick={logout} className="rounded-xl px-3 py-2 border">
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ActivityForm onCreate={handleCreate} />
        </div>
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Hoạt động của bạn</h2>
            <ActivityList
              items={items}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
