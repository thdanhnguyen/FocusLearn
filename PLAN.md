# 🕰️ Co-Work Timer – Kế hoạch dự án

Mô tả ngắn: Ứng dụng web Pomodoro nhóm thời gian thực, hỗ trợ làm việc/tập trung cùng nhau từ xa. Tích hợp AI tổng kết phiên làm việc, chat nhanh và đồng bộ trạng thái qua WebSocket.

## 1. Tổng quan

### 1.1. Mục tiêu
- Xây dựng một nền tảng cho phép người dùng tạo phòng tập trung, cùng bắt đầu phiên Pomodoro, theo dõi trạng thái của nhau (đang làm, đang nghỉ, sắp hết giờ).
- Cung cấp chat nhanh trong phòng.
- Tích hợp AI để tổng kết phiên làm việc, gợi ý cải thiện.
- Hỗ trợ đầy đủ các tính năng kỹ thuật: Auth (JWT + Google OAuth), CRUD phòng/người dùng, phân quyền, Rate Limiting, Full‑text Search, WebSocket real‑time.

### 1.2. Người dùng mục tiêu
- Sinh viên ôn thi online theo nhóm.
- Nhóm làm việc từ xa muốn đồng bộ thời gian tập trung.
- Người dùng đơn lẻ muốn tập trung có “bạn đồng hành ảo” (các thành viên khác).

### 1.3. Phạm vi MVP
- Đăng ký / đăng nhập (email + Google).
- Quản lý phòng (tạo, sửa, xóa, join/leave).
- Timer cá nhân và đồng bộ timer nhóm qua WebSocket.
- Chat real‑time trong phòng.
- AI tổng kết phiên làm việc (dựa trên dữ liệu session).
- Xem lịch sử phiên và tổng kết.
- Tìm kiếm phòng công khai.

## 2. Công nghệ sử dụng

| Thành phần | Công nghệ |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Socket.IO Client |
| **Backend** | Node.js + Express |
| **Real‑time** | Socket.IO |
| **Database** | PostgreSQL |
| **Cache / Pub‑Sub** | Redis |
| **Auth** | JWT (access + refresh token), Google OAuth 2.0 |
| **AI** | OpenAI API (GPT-4o mini) |
| **Search** | PostgreSQL Full‑Text Search (GIN index) |
| **Rate Limit** | `express-rate-limit` + Redis store |
| **Container** | Docker & Docker Compose |
| **Deployment** | VPS (Ubuntu) + Nginx (reverse proxy) |

## 3. Kiến trúc hệ thống

```text
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│   Client    │◄──────►│  Express    │◄──────►│ PostgreSQL  │
│  (React)    │  REST  │   Server    │        │   (data)    │
└─────────────┘        └──────┬──────┘        └─────────────┘
       │                      │                       ▲
       │ WebSocket            │ Redis                 │
       └──────────────────────┤ (cache, rate limit,   │
                              │  pub/sub)             │
                              └───────────────────────┘
```

- Client giao tiếp REST cho các thao tác CRUD, auth.
- WebSocket duy trì kết nối thời gian thực cho timer và chat.
- Redis dùng để lưu trạng thái timer tạm thời, quản lý rate limit và mở rộng pub/sub khi cần scale ngang.

## 4. Cơ sở dữ liệu (PostgreSQL)

### 4.1. Sơ đồ quan hệ

#### Bảng `users`
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| id | UUID (PK) | ID duy nhất |
| email | VARCHAR(255) UNIQUE | Email đăng nhập |
| password_hash | VARCHAR(255) | Mã băm mật khẩu (nếu có) |
| google_id | VARCHAR(255) UNIQUE NULLABLE | ID từ Google OAuth |
| display_name | VARCHAR(100) | Tên hiển thị |
| avatar_url | VARCHAR(255) | Ảnh đại diện (URL) |
| created_at | TIMESTAMPTZ | |

#### Bảng `rooms`
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| id | UUID (PK) | |
| name | VARCHAR(100) | Tên phòng |
| description | TEXT | Mô tả phòng |
| created_by | UUID (FK -> users.id) | Chủ phòng |
| is_public | BOOLEAN DEFAULT true | Công khai hay riêng tư |
| invite_code | VARCHAR(20) NULLABLE | Mã mời nếu phòng riêng tư |
| max_participants | INTEGER DEFAULT 10 | Giới hạn số thành viên |
| created_at | TIMESTAMPTZ | |

#### Bảng `room_members`
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| room_id | UUID (FK -> rooms.id) | |
| user_id | UUID (FK -> users.id) | |
| role | ENUM('owner','moderator','member') | Vai trò trong phòng |
| joined_at | TIMESTAMPTZ | |
**Khóa chính:** `(room_id, user_id)`

#### Bảng `work_sessions`
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| id | UUID (PK) | |
| room_id | UUID (FK -> rooms.id) | Phòng diễn ra phiên |
| start_time | TIMESTAMPTZ | Thời điểm bắt đầu phiên |
| end_time | TIMESTAMPTZ NULLABLE | Kết thúc phiên |
| status | ENUM('active','paused','completed') | Trạng thái |
| created_by | UUID (FK -> users.id) | Người bắt đầu phiên |

