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
// UI của thanh Music Player ở dưới cùng trang
// ====================================================
export default function MusicPlayer() {
  const { currentTrack, isPlaying, volume, togglePlay, nextTrack, prevTrack, handleVolumeChange } = useMusicPlayer();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '200px', // Cách sidebar ra
      right: 0,
      backgroundColor: 'rgba(255, 245, 251, 0.92)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--color-border)',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      zIndex: 40,
    }}>
      {/* Album Art giả */}
      <div style={{
        width: '44px', height: '44px',
        backgroundColor: 'var(--color-primary-light)',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
      }}>
        🎵
      </div>

      {/* Tên bài */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentTrack.title}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
          {currentTrack.artist}
        </div>
      </div>

      {/* Nút điều khiển */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={prevTrack} style={btnStyle}>⏮</button>
        <button onClick={togglePlay} style={{
          ...btnStyle,
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          width: '38px', height: '38px',
          fontSize: '16px',
        }}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={nextTrack} style={btnStyle}>⏭</button>
      </div>

      {/* Volume slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
        <span style={{ fontSize: '14px' }}>🔉</span>
        <input
          type="range"
          min="0" max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--color-primary)' }}
        />
      </div>
    </div>
  );
}

const btnStyle = {
  width: '32px', height: '32px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: 'var(--color-primary-light)',
  color: 'var(--color-primary)',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '13px',
  fontWeight: '700',
  transition: 'all 0.15s ease',
};
