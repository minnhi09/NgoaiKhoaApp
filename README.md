# 📚 Ngoại Khóa App

Ứng dụng web theo dõi và quản lý hoạt động ngoại khóa cá nhân được xây dựng bằng React + Firebase với giao diện thân thiện và tính năng real-time.

## ✨ Tính năng chính

### 🔐 **Authentication & Profile**
- Đăng ký/đăng nhập với email/password  
- Quản lý profile cá nhân với tên hiển thị
- Bảo mật dữ liệu theo user riêng biệt

### 📊 **Dashboard & Analytics**
- **KPI Cards**: Tổng hoạt động, tổng điểm, hoạt động tháng này
- **Biểu đồ thống kê**: 
  - 📊 Donut chart phân bố theo category
  - 📈 Bar chart xu hướng theo tháng
- **Mục tiêu điểm số**: Theo dõi progress cá nhân
- **Real-time updates**: Cập nhật tức thì khi có dữ liệu mới

### 📝 **Activity Management**
- **CRUD hoạt động**: Thêm/sửa/xóa với UI trực quan
- **Phân loại hoạt động**: 
  - 🤝 Tình nguyện
  - 👥 CLB/Đội nhóm  
  - 🏆 Cuộc thi
  - 💡 Hội thảo
  - 🎨 Văn hóa - Nghệ thuật
  - ⚽ Thể thao
  - 📚 Học thuật
  - 📝 Khác

### 📂 **File Upload & Storage**
- **Upload minh chứng**: Ảnh (JPG, PNG, GIF) và PDF
- **Progress tracking**: Thanh tiến trình real-time  
- **File preview**: Thumbnail ảnh, nút download PDF
- **Cloud storage**: Firebase Storage integration
- **Validation**: Kiểm tra định dạng và kích thước file

### 🔍 **Search & Filter**
- Tìm kiếm theo tên hoạt động
- Lọc theo category, tháng, điểm số  
- Sắp xếp theo thời gian
- Export CSV dữ liệu

### 🎨 **Enhanced UX**
- **Category icons**: Visual identification với emoji
- **Empty states**: Thông báo thân thiện khuyến khích tham gia
- **Loading states**: Skeleton loading cho trải nghiệm mượt
- **Responsive design**: Mobile-friendly với Tailwind CSS

## 🛠️ Stack công nghệ

- **Frontend**: React 19.1.1 + Vite 7.1.2 + JavaScript
- **Styling**: Tailwind CSS v4.1.12 (utility-first)
- **Routing**: React Router DOM v7.8.2
- **Backend**: Firebase Suite
  - Authentication (đăng nhập/đăng ký)
  - Firestore (NoSQL database real-time)
  - Storage (file upload cloud)
- **Charts**: Chart.js cho data visualization

## 🚀 Cài đặt & Chạy

### 1. Clone repository
```bash
git clone https://github.com/minnhi09/NgoaiKhoaApp.git
cd ngoai-khoa-app
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Firebase
Tạo file `.env` với Firebase config:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Khởi chạy development
```bash
npm run dev
# → http://localhost:5173
```

### 5. Build production
```bash
npm run build
npm run preview
```

## 📁 Cấu trúc project

```
src/
├── components/           # React components tái sử dụng
│   ├── ActivityForm.jsx         # Form thêm/sửa hoạt động  
│   ├── ActivityList.jsx         # Danh sách với category icons
│   ├── Charts.jsx              # Biểu đồ donut + bar
│   ├── FileUpload.jsx          # Upload với progress  
│   ├── Header.jsx              # Navigation + user menu
│   └── ...
├── pages/               # Route pages
│   ├── Dashboard.jsx           # Trang chính
│   ├── LoginPage.jsx           # Đăng nhập
│   └── RegisterPage.jsx        # Đăng ký
├── contexts/            # React contexts
│   └── AuthContext.jsx         # Authentication state
├── services/            # Business logic + Firebase
│   ├── activitiesService.js    # CRUD hoạt động
│   ├── uploadService.js        # File upload service
│   └── userService.js          # User profile management
├── layouts/             # Layout components
├── lib/                 # External configs
│   └── firebase.js             # Firebase setup
└── utils/               # Utility functions
    └── csvExport.js            # Export CSV
```

## 📊 Database Schema

### `activities` Collection
```javascript
{
  uid: string,              // User ID (filter field)
  title: string,            // Tên hoạt động
  date: "YYYY-MM-DD",       // Ngày tham gia
  category: enum,           // Loại hoạt động
  location: string,         // Địa điểm  
  score: number,            // Điểm số
  note: string,             // Ghi chú
  attachments: [{           // File đính kèm
    url: string,            // Download URL
    name: string,           // Tên file
    size: number,           // Kích thước
    type: string            // MIME type
  }],
  monthKey: "YYYY-MM",      // Key for aggregation
  createdAt: Timestamp,     
  updatedAt: Timestamp      
}
```

### `userProfiles` Collection  
```javascript
{
  email: string,
  displayName: string,      // Tên hiển thị
  scoreTarget: number,      // Mục tiêu điểm
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🔥 Firebase Storage Structure
```
/{uid}/activities/{docId}/{filename}
```

## 🎯 Tính năng nổi bật

### Real-time Sync
- **Firestore listeners**: Cập nhật tức thì khi có thay đổi
- **Optimistic updates**: UI phản hồi ngay lập tức
- **Client-side sorting**: Hiệu suất tốt, tránh index requirements

### File Upload System
- **Drag & drop**: Giao diện upload hiện đại
- **Progress tracking**: Thanh tiến trình real-time
- **Validation**: Kiểm tra file type và size
- **Preview**: Thumbnail cho ảnh, download cho PDF

### Enhanced UX
- **Category icons**: 8 emoji icons cho visual identification
- **Empty states**: Thông báo thân thiện khuyến khích tham gia
- **Loading skeletons**: Smooth loading experience
- **Error handling**: User-friendly error messages

## 📈 Performance & Optimization

- **Code splitting**: Route-based lazy loading
- **Bundle size**: Optimized với Vite
- **Real-time efficiency**: Chỉ sync dữ liệu của user
- **Client-side operations**: Giảm tải server queries

## 🔒 Security Features

- **Authentication**: Firebase Auth với email/password
- **Data isolation**: Mỗi user chỉ thấy dữ liệu của mình
- **File validation**: Kiểm tra type và size trước upload
- **Firestore rules**: Bảo mật data access

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Build và deploy
npm run build
firebase init hosting
firebase deploy
```

## 📋 Troubleshooting

### Common Issues
- **Firestore Index Error**: Đã fix bằng client-side sorting
- **File Upload Issues**: Check Firebase Storage rules
- **Auth Problems**: Verify Firebase config

## 📄 Tài liệu

- **Technical Documentation**: `FINAL_TECHNICAL_DOCUMENTATION.md`
- **API Reference**: Chi tiết trong tài liệu kỹ thuật
- **Component Guide**: Props và usage examples

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push branch: `git push origin feature/AmazingFeature`
5. Tạo Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/minnhi09/NgoaiKhoaApp/issues)
- **Documentation**: `FINAL_TECHNICAL_DOCUMENTATION.md`

## 📜 License

MIT License - xem file `LICENSE` để biết chi tiết.

---

**Phiên bản**: 1.0.0  
**Cập nhật**: Tháng 9, 2025  
**Demo**: [Live Demo](https://your-demo-url.com)