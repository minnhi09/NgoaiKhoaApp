# Tài liệu Kỹ thuật Chi tiết - Ứng dụng Ngoại Khóa

## 📋 Tổng quan dự án

**Tên dự án**: Ngoại Khóa App  
**Mô tả**: Ứng dụng web theo dõi và quản lý hoạt động ngoại khóa cá nhân  
**Công nghệ**: React + Firebase + Tailwind CSS v4  
**Ngôn ngữ**: JavaScript (không TypeScript)

---

## 🏗️ Kiến trúc hệ thống

### Stack công nghệ

#### Frontend

- **React 19.1.1**: UI library với JSX syntax
- **Vite 7.1.2**: Build tool và development server
- **React Router DOM 7.8.2**: Client-side routing
- **Tailwind CSS 4.1.12**: Utility-first CSS framework

#### Backend & Services

- **Firebase Authentication**: Quản lý đăng nhập/đăng ký
- **Firebase Firestore**: NoSQL database real-time
- **Firebase Storage**: Lưu trữ file minh chứng (ảnh/PDF)

### Cấu trúc thư mục

```
src/
├── components/          # React components tái sử dụng
│   ├── ActivityEditModal.jsx    # Modal chỉnh sửa hoạt động
│   ├── ActivityForm.jsx         # Form thêm hoạt động mới
│   ├── ActivityList.jsx         # Danh sách hoạt động với icons
│   ├── Charts.jsx              # Biểu đồ thống kê (Donut + Bar)
│   ├── ExportButton.jsx        # Xuất CSV
│   ├── FileUpload.jsx          # Upload file với progress
│   ├── Footer.jsx              # Footer layout
│   ├── Header.jsx              # Header navigation + user menu
│   ├── ProfileSetupModal.jsx   # Modal setup tên hiển thị
│   ├── ScoreTargetCard.jsx     # Card mục tiêu điểm
│   ├── SearchFilter.jsx        # Bộ lọc và tìm kiếm
│   └── StatsCard.jsx           # Thẻ thống kê
├── contexts/            # React contexts
│   └── AuthContext.jsx          # Authentication state management
├── layouts/             # Layout components
│   ├── AppLayout.jsx           # Layout có header/footer
│   └── PublicLayout.jsx        # Layout cho login/register
├── lib/                 # External libraries config
│   └── firebase.js             # Firebase configuration
├── pages/               # Route pages
│   ├── Dashboard.jsx           # Trang chính
│   ├── LoginPage.jsx           # Đăng nhập
│   └── RegisterPage.jsx        # Đăng ký
├── services/            # Business logic
│   ├── activitiesService.js    # CRUD hoạt động
│   ├── uploadService.js        # Upload file service
│   └── userService.js          # Quản lý user profile
├── utils/               # Utility functions
│   └── csvExport.js            # Export CSV
├── App.jsx              # Main router
└── main.jsx             # Entry point
```

---

## 🔐 Authentication Flow

### AuthContext.jsx

**Chức năng**: Quản lý global authentication state

**State Management**:

```javascript
const [user, setUser] = useState(null); // Current user
const [loading, setLoading] = useState(true); // Auth loading
```

**API Methods**:

```javascript
login(email, password); // → Promise<UserCredential>
register(email, password); // → Promise<UserCredential>
logout(); // → Promise<void>
```

**Firebase Integration**:

- `onAuthStateChanged`: Real-time auth state listener
- `signInWithEmailAndPassword`: Email login
- `createUserWithEmailAndPassword`: Registration
- `signOut`: Logout

### Protected Routes

