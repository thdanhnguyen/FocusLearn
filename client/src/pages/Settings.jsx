import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMusicPlayer } from '../components/MusicPlayer';

// Component Toggle Switch tái sử dụng được
function ToggleSwitch({ value, onChange, label, description }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
      <div>
        <div style={{ fontWeight: '600', fontSize: '14px' }}>{label}</div>
        {description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>}
      </div>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: '44px', height: '24px', borderRadius: '99px',
          background: value ? 'var(--primary)' : 'var(--surface-highest)',
          cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: '3px',
          left: value ? '23px' : '3px',
          width: '18px', height: '18px',
          borderRadius: '50%', background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }} />
      </div>
    </div>
  );
}

export default function Settings() {
  // Lấy các hàm từ MusicPlayer context
  const music = useMusicPlayer();

  // Lấy thông tin user thật
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    lofiAutoPlay: true,
    rainSound: false,
    meditationMode: true,
  });
  const [notifType, setNotifType] = useState('bell');

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  // Kiểm tra nếu MusicPlayer context chưa được mount (tránh lỗi crash)
  if (!music) {
    return (
      <div style={{ padding: '32px 36px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Đang tải cài đặt âm nhạc...</p>
      </div>
    );
  }

  const { handleVolumeChange, volume, PLAYLISTS, changeTrack, currentTrack } = music;
  const userEmail = user?.email || 'scholar@focuslearn.app';

  return (
    <div style={{ padding: '32px 36px', maxWidth: '700px' }} className="fade-in">
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>Cài đặt</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
        Tinh chỉnh không gian làm việc của bạn để đạt trạng thái tập trung lý tưởng.
      </p>

      {/* Âm thanh nền */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '20px' }}>🎧</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Âm thanh nền</h3>
        </div>
        <div style={{ borderBottom: '1px solid var(--outline-subtle)' }}>
          <ToggleSwitch value={settings.lofiAutoPlay} onChange={() => toggle('lofiAutoPlay')} label="Nhạc Lofi tự động" description="Phát khi bắt đầu Pomodoro" />
        </div>
        <div style={{ borderBottom: '1px solid var(--outline-subtle)' }}>
          <ToggleSwitch value={settings.rainSound} onChange={() => toggle('rainSound')} label="Tiếng mưa rơi" description="Âm lượng nhỏ, liên tục" />
        </div>

        {/* Chọn playlist */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '10px' }}>CHỌN PLAYLIST</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(PLAYLISTS || []).map(track => (
              <div key={track.id} onClick={() => changeTrack(track)} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '12px', cursor: 'pointer',
                background: currentTrack?.id === track.id ? 'var(--primary-container)' : 'transparent',
                border: `1px solid ${currentTrack?.id === track.id ? 'var(--outline-subtle)' : 'transparent'}`,
                transition: 'all 0.15s',
              }}>
                <span>🎵</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{track.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{track.artist}</div>
                </div>
                {currentTrack?.id === track.id && <span style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '700' }}>▶ ĐANG PHÁT</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Âm lượng tổng</div>
          <input
            type="range" min="0" max="100" value={volume}
            onChange={e => handleVolumeChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
        </div>
      </div>

      {/* Thông báo */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>🔔</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Thông báo & Tập trung</h3>
        </div>
        <ToggleSwitch
          value={settings.meditationMode}
          onChange={() => toggle('meditationMode')}
          label='Chế độ "Tĩnh lặng"'
          description="Chặn toàn bộ thông báo khi đếm giờ đang chạy."
        />
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '10px' }}>Kiểu thông báo kết thúc phiên</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[{ key: 'bell', label: '🔔 Chuông nhẹ' }, { key: 'vibrate', label: '📳 Chỉ rung' }].map(opt => (
              <label key={opt.key} style={{
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                fontSize: '13px', flex: 1, padding: '10px 14px', borderRadius: '12px',
                border: `1.5px solid ${notifType === opt.key ? 'var(--primary)' : 'var(--outline-subtle)'}`,
                background: notifType === opt.key ? 'var(--primary-container)' : 'transparent',
                fontWeight: notifType === opt.key ? '700' : '400',
              }}>
                <input type="radio" name="notif" value={opt.key} checked={notifType === opt.key} onChange={() => setNotifType(opt.key)} style={{ accentColor: 'var(--primary)' }} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Tài khoản */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '20px' }}>👤</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Tài khoản</h3>
        </div>
        <div style={{ padding: '12px 16px', background: 'var(--surface)', borderRadius: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email đang liên kết</div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{userEmail}</div>
          {user && (
            <div style={{ fontSize: '11px', color: 'var(--secondary)', marginTop: '4px', fontWeight: '600' }}>
              ✓ Đã xác thực qua Google
            </div>
          )}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Tài khoản của bạn được liên kết qua Google OAuth. Để thay đổi mật khẩu, vui lòng truy cập tài khoản Google của bạn.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '12px' }}>
        <p>© 2026 FocusLearn Education. Designed for Deep Work.</p>
      </div>
    </div>
  );
}
