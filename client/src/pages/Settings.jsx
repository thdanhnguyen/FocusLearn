import { useState } from 'react';
import { useMusicPlayer } from '../components/MusicPlayer';

// Component Toggle Switch tái sử dụng được
// KIẾN THỨC MỚI (Component con / Reusable Component):
// Thay vì viết đi viết lại HTML cho mỗi cái toggle, ta đóng gói nó thành 1 component riêng.
// Component con nhận "props" từ cha (value, onChange, label, description).
function ToggleSwitch({ value, onChange, label, description }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
      <div>
        <div style={{ fontWeight: '700', fontSize: '15px' }}>{label}</div>
        {description && <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>{description}</div>}
      </div>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: '44px', height: '24px', borderRadius: '99px',
          background: value ? 'var(--color-primary)' : '#e0d8eb',
          cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
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

const inputStyle = {
  width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--color-border)', borderRadius: '10px',
  fontSize: '14px', outline: 'none', fontFamily: 'Quicksand, sans-serif',
  background: 'white', color: 'var(--color-text)',
};

export default function Settings() {
  const { handleVolumeChange, volume, PLAYLISTS, changeTrack, currentTrack } = useMusicPlayer();
  const [settings, setSettings] = useState({
    lofiAutoPlay: true,
    rainSound: false,
    meditationMode: true,
  });
  const [notifType, setNotifType] = useState('bell'); // 'bell' hoặc 'vibrate'

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  return (
    <div style={{ padding: '32px 36px', maxWidth: '700px' }} className="fade-in">
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>Cài đặt tĩnh lặng</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: '28px' }}>Tinh chỉnh không gian làm việc của bạn để đạt trạng thái dòng chảy lý tưởng.</p>

      {/* Âm thanh nền */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>🎧</span>
          <h3 style={{ margin: 0, fontSize: '17px' }}>Âm thanh nền</h3>
        </div>
        <div style={{ borderBottom: '1px solid var(--color-border)' }}>
          <ToggleSwitch value={settings.lofiAutoPlay} onChange={() => toggle('lofiAutoPlay')} label="Nhạc Lofi tự động" description="Phát khi bắt đầu Pomodoro" />
        </div>
        <div style={{ borderBottom: '1px solid var(--color-border)' }}>
          <ToggleSwitch value={settings.rainSound} onChange={() => toggle('rainSound')} label="Tiếng mưa rơi" description="Âm lượng nhỏ, liên tục" />
        </div>

        {/* Chọn playlist */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-muted)', marginBottom: '10px' }}>CHỌN PLAYLIST</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PLAYLISTS.map(track => (
              <div key={track.id} onClick={() => changeTrack(track)} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                background: currentTrack.id === track.id ? 'var(--color-primary-light)' : 'transparent',
                border: `1px solid ${currentTrack.id === track.id ? 'var(--color-primary)' : 'transparent'}`,
                transition: 'all 0.15s',
              }}>
                <span>🎵</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{track.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{track.artist}</div>
                </div>
                {currentTrack.id === track.id && <span style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700' }}>▶ ĐANG PHÁT</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-muted)', marginBottom: '8px' }}>Âm lượng tổng</div>
          <input type="range" min="0" max="100" value={volume} onChange={e => handleVolumeChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
        </div>
      </div>

      {/* Thông báo */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>🔔</span>
          <h3 style={{ margin: 0, fontSize: '17px' }}>Thông báo & Sự tập trung</h3>
        </div>
        <ToggleSwitch value={settings.meditationMode} onChange={() => toggle('meditationMode')} label='Chế độ "Thiền định"' description="Chặn toàn bộ thông báo khi đếm giờ đang chạy. Chỉ rung nhẹ khi kết thúc phiên." />

        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-muted)', marginBottom: '10px' }}>Kiểu thông báo kết thúc</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[{ key: 'bell', label: 'Chuông nhẹ (Chống xoay)' }, { key: 'vibrate', label: 'Chỉ rung mở' }].map(opt => (
              <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', flex: 1, padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${notifType === opt.key ? 'var(--color-primary)' : 'var(--color-border)'}`, background: notifType === opt.key ? 'var(--color-primary-light)' : 'white' }}>
                <input type="radio" name="notif" value={opt.key} checked={notifType === opt.key} onChange={() => setNotifType(opt.key)} style={{ accentColor: 'var(--color-primary)' }} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bảo mật */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '20px' }}>🔐</span>
          <h3 style={{ margin: 0, fontSize: '17px' }}>Bảo mật tài khoản</h3>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Email liên kết</label>
          <input type="email" defaultValue="scholar@focuslearn.app" style={inputStyle} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Mật khẩu hiện tại</label>
            <input type="password" defaultValue="••••••••" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>Mật khẩu mới</label>
            <input type="password" placeholder="Nhập mật khẩu mới" style={inputStyle} />
          </div>
        </div>
        <button className="btn-primary" style={{ float: 'right' }}>Cập nhật bảo mật</button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--color-muted)', fontSize: '13px' }}>
        <p>© 2026 FocusLearn Education. Designed for Deep Work.</p>
      </div>
    </div>
  );
}