#### Bảng `user_session_logs`
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| id | UUID (PK) | |
| session_id | UUID (FK -> work_sessions.id) | Phiên làm việc |
| user_id | UUID (FK -> users.id) | |
| start_time | TIMESTAMPTZ | Thời điểm bắt đầu focus |
| end_time | TIMESTAMPTZ NULLABLE | Kết thúc |
| duration_seconds | INTEGER | Thời gian thực tế |
| type | ENUM('focus','break') | Loại: tập trung / nghỉ |

#### Bảng `ai_summaries`
| Cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| id | UUID (PK) | |
| session_id | UUID (FK -> work_sessions.id) UNIQUE | Mỗi phiên chỉ một bản |
| summary_text | TEXT | Nội dung tổng kết |
| generated_at | TIMESTAMPTZ | |

### 4.2. Tìm kiếm (Full‑text Search)
Tạo GIN index trên `rooms.name` và `rooms.description`:

```sql
ALTER TABLE rooms ADD COLUMN search_vector tsvector
GENERATED ALWAYS AS (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, ''))) STORED;

CREATE INDEX idx_rooms_search ON rooms USING GIN (search_vector);
```
API tìm kiếm sẽ query dạng `WHERE search_vector @@ plainto_tsquery('simple', $1)`.

## 5. REST API Endpoints

Tất cả các endpoint (trừ auth) đều yêu cầu header `Authorization: Bearer <access_token>`.

### 5.1. Xác thực (Auth)
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Đăng ký (email, password, displayName) |
| POST | `/api/auth/login` | Đăng nhập, trả về access + refresh token |
| POST | `/api/auth/refresh-token` | Lấy access token mới |
| GET | `/api/auth/google` | Redirect URL Google OAuth |
| GET | `/api/auth/google/callback` | Xử lý callback, trả về JWT |

### 5.2. Người dùng
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/api/users/me` | Xem thông tin cá nhân |
| PUT | `/api/users/me` | Cập nhật (displayName, avatarUrl) |

### 5.3. Phòng (Rooms)
| Method | Endpoint | Mô tả | Quyền |
| :--- | :--- | :--- | :--- |
| GET | `/api/rooms?search=...&page=1` | Danh sách phòng công khai (tìm kiếm) | Auth |
| POST | `/api/rooms` | Tạo phòng mới | Auth |
| GET | `/api/rooms/:id` | Chi tiết phòng | Member |
| PUT | `/api/rooms/:id` | Cập nhật phòng (name, desc, public) | Owner/Moderator |
| DELETE | `/api/rooms/:id` | Xóa phòng | Owner |
| POST | `/api/rooms/:id/join` | Tham gia (gửi invite_code nếu có) | Auth |
| POST | `/api/rooms/:id/leave` | Rời phòng | Member |
| GET | `/api/rooms/:id/members` | Danh sách thành viên | Member |
| PUT | `/api/rooms/:id/members/:userId` | Cập nhật vai trò (mod/... ) | Owner |
| DELETE | `/api/rooms/:id/members/:userId` | Kick thành viên | Owner/Moderator (nếu là member) |

### 5.4. Phiên làm việc & AI
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/api/rooms/:id/sessions` | Lịch sử phiên trong phòng |
| GET | `/api/sessions/:id/logs` | Chi tiết thời gian từng người |
| GET | `/api/sessions/:id/summary` | Xem tổng kết AI (đã lưu) |
| POST | `/api/sessions/:id/summary` | Yêu cầu tạo lại tổng kết (Owner) |

> [!NOTE]
> Rate Limit cho AI: `/api/sessions/:id/summary` (POST) giới hạn **5 lần/phòng/giờ**.

## 6. WebSocket Events (Socket.IO)

### 6.1. Sự kiện từ Client → Server
| Event | Payload | Mô tả |
| :--- | :--- | :--- |
| `join‑room` | `{ roomId, inviteCode? }` | Tham gia phòng, server xác thực JWT |
| `leave‑room` | | Rời phòng |
| `start‑timer` | `{ type: 'focus'\|'break' }` | Bắt đầu đếm ngược cá nhân |
| `pause‑timer` | | Tạm dừng timer |
| `resume‑timer` | | Tiếp tục timer |
| `stop‑timer` | | Kết thúc timer sớm |
| `send‑message` | `{ content }` | Gửi tin nhắn chat |
| `request‑summary` | `{ sessionId }` | Yêu cầu AI tổng kết (nếu chưa có) |

### 6.2. Sự kiện từ Server → Client
| Event | Payload | Mô tả |
| :--- | :--- | :--- |
| `room‑state` | `{ users: [...], currentTimer: {...}, messages: [] }` | Trạng thái ban đầu khi join |
| `user‑joined` | `{ userId, displayName }` | Có người mới vào phòng |
| `user‑left` | `{ userId }` | Người rời phòng |
| `timer‑update` | `{ userId, action: 'start'\|'pause'\|'resume'\|'stop', remainingSeconds }` | Cập nhật timer |
| `new‑message` | `{ userId, displayName, content, timestamp }` | Tin nhắn mới |
| `session‑start` | `{ sessionId, startTime }` | Phiên làm việc chung bắt đầu |
| `session‑end` | `{ sessionId, summary? }` | Phiên kết thúc, có thể kèm summary |
| `session‑summary` | `{ sessionId, summary }` | AI trả kết quả tổng kết |

