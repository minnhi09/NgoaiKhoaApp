import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import ActivityForm from "../components/ActivityForm.jsx";
import ActivityList from "../components/ActivityList.jsx";
import ActivityEditModal from "../components/ActivityEditModal.jsx";
import StatsCard from "../components/StatsCard.jsx";
import ScoreTargetCard from "../components/ScoreTargetCard.jsx";
import { CategoryChart, MonthlyChart } from "../components/Charts.jsx";
import SearchFilter, { applyFilters } from "../components/SearchFilter.jsx";
import ExportButton from "../components/ExportButton.jsx";
import {
  addActivity,
  subscribeMyActivities,
  removeActivity,
  updateActivity,
} from "../services/activitiesService.js";
import { getUserProfile, updateScoreTarget } from "../services/userService.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState({});

  const filteredItems = applyFilters(items, filters);

  const stats = {
    totalActivities: items.length,
    totalScore: items.reduce((sum, item) => sum + (item.score || 0), 0),
    activitiesThisMonth: items.filter((item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      const now = new Date();
      return (
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  useEffect(() => {
    if (!user) return;

    const unsub = subscribeMyActivities(user.uid, setItems);

    getUserProfile(user.uid)
      .then((profile) => {
        if (profile) {
          setUserProfile(profile);
        }
      })
      .catch(console.error);

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

  function handleEdit(activity) {
    setEditingActivity(activity);
  }

  async function handleSaveEdit(id, data) {
    await updateActivity(id, data);
    setEditingActivity(null);
  }

  async function handleUpdateTarget(newTarget) {
    await updateScoreTarget(user.uid, newTarget);
    setUserProfile((prev) => ({ ...prev, scoreTarget: newTarget }));
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Tổng hoạt động"
            value={stats.totalActivities}
            subtitle="hoạt động đã tham gia"
            color="blue"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />
          <StatsCard
            title="Tổng điểm"
            value={`${stats.totalScore}/${userProfile?.scoreTarget || 100}`}
            subtitle={`${
              userProfile?.scoreTarget
                ? ((stats.totalScore / userProfile.scoreTarget) * 100).toFixed(
                    1
                  )
                : 0
            }% hoàn thành`}
            color="purple"
            icon={
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            }
          />
          <StatsCard
            title="Tháng này"
            value={stats.activitiesThisMonth}
            subtitle="hoạt động mới"
            color="orange"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ActivityForm onCreate={handleCreate} uid={user.uid} />
            {userProfile && (
              <ScoreTargetCard
                currentScore={stats.totalScore}
                target={userProfile.scoreTarget || 100}
                onUpdateTarget={handleUpdateTarget}
              />
            )}
          </div>
          <div className="lg:col-span-3 space-y-6">
            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Phân bố theo danh mục
                </h3>
                <CategoryChart activities={items} />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Xu hướng theo tháng
                </h3>
                <MonthlyChart activities={items} />
              </div>
            </div>

            {/* Search and Filter */}
            <SearchFilter onFilterChange={handleFilterChange} />

            {/* Activity List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold">
                  Hoạt động của bạn
                  <span className="text-gray-500 font-normal ml-2">
                    ({filteredItems.length}/{items.length})
                  </span>
                </h2>
                <ExportButton
                  data={filteredItems}
                  className="self-start sm:self-auto"
                />
              </div>
              <ActivityList
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingActivity && (
        <ActivityEditModal
          activity={editingActivity}
          onSave={handleSaveEdit}
          onClose={() => setEditingActivity(null)}
          uid={user.uid}
        />
      )}
    </div>
  );
}
