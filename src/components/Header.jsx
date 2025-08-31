import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold">
          Ngoại khóa tracker
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <button onClick={logout} className="rounded-xl px-3 py-2 border">
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="underline">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