```javascript
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Đang tải…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

---

## 📊 Dashboard Core

### Dashboard.jsx

**Role**: Main application interface và data orchestration

**State Management**:

```javascript
const [items, setItems] = useState([]); // Danh sách activities
const [editingActivity, setEditingActivity] = useState(null); // Activity đang edit
const [userProfile, setUserProfile] = useState(null); // User profile
const [filters, setFilters] = useState({}); // Filter state
```

**Computed Statistics**:

```javascript
const stats = {
  totalActivities: items.length,
  totalScore: items.reduce((sum, item) => sum + (item.score || 0), 0),
  activitiesThisMonth: items.filter((item) => {
    const itemDate = new Date(item.date);
    const now = new Date();
    return (
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear()
    );
  }).length,
};
```

**Real-time Data Sync**:

```javascript
useEffect(() => {
  if (!user) return;

  const unsub = subscribeMyActivities(user.uid, setItems);
  return () => unsub && unsub();
}, [user]);
```

---

## 📝 Activity Management

### ActivityForm.jsx

**Chức năng**: Form thêm hoạt động mới với file upload

**Form Fields**:

- `title` (string): Tên hoạt động
- `date` (date): Ngày tham gia
- `category` (enum): Loại hoạt động
- `location` (string): Địa điểm
- `score` (number): Điểm số
- `note` (string): Ghi chú
- `attachments` (array): Files đính kèm

**File Upload Integration**:

```javascript
const handleFileUpload = (uploadedFiles) => {
  setAttachments((prev) => [...prev, ...uploadedFiles]);
};
```

### ActivityList.jsx

**Chức năng**: Hiển thị danh sách hoạt động với icons

**Category Icons**:

```javascript
const getCategoryIcon = (category) => {
  const icons = {
    volunteer: "🤝", // Tình nguyện
    club: "👥", // CLB/Đội nhóm
    competition: "🏆", // Cuộc thi
    seminar: "💡", // Hội thảo
    cultural: "🎨", // Văn hóa - Nghệ thuật
    sports: "⚽", // Thể thao
    academic: "📚", // Học thuật
    other: "📝", // Khác
  };
  return icons[category] || icons.other;
};
```

**Attachment Display**:

- **Images**: Thumbnail 20x20px với preview
- **PDFs**: Download button với filename

**Enhanced Empty State**:

```javascript
if (!items?.length) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-6xl mb-4">😋</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Bạn chưa có hoạt động nào?
      </h3>
      <p className="text-gray-600 mb-6">
        Hãy thêm hoạt động đầu tiên ngay nhé ✨
      </p>
    </div>
  );
}
```

---

## 📂 File Upload System

### uploadService.js

**Chức năng**: Comprehensive Firebase Storage integration

**Core Functions**:

```javascript
// Upload single file với progress tracking
uploadActivityFile(file, uid, docId, onProgress);
// → Promise<{ url, path, name, size, type }>

// Upload multiple files
uploadMultipleFiles(files, uid, docId, onProgress);
// → Promise<Array<FileResult>>

