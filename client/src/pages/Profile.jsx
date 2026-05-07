import { useAuth } from '../context/AuthContext';

// Dữ liệu thống kê hàng tuần — sau này fetch từ API
const WEEKLY_DATA = [
  { day: 'T2', hours: 2.5 }, { day: 'T3', hours: 3.5 }, { day: 'T4', hours: 5.0 },
  { day: 'T5', hours: 2.0 }, { day: 'T6', hours: 4.2 }, { day: 'T7', hours: 1.5 }, { day: 'CN', hours: 0.8 }
];
const MAX_HOURS = Math.max(...WEEKLY_DATA.map(d => d.hours));

export default function Profile() {
  // Lấy thông tin user THẬT từ Context (đã đăng nhập qua Google)
  const { user, logout } = useAuth();

  // Lấy tên hiển thị từ dữ liệu Google OAuth (googleData.name, displayName, hoặc email)
  const displayName = user?.name || user?.displayName || user?.display_name || user?.email || 'Người dùng';
  const email = user?.email || '';
  const avatarUrl = user?.picture || user?.avatar_url || null;

  // Lấy chữ cái đầu của tên để làm avatar fallback
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div style={{ padding: '32px 36px', maxWidth: '900px' }} className="fade-in">
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>Hồ sơ của bạn</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '15px' }}>
        Không gian học tập cá nhân và hành trình tập trung của bạn.
      </p>

      {/* Card thông tin cá nhân */}
      <div className="card" style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {avatarUrl ? (
            // Nếu có ảnh từ Google OAuth, dùng ảnh đó
            <img
              src={avatarUrl}
              alt={displayName}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-container)' }}
            />
          ) : (
            // Nếu không có ảnh, dùng vòng tròn chữ cái đầu
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', color: 'white', fontWeight: '700',
            }}>
              {initials}
            </div>
          )}
          {/* Chấm xanh online */}
          <div style={{
            position: 'absolute', bottom: '4px', right: '4px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#4caf50', border: '2px solid white',
          }} />
        </div>

        {/* Tên, email và huy hiệu */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{displayName}</h2>
            <span style={{ fontSize: '12px', background: 'var(--secondary-container)', color: 'var(--on-secondary-container)', padding: '3px 10px', borderRadius: '99px', fontWeight: '600' }}>
              🟢 Đang online
            </span>
          </div>
          {email && (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 12px' }}>{email}</p>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Người học chăm chỉ', 'Lofi Enthusiast'].map(badge => (
              <span key={badge} style={{
                background: 'var(--primary-container)', color: 'var(--on-primary-container)',
                padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '600'
              }}>
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Nút đăng xuất */}
        <button
          onClick={logout}
          className="btn-ghost"
          style={{ fontSize: '13px', padding: '8px 20px' }}
        >
          Đăng xuất
        </button>
      </div>

      {/* Grid thống kê */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.8fr', gap: '16px', marginBottom: '20px' }}>

        {/* Tổng thời gian */}
        <div className="card">
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>
            ⏳ TỔNG THỜI GIAN HỌC
          </div>
          <div style={{ fontSize: '40px', fontWeight: '700', marginBottom: '4px', fontFamily: "'Newsreader', serif" }}>
            142 <span style={{ fontSize: '18px', fontWeight: '600' }}>hrs</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--secondary)', fontWeight: '700' }}>↗ +12% tháng này</div>
        </div>

        {/* Chuỗi ngày */}
        <div className="card">
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>
            🔥 CHUỖI NGÀY HỌC
          </div>
          <div style={{ fontSize: '40px', fontWeight: '700', marginBottom: '4px', fontFamily: "'Newsreader', serif" }}>
            14 <span style={{ fontSize: '18px', fontWeight: '600' }}>ngày</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>🏆 Kỷ lục: 21 ngày</div>
        </div>

        {/* Biểu đồ cột tuần */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px' }}>📊 NHỊP HỌC TUẦN NÀY</span>
            <span style={{
              fontSize: '12px', background: 'var(--primary-container)',
              color: 'var(--on-primary-container)', padding: '3px 10px',
              borderRadius: '99px', fontWeight: '700'
            }}>
              TB: 4.2h / ngày
            </span>
          </div>
          {/* Biểu đồ cột bằng flexbox — không cần thư viện */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '80px' }}>
            {WEEKLY_DATA.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '100%',
                  height: `${(d.hours / MAX_HOURS) * 70}px`,
                  borderRadius: '4px 4px 0 0',
                  background: d.hours === MAX_HOURS ? 'var(--primary)' :
                              i === 4 ? 'var(--secondary)' : 'var(--primary-container)',
                  transition: 'all 0.3s',
                }} />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
