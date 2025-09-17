# Copilot Instructions – Ngoại Khóa App

## Công nghệ & Ràng buộc

- **React + Vite**
- **Ngôn ngữ**: JavaScript (không dùng TypeScript)
- **CSS**: Tailwind CSS v4 (không dùng Tailwind v3 syntax)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Múi giờ mặc định**: Asia/Ho_Chi_Minh
- **Privacy-by-design**: dữ liệu ràng buộc uid, không có admin, không xem chéo.

---

## Functional Requirements

### 3.1 Xác thực & Hồ sơ (Firebase Auth)

- Đăng ký/Đăng nhập: email-password; (tùy chọn) Google Sign-In.
- Quên/đổi mật khẩu.
- Hồ sơ cá nhân: tên hiển thị, lớp/khoa, avatar (tùy chọn).
- **AC**:
  - Không đăng nhập → bị chặn vào mọi trang nội bộ.
  - Đăng nhập thành công → chuyển Dashboard cá nhân.

### 3.2 Quản lý Hoạt động (CRUD – Firestore)

- Trường tối thiểu: title*, date*, category*, organizer, location, hours, score, note, attachments[], createdAt, updatedAt. (* = bắt buộc)
- Danh sách: sắp xếp theo date (mới→cũ), lọc, phân trang/vô hạn.
- **AC**: CRUD thành công → dashboard cập nhật tức thì; thiếu trường bắt buộc → báo lỗi rõ ràng.

### 3.3 Minh chứng (Firebase Storage)

- Upload ảnh/file (jpg, png, pdf; ≤ N MB), preview trước khi lưu.
- **AC**:
  - Upload hợp lệ → hiện thumbnail.
  - Sai định dạng/kích thước → từ chối kèm thông báo.

### 3.4 Dashboard trực quan

- KPI: tổng số hoạt động, tổng giờ, tổng điểm, % hoàn thành mục tiêu.
- Biểu đồ: Donut (theo category), Line/Bar (theo tháng).
- **AC**: số liệu khớp 100% Firestore.

### 3.5 Mục tiêu điểm cá nhân

- Đặt/chỉnh mục tiêu (vd: 80/100).
- **AC**: thay đổi mục tiêu → % đạt cập nhật tức thì.

### 3.6 Tìm kiếm, lọc, sắp xếp

- Tìm theo từ khóa.
- Lọc theo khoảng ngày, danh mục, khoảng điểm/giờ.
- Sắp xếp: date, score, hours.

### 3.7 Xuất dữ liệu

- Xuất CSV/PDF với cột & khoảng thời gian chọn lọc.
- Mặc định không có chia sẻ công khai.

---

## Vai trò Người dùng

- **Student** (duy nhất)
  - Tạo tài khoản, đăng nhập/đăng xuất.
  - CRUD hoạt động cá nhân.
  - Upload/xem/xóa minh chứng.
  - Đặt mục tiêu, xem dashboard.
  - Tìm kiếm/lọc, xuất dữ liệu.

---

## Security Requirements

- Tất cả dữ liệu ràng buộc uid.
- Không cho phép query vượt uid.
- Không tạo link public mặc định.
- Bật App Check cho Firestore/Storage khi deploy.
- Nếu chưa đăng nhập → ẩn toàn bộ dữ liệu.

---

## Phi chức năng (NFR)

- Hiệu năng: render dashboard < 1s với ≤ 300 hoạt động.
- Ảnh thumbnail < 200KB.
- Khả dụng: chạy ổn định trên Chrome/Edge/Firefox/Mobile Chrome.
- Khả bảo trì: tách lớp data services và UI.
- UX: form autosave draft, cảnh báo rời trang khi chưa lưu.

---

## MoSCoW Backlog

- **Must**: Auth, CRUD, Upload minh chứng, Dashboard, Mục tiêu điểm, Lọc/Tìm kiếm, Xuất CSV.
- **Should**: Biểu đồ Donut + Line, Autocomplete danh mục, Offline cache.
- **Could**: Nhập CSV, Đa ngôn ngữ, Xóa mềm + Undo.
- **Won’t**: Duyệt/đánh giá admin, xem chéo, chia sẻ công khai mặc định.

---

## Luồng màn hình chính

1. Auth → Onboarding (tên, lớp, mục tiêu).
2. Dashboard → Thêm hoạt động → Form + Upload minh chứng → Lưu.
3. Danh sách → Xem/Lọc/Sửa/Xóa → Mở chi tiết + Minh chứng.
4. Mục tiêu → thiết lập/chỉnh → xem tiến độ.
5. Xuất dữ liệu → CSV/PDF.

---

## Gợi ý Mô hình Firestore

```text
users/{uid}/activities/{activityId}
users/{uid}/stats/{statId}
```