// File validation
validateFile(file);
// → { valid: boolean, error?: string }
```

**File Path Structure**: `/{uid}/activities/{docId}/{filename}`

**Supported Formats**:

- **Images**: JPG, PNG, GIF (max 5MB)
- **Documents**: PDF (max 10MB)

**Progress Tracking**:

```javascript
const onProgress = (progress) => {
  console.log(`Upload: ${progress}%`);
};
```

### FileUpload.jsx

**Features**:

- Drag & drop interface
- File validation với error messages
- Real-time progress bars
- Preview generation
- Multiple file support

---

## 📈 Charts & Analytics

### Charts.jsx

**Components**:

#### CategoryChart (Donut Chart)

```javascript
// Phân bố hoạt động theo category
const categoryData = activities.reduce((acc, activity) => {
  acc[activity.category] = (acc[activity.category] || 0) + 1;
  return acc;
}, {});
```

#### MonthlyChart (Bar Chart)

```javascript
// Xu hướng theo tháng
const monthlyData = activities.reduce((acc, activity) => {
  const month = activity.monthKey; // YYYY-MM format
  acc[month] = (acc[month] || 0) + activity.score;
  return acc;
}, {});
```

**Enhanced Empty States**:

- **CategoryChart**: 📊 emoji + "Chưa có dữ liệu phân loại"
- **MonthlyChart**: 📈 emoji + "Chưa có dữ liệu theo tháng"

---

## 🔥 Firebase Integration

### Collection Structure

#### `activities` Collection

```javascript
// Document structure
{
  uid: string,              // User ID (index field)
  title: string,            // Tên hoạt động
  date: string,             // YYYY-MM-DD format
  category: string,         // Enum category
  location: string,         // Địa điểm
  score: number,            // Điểm số
  note: string,             // Ghi chú
  attachments: Array<{      // File attachments
    url: string,            // Storage download URL
    name: string,           // Original filename
    size: number,           // File size (bytes)
    type: string            // MIME type
  }>,
  monthKey: string,         // YYYY-MM (for aggregation)
  createdAt: Timestamp,     // Creation time
  updatedAt: Timestamp      // Last update
}
```

#### `userProfiles` Collection

```javascript
{
  email: string,
  displayName: string,
  scoreTarget: number,      // Mục tiêu điểm
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### activitiesService.js

**Core CRUD Operations**:

```javascript
// Thêm hoạt động mới
addActivity(uid, data);
// → Promise<string> (document ID)

// Lắng nghe real-time updates
subscribeMyActivities(uid, callback);
// → Function (unsubscribe)

// Cập nhật hoạt động
updateActivity(id, patch);
// → Promise<void>

// Xóa hoạt động
removeActivity(id);
// → Promise<void>
```

**Real-time Sync**:

```javascript
export function subscribeMyActivities(uid, callback) {
  if (!uid) return () => {};

  const ref = collection(db, "activities");
  const q = query(ref, where("uid", "==", uid));

  const unsub = onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Client-side sorting (tránh index requirement)
    const sortedList = list.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    callback(sortedList);
  });

  return unsub;
}
```

---

## 🎨 UI/UX Features

### Responsive Design

- **Mobile-first**: Tailwind responsive breakpoints
- **Grid Layout**: Adaptive columns (lg:grid-cols-4)
- **Touch-friendly**: Adequate tap targets

### Loading States

- **Skeleton loading**: Cards và lists
- **Progress bars**: File uploads
- **Button states**: Disabled during operations

### Error Handling

- **Form validation**: Client-side validation
- **Firebase errors**: User-friendly error messages
- **Fallback UI**: Error boundaries

### Enhanced UX

- **Empty states**: Friendly messaging với emoji
- **Category icons**: Visual identification
- **Real-time updates**: Instant sync
- **File previews**: Image thumbnails

---

## 🔧 Development Workflow

### Build & Development

```bash
# Development server
npm run dev           # → http://localhost:5173

# Production build
npm run build         # → dist/

# Preview production
npm run preview       # → http://localhost:4173
```

### Code Style

- **ESLint**: React hooks rules enabled
- **File naming**: PascalCase components, camelCase services
- **Import style**: Relative imports với .jsx extensions
- **Component structure**: Functional components với hooks

### Environment Variables

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🚀 Deployment

### Firebase Hosting Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init hosting

# Build và deploy
npm run build
firebase deploy
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Firestore security rules setup
- [ ] Firebase Storage rules configured
- [ ] Error logging enabled
- [ ] Performance monitoring setup

---

## 📊 Performance Considerations

### Optimization Strategies

- **Code splitting**: Route-based lazy loading
- **Image optimization**: WebP format, responsive images
- **Bundle analysis**: Vite bundle analyzer
- **Firebase optimization**: Efficient queries, caching

### Real-time Efficiency

- **Client-side sorting**: Tránh Firestore index requirements
- **Selective updates**: Chỉ sync user's own data
- **Connection management**: Proper cleanup listeners

---

## 🔍 Troubleshooting

### Common Issues

#### Firestore Index Error

```javascript
// Lỗi: The query requires an index
// Giải pháp: Bỏ orderBy, sort ở client-side
const q = query(ref, where("uid", "==", uid)); // ✅
// Thay vì: query(ref, where("uid", "==", uid), orderBy("createdAt", "desc")); // ❌
```

#### File Upload Issues

- **CORS errors**: Check Firebase Storage rules
- **File size**: Validate before upload
- **Network issues**: Implement retry logic

#### Authentication Problems

- **Email verification**: Optional but recommended
- **Password strength**: Client-side validation
- **Session persistence**: Firebase handles automatically

---

## 📝 API Reference

### Authentication Context

```javascript
const { user, loading, login, register, logout } = useAuth();
```

### Activities Service

```javascript
import {
  addActivity,
  subscribeMyActivities,
  updateActivity,
  removeActivity,
} from "./services/activitiesService.js";
```

### Upload Service

```javascript
import {
  uploadActivityFile,
  uploadMultipleFiles,
  validateFile,
} from "./services/uploadService.js";
```

---

**Phiên bản**: 1.0.0  
**Cập nhật cuối**: Tháng 9, 2025  
**Tác giả**: Development Team
