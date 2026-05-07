import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMusicPlayer, PLAYLISTS } from '../components/MusicPlayer';
import { useAuth } from '../context/AuthContext';

// KIẾN THỨC MỚI (useRef cho timer):
// Không thể dùng useState để lưu intervalId vì setState re-render component,
// còn intervalId cần tồn tại xuyên suốt các lần re-render.
// useRef trả về một object { current: ... } không bị reset khi component re-render.

const TIMER_MODES = {
  WORK: { label: 'DEEP WORK', duration: 25 * 60, color: 'var(--color-primary)' },
  SHORT: { label: 'NGHỈ NGẮN', duration: 5 * 60, color: 'var(--color-green)' },
  LONG:  { label: 'NGHỈ DÀI', duration: 15 * 60, color: '#e07a5f' },
};

// Danh sách phòng giả
const MOCK_ROOMS = {
  1: { name: 'Lofi Focus Session', emoji: '📚', bg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60' },
  2: { name: 'Quán Cà Phê Sách', emoji: '☕', bg: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=60' },
};

export default function StudyRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, PLAYLISTS: tracks, changeTrack } = useMusicPlayer();

  // Timer state
  const [mode, setMode] = useState('WORK');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.WORK.duration);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  const intervalRef = useRef(null);

  // Ghi chú pad
  const [notes, setNotes] = useState(['Review Chapter 4: Cognitive Load Theory.', 'Draft intro for the essay.', '']);

  // Chat messages
  const [messages, setMessages] = useState([
    { name: 'Alex', text: 'Joining for a quick 50 min session!', time: '10:42 AM', isMe: false },
    { name: 'Bạn', text: 'Good luck! Let\'s focus. 💪', time: '10:45 AM', isMe: true },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const room = MOCK_ROOMS[id] || MOCK_ROOMS[1];

  // Logic đếm ngược
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

  // Khi đổi mode, reset timer
  const switchMode = (m) => {
    setMode(m);
    setTimeLeft(TIMER_MODES[m].duration);
    setRunning(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Tính % tiến trình để vẽ vòng tròn SVG
  const progress = timeLeft / TIMER_MODES[mode].duration;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // Gửi chat
  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(m => [...m, {
      name: 'Bạn', text: chatInput, time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), isMe: true
    }]);
    setChatInput('');
    // Tự cuộn xuống tin nhắn mới nhất
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div style={{ height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', backgroundColor: 'rgba(255,245,251,0.9)',
        backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>{room.emoji}</span>
          <span style={{ fontWeight: '700', fontSize: '16px' }}>{room.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={topBtnStyle}>🔊</button>
          <button style={topBtnStyle}>⛶</button>
          <button style={{ ...topBtnStyle, backgroundColor: 'var(--color-primary)', color: 'white', padding: '8px 16px', borderRadius: '99px', fontWeight: '700' }}>
            Mời bạn bè
          </button>
        </div>
      </div>

      {/* Nội dung chính */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Cột trái: Timer + Player */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '24px', position: 'relative', overflow: 'hidden',
          background: `linear-gradient(rgba(245,240,255,0.7), rgba(245,240,255,0.85))`,
        }}>
          {/* Background blur giả */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: 'radial-gradient(circle at 50% 40%, rgba(107,79,160,0.08) 0%, transparent 70%)'
          }} />

          {/* Mode badge */}
          <div style={{
            zIndex: 1, background: 'var(--color-primary)', color: 'white',
            padding: '5px 16px', borderRadius: '99px', fontWeight: '700',
            fontSize: '12px', letterSpacing: '1.5px', marginBottom: '20px'
          }}>
            {TIMER_MODES[mode].label}
          </div>

          {/* Vòng tròn timer SVG */}
          <div style={{ position: 'relative', width: '300px', height: '300px', zIndex: 1 }}>
            <svg viewBox="0 0 300 300">
              <circle cx="150" cy="150" r={radius} fill="none" stroke="rgba(107,79,160,0.1)" strokeWidth="12" />
              <circle
                cx="150" cy="150" r={radius}
                fill="none" stroke={TIMER_MODES[mode].color}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '64px', fontWeight: '700', color: TIMER_MODES[mode].color, lineHeight: 1 }}>
                {formatTime(timeLeft)}
              </div>
              <div style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '8px' }}>
                Phiên {session} / 4
              </div>
            </div>
          </div>

          {/* Nút điều khiển */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', zIndex: 1, marginTop: '16px' }}>
            <button onClick={() => { setTimeLeft(TIMER_MODES[mode].duration); setRunning(false); }} style={controlBtn}>↺</button>
            <button onClick={() => setRunning(r => !r)} style={{
              ...controlBtn, width: '56px', height: '56px', fontSize: '22px',
              backgroundColor: 'var(--color-primary)', color: 'white',
              boxShadow: '0 6px 24px rgba(107,79,160,0.35)'
            }}>
              {running ? '⏸' : '▶'}
            </button>
            <button onClick={() => setRunning(false)} style={controlBtn}>⏹</button>
          </div>

          {/* Tabs chế độ */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px', zIndex: 1 }}>
            {Object.entries(TIMER_MODES).map(([key, val]) => (
              <button key={key} onClick={() => switchMode(key)} style={{
                padding: '6px 14px', borderRadius: '99px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: '700',
                backgroundColor: mode === key ? 'var(--color-primary)' : 'var(--color-primary-light)',
                color: mode === key ? 'white' : 'var(--color-primary)',
                transition: 'all 0.15s'
              }}>
                {val.label}
              </button>
            ))}
          </div>

          {/* Mini music player trong room */}
          <div style={{
            zIndex: 1, marginTop: '20px', width: '100%', maxWidth: '440px',
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
            borderRadius: '14px', padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: '14px',
            border: '1px solid rgba(255,255,255,0.7)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🎵</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>{currentTrack.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{currentTrack.artist}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={prevTrack} style={miniBtn}>⏮</button>
              <button onClick={togglePlay} style={{ ...miniBtn, backgroundColor: 'var(--color-primary)', color: 'white' }}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button onClick={nextTrack} style={miniBtn}>⏭</button>
            </div>
          </div>
        </div>

        {/* Cột phải: Ghi chú + Chat */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--color-border)' }}>

          {/* Scribble Pad */}
          <div style={{ flex: 1, padding: '16px', borderBottom: '1px solid var(--color-border)', overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px', color: 'var(--color-muted)' }}>📝 SCRIBBLE PAD</span>
            </div>
            {notes.map((note, i) => (
              <div key={i} style={{
                padding: '10px 12px',
                borderBottom: i < notes.length - 1 ? '1px solid var(--color-border)' : 'none',
                fontSize: '13px', color: i < notes.length - 1 ? 'var(--color-text)' : 'var(--color-muted)',
                textDecoration: i === 2 ? 'line-through' : 'none',
              }}>
                {note || (
                  <input
                    placeholder="Jot something down..."
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: 'var(--color-muted)', width: '100%', fontFamily: 'Quicksand, sans-serif' }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const newNotes = [...notes];
                        newNotes[i] = e.target.value;
                        newNotes.push('');
                        setNotes(newNotes);
                        e.target.value = '';
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Study Buddies Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px', color: 'var(--color-muted)' }}>👥 STUDY BUDDIES</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                  {!msg.isMe && <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '3px' }}>{msg.name}</span>}
                  <div style={{
                    background: msg.isMe ? 'var(--color-primary)' : 'var(--color-primary-light)',
                    color: msg.isMe ? 'white' : 'var(--color-text)',
                    padding: '8px 12px', borderRadius: msg.isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    fontSize: '13px', maxWidth: '90%',
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--color-muted)', marginTop: '3px' }}>{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} style={{ padding: '10px 16px', display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)' }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Whisper to the room..."
                style={{
                  flex: 1, border: 'none', background: 'var(--color-primary-light)',
                  borderRadius: '99px', padding: '8px 14px',
                  fontSize: '13px', outline: 'none', fontFamily: 'Quicksand, sans-serif'
                }}
              />
              <button type="submit" style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontSize: '14px' }}>
                ➤
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const topBtnStyle = {
  padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--color-border)',
  background: 'white', cursor: 'pointer', fontSize: '16px',
};

const controlBtn = {
  width: '44px', height: '44px', borderRadius: '50%',
  border: 'none', background: 'var(--color-primary-light)',
  color: 'var(--color-primary)', cursor: 'pointer', fontSize: '18px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.15s',
};

const miniBtn = {
  width: '28px', height: '28px', borderRadius: '50%',
  border: 'none', background: 'var(--color-primary-light)',
  color: 'var(--color-primary)', cursor: 'pointer', fontSize: '12px',
};
