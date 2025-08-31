import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-semibold mb-4">Đăng ký</h1>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <input
          className="w-full border rounded-xl px-3 py-2 mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded-xl px-3 py-2 mb-4"
          type="password"
          placeholder="Mật khẩu (>= 6 ký tự)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="w-full rounded-xl px-3 py-2 bg-black text-white"
        >
          {loading ? "Đang tạo…" : "Đăng ký"}
        </button>
        <p className="text-sm mt-3">
          Đã có tài khoản?{" "}
          <Link className="underline" to="/login">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
}
