import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import MusicPlayer, { MusicProvider } from './components/MusicPlayer';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const StudyRoom = lazy(() => import('./pages/StudyRoom'));
const PomodoroCorner = lazy(() => import('./pages/PomodoroCorner'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// ProtectedRoute: Chỉ chặn khi user chưa đăng nhập
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// AppShell: Layout cố định gồm Sidebar + MusicPlayer.
// MusicProvider bọc Ở ĐÂY một lần duy nhất để không bị destroy khi navigate.
//
// KIẾN THỨC MỚI (Tại sao MusicProvider phải bọc ở cấp cao nhất?):
// Nếu MusicProvider nằm bên trong từng <Route>, mỗi lần bạn chuyển trang
// thì Provider cũ bị unmount và Provider mới được tạo lại → tất cả state
// (player, isPlaying, volume...) bị reset về 0, gây lỗi "undefined" ở
// các component con khi chúng render trước khi Provider kịp mount xong.
function AppShell() {
  const location = useLocation();
  // Ẩn Sidebar và MusicPlayer trên các trang Auth (đăng nhập/đăng ký)
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <MusicProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {!isAuthPage && <Sidebar />}
        <main style={{
          marginLeft: isAuthPage ? '0' : '200px',
          flex: 1,
          // Không cần paddingBottom vì MusicPlayer giờ là floating widget
        }}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Trang Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Trang PUBLIC */}
              <Route path="/" element={<Home />} />
              <Route path="/study-room" element={<StudyRoom />} />
              <Route path="/study-room/:id" element={<StudyRoom />} />
              <Route path="/pomodoro" element={<PomodoroCorner />} />

              {/* Trang PRIVATE - cần đăng nhập */}
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute><Settings /></ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </main>
        {!isAuthPage && <MusicPlayer />}
      </div>
    </MusicProvider>
  );
}

export default function App() {
  return <AppShell />;
}
