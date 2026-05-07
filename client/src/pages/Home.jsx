import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useMusicPlayer } from '../components/MusicPlayer';

// Dữ liệu giả cho phòng học (Sau này sẽ fetch từ API thật)
const MOCK_ROOMS = [
  {
    id: 1, name: 'Thư viện tĩnh lặng', genre: 'Lofi Hip Hop',
    members: 40, online: 44, emoji: '📚',
    bg: 'linear-gradient(135deg, #e8dff5, #f5f0ff)'
  },
  {
    id: 2, name: 'Quán cà phê sách', genre: 'Acoustic • Tiếng mưa',
    members: 16, online: 18, emoji: '☕',
    bg: 'linear-gradient(135deg, #fde8d8, #fff5f0)'
  },
  {
    id: 3, name: 'Không gian xanh', genre: 'Nature Sounds',
    members: 22, online: 25, emoji: '🌿',
    bg: 'linear-gradient(135deg, #dff0e8, #f0fff5)'
  },
  {
    id: 4, name: 'Studio Ban đêm', genre: 'Jazz Lo-fi',
    members: 8, online: 12, emoji: '🌙',
    bg: 'linear-gradient(135deg, #e0e8ff, #f0f2ff)'
  },
];

// Lời chào theo giờ trong ngày
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Chào buổi sáng';
  if (h < 17) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

export default function Home() {
  const { user } = useAuth();
  const { currentTrack, isPlaying, togglePlay } = useMusicPlayer();
  const displayName = user?.displayName || user?.display || 'bạn';

  return (
    <div style={{ padding: '32px 36px' }} className="fade-in">

      {/* Header: Lời chào + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '24px 28px', flex: 1, maxWidth: '460px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, color: 'var(--color-text)' }}>
            {getGreeting()}, {displayName.split(' ').pop()} 👋
          </h1>
          <p style={{ color: 'var(--color-muted)', marginTop: '6px', fontSize: '15px', fontStyle: 'italic' }}>
            "Nơi tâm trí tìm thấy sự tĩnh lặng."
          </p>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '360px' }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <input
            placeholder="Tìm kiếm tài liệu, phòng học..."
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: '14px', color: 'var(--color-text)', width: '100%',
              fontFamily: 'Quicksand, sans-serif',
            }}
          />
        </div>
      </div>

      {/* Grid chính: Timer nhỏ bên trái + Danh sách phòng bên phải */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start', marginBottom: '20px' }}>

        {/* Widget Timer nhỏ */}
        <div className="glass-card" style={{ padding: '28px 24px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', background: 'var(--color-primary-light)',
            color: 'var(--color-primary)', padding: '4px 12px',
            borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '20px'
          }}>
            🎯 Tập trung
          </div>

          {/* Vòng tròn timer SVG */}
          <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 20px' }}>
            <svg viewBox="0 0 140 140" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
              <circle cx="70" cy="70" r="60" fill="none" stroke="#e8dff5" strokeWidth="8" />
              <circle cx="70" cy="70" r="60" fill="none" stroke="var(--color-primary)" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * 0.5}`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)'
            }}>
              25:00
            </div>
          </div>

          <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Phiên làm việc</div>
          <div style={{ color: 'var(--color-muted)', fontSize: '13px', marginBottom: '20px' }}>Đã hoàn thành 2/4 phiên</div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link to="/pomodoro" className="btn-primary" style={{ fontSize: '13px', padding: '10px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ▶ Bắt đầu
            </Link>
            <button style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: '2px solid var(--color-border)',
              background: 'white', cursor: 'pointer', fontSize: '16px'
            }}>↺</button>
          </div>
        </div>

        {/* Danh sách Phòng học */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Không gian học tập</h2>
            <Link to="/study-room" style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '13px', textDecoration: 'none' }}>
              Xem tất cả →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {MOCK_ROOMS.slice(0, 4).map(room => (
              <Link to={`/study-room/${room.id}`} key={room.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: room.bg,
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  border: '1px solid rgba(255,255,255,0.6)',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', flexShrink: 0
                    }}>
                      {room.emoji}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-text)' }}>{room.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{room.genre}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: '600' }}>
                      👥 +{room.members}
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.8)', color: 'var(--color-primary)',
                      borderRadius: '99px', padding: '3px 10px', fontSize: '12px', fontWeight: '700'
                    }}>
                      🟢 {room.online}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Music Player mini hiển thị bài đang phát */}
      <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-primary)', letterSpacing: '1px' }}>ĐANG PHÁT</div>
        <div style={{
          width: '36px', height: '36px', backgroundColor: 'var(--color-primary-light)',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
        }}>🎧</div>
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
