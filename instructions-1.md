# Copilot Instructions — Ngoai-Khoa-App (React + Firebase, Tailwind v4, JS)

> Mục tiêu: Hoàn thiện giao diện & logic theo góp ý đã thống nhất. **Không dùng TypeScript**. **Tailwind CSS v4 + @tailwindcss/vite**. Firebase: **Auth + Firestore + Storage**.  
> Trọng tâm: UX rõ ràng, tránh rườm rà, tối ưu thao tác thêm/xem/lọc hoạt động.


## 0) Tech constraints
- React + Vite + **JavaScript** (không TypeScript).
- Tailwind **v4** (utility-first), dùng lucide-react cho icon.
- Firebase v10+: `firebase/auth`, `firebase/firestore`, `firebase/storage`.
- State: React hooks; có thể dùng context cho user/session. Không thêm Redux.
- Date: `date-fns`. Định dạng **dd/MM/yyyy** (vi-VN).


## 1) Data model (Firestore)
### `userProfiles/{uid}`
```json
{
  "uid": "string",
  "displayName": "string",           // tên hiển thị do user tự nhập, KHÔNG dùng email làm tên
  "email": "string",
  "photoURL": "string|null",
  "goalScore": 100,                  // tuỳ chọn
  "lastUsedCategory": "volunteer",   // để prefill form
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### `activities/{autoId}`
> **Đã loại bỏ**: `hours`, `organizer` theo yêu cầu.
```json
{
  "title": "string",                 // bắt buộc, >= 3 ký tự
  "category": "volunteer|club|workshop|contest|other",
  "date": Timestamp,                 // bắt buộc
  "score": 0,                        // số 0–100 (tùy quy định), mặc định 0
  "location": "string",
  "note": "string",
  "attachments": [                   // tùy chọn
    { "name": "string", "type": "image|pdf", "url": "string", "size": 12345 }
  ],
  "uid": "string",                   // owner
  "monthKey": "YYYY-MM",             // ví dụ "2025-09" — phục vụ filter theo tháng
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Firestore indexes (tạo Composite Index)
- `activities`: `uid ASC, monthKey ASC, date DESC`
- `activities`: `uid ASC, category ASC, date DESC`

### Security rules (phác thảo)
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(uid) { return request.auth != null && request.auth.uid == uid; }

    match /userProfiles/{uid} {
      allow read: if isOwner(uid);
      allow create, update: if isOwner(uid);
    }

    match /activities/{id} {
      allow read, write: if isOwner(resource.data.uid) || (request.resource.data.uid != null && isOwner(request.resource.data.uid));
    }
  }
}

service firebase.storage {
  match /b/{bucket}/o {
    match /{uid}/activities/{docId}/{filename} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```


## 2) UX & IA (Information Architecture)

### Header
- Chỉ **1 nút Đăng xuất** ở góc phải.
- Tiêu đề: “Ngoại khóa tracker”. Hiển thị **displayName** nhỏ và avatar/email dạng subtle.
- Menu user: “Chỉnh sửa tên hiển thị”, “Đăng xuất”.  
- Route chính: `/dashboard` (sau khi đăng nhập).

### Dashboard layout
- **KPI row** (4 thẻ): Tổng hoạt động, Tổng điểm, Tháng này, % mục tiêu.
  - Subline có **delta** (ví dụ: `+2 hoạt động tuần này` nếu có).
  - Trên mobile: grid 2×2; desktop: 4 cột.
- **Form Thêm hoạt động**: ở cột trái, **collapsible** (mặc định *mở* nếu chưa có hoạt động nào; *đóng* khi đã có ≥1).
- **Charts area**: Pie theo danh mục + Line theo tháng (tab chuyển).
- **Activity list**: cột phải (desktop) hoặc dưới charts (mobile).

### Consistency / UI polish
- Spacing chuẩn: `gap-4`, card `p-4`, section `space-y-4`.
- Border radius: `rounded-2xl`, shadow mềm `shadow-sm` đồng nhất.
- Color: brand xanh biển/xanh ngọc; nền trắng/neutral. Tránh quá rực.
- Type scale: title card `text-xl font-semibold`, con số KPI `text-3xl font-bold`.
- Focus ring & a11y: `focus-visible:outline`, aria-label cho input/upload.

### Empty states (phải hành động được)
- KPI/Chart/List khi rỗng: hiển thị icon + copy hướng dẫn + **CTA** “+ Thêm hoạt động” (mở form/modal).
- CSV: nếu 0 bản ghi ⇒ **disabled** + tooltip “Chưa có dữ liệu để xuất”.


## 3) Form “Thêm hoạt động” (2 bước)
- **Bước 1 (bắt buộc)**: `title`, `date` (mặc định hôm nay), `category` (mặc định `lastUsedCategory`), `score` (mặc định 0), `location`.
- **Bước 2 (tùy chọn)**: `note`, `attachments` (ảnh/PDF ≤ 5MB).
- Validation:
  - `title` ≥ 3 ký tự; `date` hợp lệ; `score` 0–100.
- Sau khi lưu:
  - Tính `monthKey` = `format(date, 'yyyy-MM')`.
  - Gọi toast **Success**; reset form (giữ `category` theo `lastUsedCategory`).
- Upload Storage:
  - Path: `/{uid}/activities/{docId}/{filename}`
  - Cho drag&drop + preview + progress.


## 4) Filters/Search/Sort (hoàn chỉnh)
- **Filters bar** trên Activity list:
  - **Tháng**: single month picker (mặc định tháng hiện tại). Ứng với truy vấn `where(uid==, monthKey==)`.
  - **Danh mục**: multi-select.
  - **Điểm**: min/max (optional).
  - **Sort**: `date desc` (default), `score desc`, `title asc`.
  - **Search**: áp dụng cho `title`, `location`, `note` (client-side sau khi fetch trong tháng).
- Nút **Xuất CSV (n)**: hiển thị số lượng bản ghi sau filter; **disabled** nếu `n == 0`.

Pseudo:
```js
const q = query(
  collection(db, 'activities'),
  where('uid', '==', uid),
  where('monthKey', '==', selectedMonth),
  orderBy('date', 'desc')
);
onSnapshot(q, ...);
```


## 5) Components & responsibilities

- `Header.jsx`  
  Hiển thị brand + displayName/avatar. Menu: “Chỉnh sửa tên hiển thị”, “Đăng xuất”.

- `KpiCards.jsx`  
  Tính tổng số hoạt động (count), tổng điểm (sum score), số hoạt động/tháng hiện tại, % tiến độ so với `goalScore`. Skeleton khi loading.

- `ChartsArea.jsx` (Tabs: Pie | Trend)  
  - Pie: phân bổ theo `category` (ẩn chart nếu rỗng, show empty state với CTA).
  - Trend: line/area tổng `score` theo ngày trong tháng.

- `ActivityFormModal.jsx` (hoặc `ActivityFormCard.jsx` + FAB mở modal)  
  - 2-step form như mô tả. Upload Storage có progress, preview. Submit → addDoc.

- `FiltersBar.jsx`  
  MonthPicker, CategoryMulti, ScoreRange, SortSelect, SearchInput, ExportCSVButton.

- `ActivityList.jsx`  
  Render danh sách sau filter + search. Item: title • category (chip), sub: `dd/MM/yyyy @ location`. Menu: View/Edit/Delete/Download attachment. Empty state có CTA.

- `ProfileNameDialog.jsx`  
  Cho phép user nhập **displayName** (không dùng email). Lưu vào `userProfiles/{uid}`.


## 6) Coding patterns (JS)

### Tạo/đọc user profile
```js
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

export async function ensureUserProfile(user) {
  const ref = doc(db, 'userProfiles', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName || '', // cho phép user tự cập nhật sau
      photoURL: user.photoURL ?? null,
      goalScore: 100,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastUsedCategory: 'volunteer'
    });
  }
}

