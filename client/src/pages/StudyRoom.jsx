import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMusicPlayer } from '../components/MusicPlayer';
import { useState, useEffect, useRef } from 'react';

// KIẾN THỨC MỚI (useRef cho timer):
// Không thể dùng useState để lưu intervalId vì setState re-render component,
// còn intervalId cần tồn tại xuyên suốt các lần re-render.
// useRef trả về một object { current: ... } không bị reset khi component re-render.

const TIMER_MODES = {
  WORK:  { label: 'DEEP WORK',  duration: 25 * 60, color: 'var(--primary)' },
  SHORT: { label: 'NGHỈ NGẮN', duration: 5  * 60, color: 'var(--secondary)' },
  LONG:  { label: 'NGHỈ DÀI',  duration: 15 * 60, color: '#e07a5f' },
};

// Component Lobby: Hiển thị khi vào /study-room (không có ID cụ thể)
// Người dùng có thể tạo phòng mới hoặc join phòng có sẵn
function StudyRoomLobby() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Danh sách phòng công khai (mock data - sau này fetch từ API)
  const PUBLIC_ROOMS = [
    { id: 'lofi-lib', name: 'Thư viện tĩnh lặng', emoji: '📚', genre: 'Lofi Hip Hop', members: 40 },
    { id: 'cafe-sach', name: 'Quán cà phê sách', emoji: '☕', genre: 'Acoustic • Tiếng mưa', members: 16 },
    { id: 'green-space', name: 'Không gian xanh', emoji: '🌿', genre: 'Nature Sounds', members: 22 },
    { id: 'midnight', name: 'Studio Ban đêm', emoji: '🌙', genre: 'Jazz Lo-fi', members: 8 },
  ];

  const handleCreateRoom = () => {
    if (!user) {
      // Chưa đăng nhập → đưa sang Login
      navigate('/login');
      return;
    }
    const roomName = prompt('Đặt tên không gian học tập của bạn:');
    if (roomName?.trim()) {
      // Tạo ID phòng từ timestamp - sau này sẽ gọi API thật
      const roomId = `room-${Date.now()}`;
      navigate(`/study-room/${roomId}`);
    }
  };

  return (
    <div style={{ padding: '32px 36px' }} className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>Không gian học tập</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Chọn một phòng để tham gia, hoặc tự tạo không gian học riêng của bạn.
          </p>
        </div>
        <button className="btn-primary" onClick={handleCreateRoom} style={{ flexShrink: 0 }}>
          + Tạo phòng mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {PUBLIC_ROOMS.map(room => (
          <div
            key={room.id}
            onClick={() => navigate(`/study-room/${room.id}`)}
            style={{
              background: 'var(--surface-low)',
              border: '1px solid var(--outline-subtle)',
              borderRadius: 'var(--r-xl)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(106,86,130,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{room.emoji}</div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{room.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>{room.genre}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>👥 {room.members} người</span>
              <span style={{ fontSize: '12px', background: 'var(--secondary-container)', color: 'var(--on-secondary-container)', padding: '3px 10px', borderRadius: '99px', fontWeight: '700' }}>
                Tham gia
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component phòng học thực (khi đã có ID)
function StudyRoomSession({ id }) {
  const { user } = useAuth();
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = useMusicPlayer();

  const [mode, setMode] = useState('WORK');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.WORK.duration);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  const intervalRef = useRef(null);

  const [notes, setNotes] = useState(['Review Chapter 4: Cognitive Load Theory.', 'Draft intro for the essay.', '']);
  const [messages, setMessages] = useState([
    { name: 'Alex', text: 'Joining for a quick 50 min session!', time: '10:42 AM', isMe: false },
    { name: 'Bạn', text: "Good luck! Let's focus. 💪", time: '10:45 AM', isMe: true },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // MOCK data phòng - sau này fetch từ API theo ID
  const roomInfo = {
    name: id.startsWith('room-') ? 'Phòng học của tôi' : `Study Room #${id}`,
    emoji: id.startsWith('room-') ? '🏠' : '📚',
  };

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
    setTimeLeft(TIMER_MODES[m].duration);
    setRunning(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const progress = timeLeft / TIMER_MODES[mode].duration;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(m => [...m, {
      name: user?.displayName || 'Bạn',
      text: chatInput,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }]);
    setChatInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', background: 'var(--surface-low)',
        borderBottom: '1px solid var(--outline-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>{roomInfo.emoji}</span>
          <span style={{ fontWeight: '700', fontSize: '16px' }}>{roomInfo.name}</span>
          <span style={{ fontSize: '12px', background: 'var(--secondary-container)', color: 'var(--on-secondary-container)', padding: '3px 10px', borderRadius: '99px', fontWeight: '600' }}>
            🟢 Đang hoạt động
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={topBtnStyle}>🔊</button>
          <button style={{ ...topBtnStyle, background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: '99px', fontWeight: '700', border: 'none' }}>
            Mời bạn bè
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: Timer */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '24px', position: 'relative', overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 40%, rgba(107,79,160,0.06) 0%, transparent 70%)',
        }}>
          <div style={{
            background: 'var(--primary)', color: 'white',
            padding: '5px 16px', borderRadius: '99px', fontWeight: '700',
            fontSize: '12px', letterSpacing: '1.5px', marginBottom: '20px'
          }}>
            {TIMER_MODES[mode].label}
          </div>

          <div style={{ position: 'relative', width: '300px', height: '300px' }}>
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
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '64px', fontWeight: '700', color: TIMER_MODES[mode].color, lineHeight: 1 }}>
                {formatTime(timeLeft)}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                Phiên {session} / 4
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '16px' }}>
            <button onClick={() => { setTimeLeft(TIMER_MODES[mode].duration); setRunning(false); }} style={controlBtn}>↺</button>
            <button onClick={() => setRunning(r => !r)} style={{
              ...controlBtn, width: '56px', height: '56px', fontSize: '22px',
              background: 'var(--primary)', color: 'white',
              boxShadow: '0 6px 24px rgba(107,79,160,0.35)'
            }}>
              {running ? '⏸' : '▶'}
            </button>
            <button onClick={() => setRunning(false)} style={controlBtn}>⏹</button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            {Object.entries(TIMER_MODES).map(([key, val]) => (
              <button key={key} onClick={() => switchMode(key)} style={{
                padding: '6px 14px', borderRadius: '99px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: '700',
                background: mode === key ? 'var(--primary)' : 'var(--primary-container)',
                color: mode === key ? 'white' : 'var(--on-primary-container)',
                transition: 'all 0.15s'
              }}>
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Notes + Chat */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--outline-subtle)' }}>
          {/* Notes */}
          <div style={{ flex: 1, padding: '16px', borderBottom: '1px solid var(--outline-subtle)', overflowY: 'auto' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              📝 SCRIBBLE PAD
            </div>
            {notes.map((note, i) => (
              <div key={i} style={{
                padding: '8px 10px',
                borderBottom: i < notes.length - 1 ? '1px solid var(--outline-subtle)' : 'none',
                fontSize: '13px', color: 'var(--text)',
              }}>
                {note || (
                  <input
                    placeholder="Jot something down..."
                    className="input"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
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

          {/* Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--outline-subtle)', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: 'var(--text-muted)' }}>
              👥 STUDY BUDDIES
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                  {!msg.isMe && <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', marginBottom: '3px' }}>{msg.name}</span>}
                  <div style={{
                    background: msg.isMe ? 'var(--primary)' : 'var(--primary-container)',
                    color: msg.isMe ? 'white' : 'var(--on-primary-container)',
                    padding: '8px 12px', borderRadius: msg.isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    fontSize: '13px', maxWidth: '90%',
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} style={{ padding: '10px 16px', display: 'flex', gap: '8px', borderTop: '1px solid var(--outline-subtle)' }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Nhắn gì đó..."
                className="input"
                style={{ flex: 1, padding: '8px 14px', fontSize: '13px', borderRadius: '99px' }}
              />
              <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontSize: '14px' }}>
                ➤
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component chính: tự quyết định hiển thị Lobby hay Room
export default function StudyRoom() {
  const { id } = useParams();
  // Nếu có id trong URL → vào phòng. Nếu không → hiển thị Lobby.
  return id ? <StudyRoomSession id={id} /> : <StudyRoomLobby />;
}

const topBtnStyle = {
  padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--outline-subtle)',
  background: 'var(--surface)', cursor: 'pointer', fontSize: '16px',
};

const controlBtn = {
  width: '44px', height: '44px', borderRadius: '50%',
  border: 'none', background: 'var(--primary-container)',
  color: 'var(--on-primary-container)', cursor: 'pointer', fontSize: '18px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.15s',
};
