import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import MusicPlayer, { MusicProvider } from './components/MusicPlayer';
import Home from './pages/Home';
import StudyRoom from './pages/StudyRoom';
import PomodoroCorner from './pages/PomodoroCorner';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

// ProtectedRoute: Chỉ chặn khi user chưa đăng nhập
// Dùng cho các action cần xác thực (VD: Tạo phòng, sửa profile)
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Layout chung cho tất cả trang (cả public lẫn private)
// Sidebar và MusicPlayer luôn hiện, không phụ thuộc vào đăng nhập
function AppLayout({ children }) {
  return (
    <MusicProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ marginLeft: '200px', flex: 1, paddingBottom: '72px' }}>
          {children}
        </main>
        <MusicPlayer />
      </div>
    </MusicProvider>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Trang Auth - không có sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ============================================
          Trang PUBLIC - Không cần đăng nhập để xem
          ============================================ */}
      <Route path="/" element={
        <AppLayout><Home /></AppLayout>
      } />
      <Route path="/study-room" element={
        <AppLayout><StudyRoom /></AppLayout>
      } />
      <Route path="/study-room/:id" element={
        <AppLayout><StudyRoom /></AppLayout>
      } />
      <Route path="/pomodoro" element={
        <AppLayout><PomodoroCorner /></AppLayout>
      } />

      {/* ============================================
          Trang PRIVATE - Cần đăng nhập
          ============================================ */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout><Profile /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout><Settings /></AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}
