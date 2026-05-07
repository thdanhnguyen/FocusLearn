import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/',            label: 'Home',            icon: '⌂',  end: true },
  { path: '/study-room',  label: 'Study Room',      icon: '◎' },
  { path: '/pomodoro',    label: 'Pomodoro Corner', icon: '◷' },
  { path: '/profile',     label: 'Profile',         icon: '◉' },
  { path: '/settings',    label: 'Settings',        icon: '◈' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside style={{
      width: '200px', minHeight: '100vh',
      background: 'var(--surface-low)',
      borderRight: '1px solid var(--outline-subtle)',
      display: 'flex', flexDirection: 'column',
      padding: '28px 16px',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
      fontFamily: "'Be Vietnam Pro', sans-serif",
    }}>
      {/* Logo dùng Newsreader font */}
      <div style={{ paddingLeft: '8px', marginBottom: '36px' }}>
        <div style={{
          fontFamily: "'Newsreader', serif",
          fontSize: '20px', fontWeight: '600',
          color: 'var(--primary)', letterSpacing: '-0.3px',
        }}>
          FocusLearn
        </div>
        <div style={{
          fontSize: '9px', fontWeight: '600',
          color: 'var(--text-muted)', letterSpacing: '2px', marginTop: '2px',
        }}>
          DEEP WORK PORTAL
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: 'var(--r-md)',
              textDecoration: 'none', fontSize: '12px', fontWeight: '600',
              letterSpacing: '0.3px',
              backgroundColor: isActive ? 'var(--primary-container)' : 'transparent',
              color: isActive ? 'var(--on-primary-container)' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            })}
          >
            <span style={{ fontSize: '14px', opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info / Login button ở dưới */}
      <div style={{ marginTop: 'auto' }}>
        {user ? (
          // Đã đăng nhập: hiện avatar + nút đăng xuất
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: 'var(--r-md)',
              background: 'var(--primary-container)',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '700', flexShrink: 0,
              }}>
                {(user.displayName || user.display || 'U').charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--on-primary-container)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {(user.displayName || user.display || 'My Space').split(' ').pop()}
              </span>
            </div>
            <button onClick={handleLogout} style={{
              width: '100%', padding: '8px', borderRadius: 'var(--r-md)',
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: '600', transition: 'all 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-high)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          // Chưa đăng nhập: nút đăng nhập nhỏ
          <NavLink to="/login" style={{
            display: 'block', textAlign: 'center',
            padding: '9px 12px', borderRadius: 'var(--r-full)',
            background: 'var(--primary-container)', color: 'var(--on-primary-container)',
            textDecoration: 'none', fontSize: '12px', fontWeight: '700',
            transition: 'all 0.15s',
          }}>
            Đăng nhập ↗
          </NavLink>
        )}
      </div>
    </aside>
  );
}