export async function updateDisplayName(uid, name) {
  await updateDoc(doc(db, 'userProfiles', uid), {
    displayName: name.trim(),
    updatedAt: serverTimestamp()
  });
}
```

### Tạo hoạt động
```js
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export async function createActivity(uid, payload) {
  const dateObj = payload.date instanceof Date ? payload.date : new Date(payload.date);
  const monthKey = format(dateObj, 'yyyy-MM');

  const base = {
    title: payload.title.trim(),
    category: payload.category,
    date: dateObj,
    score: Number(payload.score) || 0,
    location: payload.location || '',
    note: payload.note || '',
    attachments: payload.attachments || [],
    uid,
    monthKey,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  return addDoc(collection(db, 'activities'), base);
}
```

### Truy vấn theo tháng (realtime)
```js
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

export function listenActivitiesByMonth(uid, monthKey, cb) {
  const q = query(
    collection(db, 'activities'),
    where('uid', '==', uid),
    where('monthKey', '==', monthKey),
    orderBy('date', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(rows);
  });
}
```

### Xuất CSV (sau filter & search)
```js
export function toCsv(rows) {
  const headers = ['Title','Category','Date','Score','Location','Note'];
  const lines = rows.map(r => [
    r.title,
    r.category,
    new Date(r.date.seconds * 1000).toLocaleDateString('vi-VN'),
    r.score,
    r.location ?? '',
    (r.note ?? '').replace(/\n/g, ' ')
  ]);
  const csv = [headers, ...lines].map(arr => arr.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
}
```


## 7) Acceptance criteria (done khi tất cả pass)
- [ ] Header có **1** nút Đăng xuất; hiển thị **displayName** (không dùng email làm tên). Có dialog đổi tên.
- [ ] Empty state ở KPI/Charts/List đều có CTA “+ Thêm hoạt động” (mở form/modal).
- [ ] Form 2 bước, validation rõ; **không** có trường *Số giờ tham gia* và **không** có *Ban tổ chức*.
- [ ] Lưu `monthKey` khi tạo hoạt động; danh sách realtime theo tháng đã chọn.
- [ ] Filters đầy đủ: Tháng, Danh mục (multi), Điểm (min/max), Sort; Search theo title/location/note.
- [ ] CSV hiển thị số lượng `(n)`; khi `n==0` thì disabled + tooltip.
- [ ] Consistency: spacing, radius, shadow đồng nhất; focus ring chuẩn; mobile 2×2 KPI, FAB “+”.
- [ ] Charts ẩn khi rỗng và hiện empty state có CTA.
- [ ] Toast + skeleton ở mọi trạng thái load; optimistic UI khi thêm.
- [ ] Firestore rules đảm bảo user chỉ CRUD dữ liệu của mình; Storage path theo `{uid}/activities/{docId}/`.
- [ ] Index đã tạo, truy vấn mượt (không lỗi yêu cầu index).


## 8) Notes cho Copilot
- Nếu chưa có `userProfiles/{uid}` thì `ensureUserProfile()` tạo ngay sau login.
- Luôn cập nhật `updatedAt` khi sửa.
- Với DatePicker, luôn xuất Date object; không lưu string thô.
- Khi filter “Tháng”, cập nhật `monthKey` (format `yyyy-MM`) và re-run listen.
- Giữ `lastUsedCategory` trong user profile để prefill form lần sau.


---

**Hết.** Hãy code theo đúng mô tả và acceptance criteria ở trên. Ưu tiên trải nghiệm mượt, gọn, rõ. Đẩy mạnh empty state có hành động. Không thêm tính năng ngoài phạm vi.
