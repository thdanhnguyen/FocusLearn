import { useState, useEffect, useRef } from 'react';
import { useMusicPlayer } from '../components/MusicPlayer';

const MODES = {
  WORK:  { label: 'DEEP WORK',  duration: 25 * 60, color: 'var(--color-primary)' },
  SHORT: { label: 'NGHỈ NGẮN', duration: 5  * 60, color: 'var(--color-green)' },
  LONG:  { label: 'NGHỈ DÀI',  duration: 15 * 60, color: '#e07a5f' },
};

const QUOTES = [
  '"Tập trung không phải là bí quyết của năng suất, mà là nền tảng của nó."',
  '"Một phiên tập trung sâu hơn mười phiên xao lãng."',
  '"Tĩnh lặng không phải là sự vắng lặng, mà là khoảng trống để tư duy lớn lên."',
  '"Mỗi Pomodoro là một viên gạch xây nên phiên bản tốt nhất của bạn."',
];

const ctrlBtn = {
  width: '50px', height: '50px', borderRadius: '50%',
  border: 'none', background: 'var(--color-primary-light)',
  color: 'var(--color-primary)', cursor: 'pointer',
  fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.15s',
};

export default function PomodoroCorner() {
  const [mode, setMode] = useState('WORK');
  const [timeLeft, setTimeLeft] = useState(MODES.WORK.duration);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const intervalRef = useRef(null);
  const { togglePlay, isPlaying } = useMusicPlayer();

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setSession(s => s + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const switchMode = (m) => {
    setMode(m);
    setTimeLeft(MODES[m].duration);
    setRunning(false);
  };

  const reset = () => {
    setTimeLeft(MODES[mode].duration);
    setRunning(false);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const progress = timeLeft / MODES[mode].duration;
  const R = 140;
  const C = 2 * Math.PI * R;

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(107,79,160,0.05) 0%, transparent 70%)',
      padding: '32px',
    }} className="fade-in">

      {/* Quote */}
      <p style={{ fontStyle: 'italic', color: 'var(--color-muted)', fontSize: '15px', marginBottom: '32px', textAlign: 'center', maxWidth: '480px' }}>
        {quote}
      </p>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {Object.entries(MODES).map(([key, val]) => (
          <button key={key} onClick={() => switchMode(key)} style={{
            padding: '8px 20px', borderRadius: '99px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '700',
            background: mode === key ? 'var(--color-primary)' : 'var(--color-primary-light)',
            color: mode === key ? 'white' : 'var(--color-primary)',
            transition: 'all 0.2s',
          }}>
            {val.label}
          </button>
        ))}
      </div>

      {/* Vòng tròn đếm giờ lớn */}
      <div style={{ position: 'relative', width: '340px', height: '340px' }}>
        <svg viewBox="0 0 340 340" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Track ngoài */}
          <circle cx="170" cy="170" r={R} fill="none" stroke="rgba(107,79,160,0.08)" strokeWidth="14" />
          {/* Progress */}
          <circle
            cx="170" cy="170" r={R}
            fill="none" stroke={MODES[mode].color}
            strokeWidth="14"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '170px 170px', transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        {/* Chữ giờ ở giữa */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '72px', fontWeight: '700', color: MODES[mode].color, lineHeight: 1, letterSpacing: '-2px' }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '8px' }}>
            Phiên {session} / 4
          </div>
        </div>
      </div>

      {/* Nút điều khiển */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '28px' }}>
        <button onClick={reset} style={ctrlBtn}>↺</button>
        <button onClick={() => setRunning(r => !r)} style={{
          ...ctrlBtn, width: '64px', height: '64px', fontSize: '26px',
          background: 'var(--color-primary)', color: 'white',
          boxShadow: '0 8px 28px rgba(107,79,160,0.35)',
        }}>
          {running ? '⏸' : '▶'}
        </button>
        <button onClick={() => setRunning(false)} style={ctrlBtn}>⏹</button>
      </div>

      {/* Session dots */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {[1, 2, 3, 4].map(n => (
          <div key={n} style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: n < session ? 'var(--color-primary)' : 'var(--color-primary-light)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Nút phát nhạc */}
      <button onClick={togglePlay} style={{
        marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px',
        border: 'none', background: 'var(--color-primary-light)',
        color: 'var(--color-primary)', padding: '10px 20px',
        borderRadius: '99px', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
        fontFamily: 'Quicksand, sans-serif',
      }}>
        {isPlaying ? '⏸ Tạm dừng nhạc' : '🎵 Bật nhạc nền'}
      </button>
    </div>
  );
}
