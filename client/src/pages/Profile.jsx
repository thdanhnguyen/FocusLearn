import { useAuth } from '../context/AuthContext';
import { useMusicPlayer } from '../components/MusicPlayer';

// Dữ liệu giả cho thống kê - sau này fetch từ API
const WEEKLY_DATA = [
  { day: 'M', hours: 2.5 }, { day: 'T', hours: 3.5 }, { day: 'W', hours: 5.0 },
  { day: 'T', hours: 2.0 }, { day: 'F', hours: 4.2 }, { day: 'S', hours: 1.5 }, { day: 'S', hours: 0.8 }
];
const MAX_HOURS = Math.max(...WEEKLY_DATA.map(d => d.hours));

export default function Profile() {
  const { user } = useAuth();
  const { currentTrack, isPlaying, togglePlay } = useMusicPlayer();
  const name = user?.displayName || user?.display || 'Người dùng';

  return (
    <div style={{ padding: '32px 36px' }} className="fade-in">
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '6px' }}>Sanctuary Profile</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: '28px' }}>Your personal deep work statistics and journey.</p>

      {/* Card thông tin cá nhân */}
      <div className="glass-card" style={{ padding: '28px', display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', color: 'white', fontWeight: '700',
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <button style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'var(--color-primary)', color: 'white', border: 'none',
            fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✏</button>
        </div>

        {/* Tên và bio */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>{name}</h2>
            <span style={{ color: 'var(--color-muted)', fontSize: '14px' }}>• Avid Scholar & Lofi Enthusiast</span>
          </div>
          <p style={{ color: 'var(--color-muted)', margin: '8px 0 12px', fontSize: '14px' }}>
            Finding peace in focused blocks. Exploring cognitive science and perfecting the art of the 50-minute Pomodoro cycle.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Deep Thinker', 'Early Bird', '14-Day Streak 🔥'].map(badge => (
              <span key={badge} style={{
                background: 'var(--color-primary-light)', color: 'var(--color-primary)',
                padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '700'
              }}>{badge}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid thống kê */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.8fr', gap: '16px', marginBottom: '20px' }}>

        {/* Total Flow Time */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-muted)', letterSpacing: '1px', marginBottom: '16px' }}>
            ⏳ TOTAL FLOW TIME
          </div>
          <div style={{ fontSize: '40px', fontWeight: '700', marginBottom: '4px' }}>
            142 <span style={{ fontSize: '18px', fontWeight: '600' }}>hrs</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-green)', fontWeight: '700' }}>↗ +12% this month</div>
        </div>

        {/* Current Streak */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-muted)', letterSpacing: '1px', marginBottom: '16px' }}>
            🔥 CURRENT STREAK
          </div>
          <div style={{ fontSize: '40px', fontWeight: '700', marginBottom: '4px' }}>
            14 <span style={{ fontSize: '18px', fontWeight: '600' }}>days</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: '600' }}>🏆 Personal best: 21 days</div>
        </div>

        {/* Weekly Rhythm - Biểu đồ cột */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-muted)', letterSpacing: '1px' }}>📊 WEEKLY RHYTHM</span>
            <span style={{ fontSize: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '3px 10px', borderRadius: '99px', fontWeight: '700' }}>
              Avg: 4.2h / day
            </span>
          </div>
          {/* KIẾN THỨC MỚI: Vẽ biểu đồ cột bằng flexbox thuần, không cần thư viện */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '80px' }}>
            {WEEKLY_DATA.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '100%',
                  // Chiều cao tỉ lệ với số giờ học
                  height: `${(d.hours / MAX_HOURS) * 70}px`,
                  borderRadius: '4px 4px 0 0',
                  // Ngày nhiều nhất hoặc hôm nay thì tô màu tím
                  background: d.hours === MAX_HOURS ? 'var(--color-primary)' :
                              i === 4 ? 'var(--color-green)' : '#e8dff5',
                  transition: 'all 0.3s',
                }} />
                <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: '600' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Music player mini */}
      <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--color-primary-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎵</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '14px' }}>{currentTrack.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{currentTrack.artist}</div>
        </div>
        <button onClick={togglePlay} style={{
          width: '38px', height: '38px', borderRadius: '50%',
          backgroundColor: 'var(--color-primary)', color: 'white',
          border: 'none', cursor: 'pointer', fontSize: '16px',
        }}>
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}