### 6.3. Logic đồng bộ timer
1. Server chỉ lưu `end_time` (timestamp tuyệt đối) của timer hiện tại trong Redis (`timer:<roomId>:<userId>`).
2. Client tự tính `remainingSeconds = end_time - Date.now()` và hiển thị đếm ngược.
3. Khi có hành động (pause/stop), client gửi lên server, server tính lại `remainingSeconds` mới, broadcast sự kiện `timer‑update`.
4. Khi tất cả thành viên đã dừng timer focus, server tự động tạo `work_session` mới hoặc cập nhật trạng thái hoàn thành.

## 7. Tích hợp AI
- **Mô hình:** OpenAI GPT‑4o mini (hoặc miễn phí: Gemini 2.0 Flash).
- **Chức năng:** Tổng kết phiên làm việc.

### Quy trình
1. Một phiên (`work_session`) kết thúc → server thu thập:
    - Tổng thời gian focus/break của từng thành viên.
    - Số lần tạm dừng, thời gian hoàn thành so với kế hoạch.
    - Một vài tin nhắn chat cuối (nếu có, tối đa 5 dòng, ẩn danh).
2. Tạo prompt:
    ```text
    Bạn là trợ lý nhóm tập trung. Dựa vào dữ liệu sau, hãy viết một bản tổng kết thân thiện, ngắn gọn:
    - Người A: focus 45 phút, break 10 phút.
    - Người B: focus 30 phút, break 15 phút.
    - (nếu có chat): "Mình sắp xong bài rồi!", "Hóng hết giờ quá".
    Hãy nêu ai tập trung nhất, lời động viên và một mẹo cải thiện cho lần sau.
    ```
3. Gọi chat completion → nhận kết quả, lưu vào `ai_summaries`.
4. Broadcast `session-summary` cho cả phòng qua WebSocket.

## 8. Bảo mật & Phân quyền
- **JWT Access Token:** thời hạn 15 phút; **Refresh Token:** 7 ngày, lưu trong http-only cookie hoặc database.
- **Google OAuth 2.0:** chỉ yêu cầu scope `profile` và `email`.
- **Phân quyền trong phòng:**
    - `owner`: toàn quyền (sửa, xóa phòng, kick, đổi role).
    - `moderator`: có thể kick member, nhưng không xóa phòng.
    - `member`: tham gia, chat, start timer.
- **Middleware xác thực WebSocket:** kiểm tra JWT gửi kèm trong handshake (`auth.token`).
- Dữ liệu người dùng chỉ được chia sẻ trong phạm vi phòng họ tham gia.

## 9. Rate Limiting
- **Auth endpoints:** 10 req/phút/IP.
- **CRUD phòng:** 20 req/phút/user.
- **AI summary generation:** 5 req/giờ/room (tránh lạm dụng).
- **Chat:** 30 tin/phút/user.
- Sử dụng `express‑rate‑limit` kết hợp `rate‑limit‑redis` để lưu trạng thái.

## 10. Triển khai (Deployment)

### Docker Compose
```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: coworktimer
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - pgdata:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
  backend:
    build: ./server
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/coworktimer
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ...
      OPENAI_API_KEY: ...
  frontend:
    build: ./client
    ports:
      - "3000:80"
```

- **Production:** Thêm Nginx làm reverse proxy, Let's Encrypt cho HTTPS.

## 11. Lộ trình phát triển (Roadmap)

### Giai đoạn 1 – MVP (2‑3 tuần)
- [x] Setup project (backend + frontend boilerplate).
- [ ] Auth (email + Google OAuth, JWT).
- [ ] CRUD phòng + join/leave.
- [ ] WebSocket: đồng bộ trạng thái online.
- [ ] Timer cá nhân (chạy client, server lưu `end_time`).
- [ ] Chat real‑time trong phòng.
- [ ] AI tổng kết phiên (gọi khi kết thúc).
- [ ] Xem lịch sử phiên + tổng kết.

### Giai đoạn 2 – Cải thiện trải nghiệm (2‑3 tuần)
- [ ] Đồng bộ timer nhóm (cả nhóm bắt đầu cùng lúc).
- [ ] Notification (Web Push) khi đến giờ nghỉ.
- [ ] Dashboard cá nhân: biểu đồ thống kê focus.
- [ ] Tìm kiếm phòng nâng cao (theo tag, số người).
- [ ] Thêm bạn bè, mời vào phòng riêng.

### Giai đoạn 3 – Nâng cao
- [ ] Voice chat (WebRTC) trong giờ nghỉ.
- [ ] Music sync (tích hợp Spotify).
- [ ] Mobile app (React Native, dùng lại API).

