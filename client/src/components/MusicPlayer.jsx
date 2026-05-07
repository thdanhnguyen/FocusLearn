import { useState, useRef, useEffect, createContext, useContext } from 'react';

// ====================================================
// KIẾN THỨC MỚI (YouTube IFrame Player API):
// YouTube cho phép chúng ta nhúng một video vào web và điều khiển nó bằng JavaScript.
// Cách thực hiện:
//   1. Load script của YouTube: https://www.youtube.com/iframe_api
//   2. Khi script load xong, YouTube tự gọi hàm callback window.onYouTubeIframeAPIReady
//   3. Ta tạo đối tượng new YT.Player() trỏ vào một <div> trống trong DOM
//   4. Từ đó ta có thể gọi: player.playVideo(), player.pauseVideo(), player.setVolume()
// ====================================================

// Context chia sẻ player ra toàn bộ app
const MusicContext = createContext();
export const useMusicPlayer = () => useContext(MusicContext);

// Danh sách playlist mặc định (YouTube Video ID)
export const PLAYLISTS = [
  { id: 'jfKfPfyJRdk', title: 'Lofi Hip Hop Radio', artist: 'Lofi Girl' },
  { id: '5qap5aO4i9A', title: 'Chillhop Music', artist: 'Chillhop' },
  { id: 'MVPTGNGiI-4', title: 'Midnight Study Session', artist: 'Lofi Girl' },
  { id: 'DWcJFNfaw9c', title: 'Rainy Cafe Study', artist: 'Lofi Chill' },
];

// Provider bọc toàn bộ app để các component con dùng được player
export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(PLAYLISTS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef(null); // Ref lưu đối tượng YT.Player
  const containerRef = useRef(null); // Ref trỏ vào <div> để YouTube nhúng vào

  useEffect(() => {
    // Bước 1: Load script YouTube nếu chưa load
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    // Bước 2: Hàm callback YouTube sẽ gọi khi script load xong
    window.onYouTubeIframeAPIReady = initPlayer;

    // Nếu YouTube đã load sẵn rồi (do reload trang), gọi luôn
    if (window.YT && window.YT.Player) {
      initPlayer();
    }
  }, []);

  const initPlayer = () => {
    playerRef.current = new window.YT.Player('yt-player-hidden', {
      height: '0',
      width: '0',
      videoId: currentTrack.id,
      playerVars: {
        autoplay: 0,
        controls: 0,
      },
      events: {
        onStateChange: (event) => {
          // KIẾN THỨC MỚI: YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        }
      }
    });
  };

  const play = () => {
    playerRef.current?.playVideo();
  };

  const pause = () => {
    playerRef.current?.pauseVideo();
  };

  const togglePlay = () => {
    if (isPlaying) pause();
    else play();
  };

  const changeTrack = (track) => {
    setCurrentTrack(track);
    // Dùng loadVideoById để đổi video mà không cần tạo lại player
    playerRef.current?.loadVideoById(track.id);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    const idx = PLAYLISTS.findIndex(t => t.id === currentTrack.id);
    const next = PLAYLISTS[(idx + 1) % PLAYLISTS.length];
    changeTrack(next);
  };

  const prevTrack = () => {
    const idx = PLAYLISTS.findIndex(t => t.id === currentTrack.id);
    const prev = PLAYLISTS[(idx - 1 + PLAYLISTS.length) % PLAYLISTS.length];
    changeTrack(prev);
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
    playerRef.current?.setVolume(val);
  };

  return (
    <MusicContext.Provider value={{
      currentTrack, isPlaying, volume,
      togglePlay, nextTrack, prevTrack,
      handleVolumeChange, PLAYLISTS, changeTrack
    }}>
      {/* div ẩn - YouTube cần một DOM element để nhúng iframe vào */}
      <div id="yt-player-hidden" style={{ display: 'none' }} />
      {children}
    </MusicContext.Provider>
  );
};

// ====================================================
// UI của thanh Music Player (Floating Widget)
// ====================================================
export default function MusicPlayer() {
  const { currentTrack, isPlaying, volume, togglePlay, nextTrack, prevTrack, handleVolumeChange, changeTrack } = useMusicPlayer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [activeSpotifyUrl, setActiveSpotifyUrl] = useState(null);

  // Hàm trích xuất ID YouTube từ link dán vào
  const extractYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handlePlayCustom = (e) => {
    e.preventDefault();
    if (!customUrl) return;

    if (customUrl.includes('spotify.com')) {
      setActiveSpotifyUrl(customUrl);
      setCustomUrl(''); // Xóa ô input
      return;
    }

    const ytID = extractYouTubeID(customUrl);
    if (ytID) {
      changeTrack({ id: ytID, title: 'Custom YouTube Link', artist: 'Nghe theo sở thích' });
      setActiveSpotifyUrl(null); // Tắt Spotify nếu có
      setCustomUrl('');
    } else {
      alert('Vui lòng dán link YouTube hoặc Spotify hợp lệ!');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: 'rgba(255, 248, 245, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--outline-subtle)',
      borderRadius: 'var(--r-xl)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 40,
      width: isExpanded ? '320px' : '260px',
      boxShadow: '0 8px 32px rgba(106, 86, 130, 0.08)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: "'Be Vietnam Pro', sans-serif"
    }}>
      
      {/* Nút thu gọn / mở rộng */}
      <button onClick={() => setIsExpanded(!isExpanded)} style={{
        position: 'absolute', top: '-10px', right: '-10px',
        width: '24px', height: '24px', borderRadius: '50%',
        background: 'var(--primary)', color: 'white', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {isExpanded ? '⤡' : '⤢'}
      </button>

      {/* Main Row */}
      {activeSpotifyUrl ? (
        <div style={{ animation: 'fadeIn 0.2s', width: '100%', height: '80px' }}>
          <iframe 
            style={{ borderRadius: '12px' }} 
            src={activeSpotifyUrl.replace('open.spotify.com', 'open.spotify.com/embed')} 
            width="100%" 
            height="80" 
            frameBorder="0" 
            allowFullScreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          ></iframe>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            backgroundColor: 'var(--primary-container)',
            color: 'var(--on-primary-container)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
          }}>
            🎵
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTrack.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {currentTrack.artist}
            </div>
          </div>

          {/* Play Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button onClick={prevTrack} style={btnStyle}>⏮</button>
            <button onClick={togglePlay} style={{
              ...btnStyle,
              backgroundColor: 'var(--primary)',
              color: 'white',
              width: '34px', height: '34px',
              fontSize: '14px',
            }}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={nextTrack} style={btnStyle}>⏭</button>
          </div>
        </div>
      )}

      {/* Extended Area (Volume & Custom Link) */}
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px', animation: 'fadeIn 0.2s' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px' }}>🔉</span>
            <input
              type="range" min="0" max="100" value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--primary)' }}
            />
          </div>

          <form onSubmit={handlePlayCustom} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Dán link YouTube hoặc Spotify..." 
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              className="input"
              style={{ padding: '6px 10px', fontSize: '12px' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Phát
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  width: '28px', height: '28px',
  borderRadius: '50%', border: 'none',
  backgroundColor: 'var(--surface-high)',
  color: 'var(--primary)',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '12px', fontWeight: '700',
  transition: 'all 0.15s ease',
};
