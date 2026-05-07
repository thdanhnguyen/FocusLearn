import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// ============================================================
// KIẾN THỨC MỚI (Google OAuth - Identity Services):
// Google cung cấp thư viện GSI (Google Identity Services) để đăng nhập bằng Google.
// Luồng hoạt động:
//   1. Load script: https://accounts.google.com/gsi/client
//   2. Gọi google.accounts.id.initialize() với Client ID và callback
//   3. Khi user click nút Google, popup hiện ra và user chọn tài khoản
//   4. Google trả về một "credential" (ID token dạng JWT)
//   5. Ta gửi credential đó lên Backend để Backend verify với Google
//   6. Backend trả về JWT của chính hệ thống mình
// ============================================================

// Styles dùng chung trong trang này
const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: "'Be Vietnam Pro', sans-serif",
  },
  wrapper: {
    width: '100%',
    maxWidth: '420px',
  },
  card: {
    background: 'var(--surface-low)',
    border: '1px solid var(--outline-subtle)',
    borderRadius: 'var(--r-xl)',
    padding: '40px',
    boxShadow: '0 4px 24px rgba(106,86,130,0.07)',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    letterSpacing: '0.02em',
  },
  error: {
    background: '#ffdad6',
    color: '#93000a',
    padding: '12px 16px',
    borderRadius: 'var(--r-md)',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '16px',
    border: '1px solid #ffb4ab',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '20px 0',
    color: 'var(--text-muted)',
    fontSize: '12px',
  },
  line: {
    flex: 1,
    height: '1px',
    background: 'var(--outline-subtle)',
  },
  googleBtn: {
    width: '100%',
    padding: '11px 16px',
    border: '1.5px solid var(--outline-subtle)',
    borderRadius: 'var(--r-full)',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text)',
    fontFamily: "'Be Vietnam Pro', sans-serif",
    transition: 'all 0.2s',
  },
};

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Đăng nhập bằng email/password thông thường
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (data.success) {
        login(data.data.user, data.data.token);
        navigate('/');
      } else {
        setErrorMsg(data.message || 'Thông tin đăng nhập không chính xác');
      }
    } catch {
      setErrorMsg('Không thể kết nối máy chủ. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập bằng Google
  // KIẾN THỨC MỚI: Khi nhận được Google credential, ta gửi lên backend để backend xác thực
  const handleGoogleLogin = async (googleCredential) => {
    setLoading(true);
    try {
      const data = await fetchApi('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential: googleCredential })
      });
      if (data.success) {
        login(data.data.user, data.data.token);
        navigate('/');
      } else {
        setErrorMsg(data.message || 'Đăng nhập Google thất bại');
      }
    } catch {
      setErrorMsg('Lỗi kết nối Google. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Render Google Sign-In button bằng GSI
  // KIẾN THỨC MỚI: Dùng useEffect để load script Google sau khi component mount
  // Ở đây ta dùng cách đơn giản hơn: gọi thẳng sau khi script load
  const initGoogle = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        // THAY BẰNG GOOGLE CLIENT ID THẬT của bạn sau khi tạo project trên Google Cloud Console
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: (response) => handleGoogleLogin(response.credential),
      });
      window.google.accounts.id.prompt(); // Hiện popup Google
    } else {
      // Nếu script chưa load, tự load rồi thử lại
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.wrapper} className="fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: '36px', color: 'var(--primary)', fontWeight: '600' }}>
            FocusLearn
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: '500' }}>
            DEEP WORK PORTAL
          </p>
        </div>

        <div style={S.card}>
          <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: '26px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
            Chào mừng trở lại
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
            Đăng nhập để lưu tiến trình và tham gia phòng học.
          </p>

          {/* Nút Google */}
          <button
            onClick={initGoogle}
            style={S.googleBtn}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-high)'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            {/* Google logo SVG inline */}
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
            </svg>
            Tiếp tục với Google
          </button>

          {/* Đường phân cách */}
          <div style={S.divider}>
            <div style={S.line} />
            <span>hoặc</span>
            <div style={S.line} />
          </div>

          {/* Thông báo lỗi */}
          {errorMsg && <div style={S.error}>⚠️ {errorMsg}</div>}

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={S.label}>Email</label>
              <input className="input" type="email" name="email" required placeholder="you@example.com" onChange={handleChange} />
            </div>
            <div>
              <label style={S.label}>Mật khẩu</label>
              <input className="input" type="password" name="password" required placeholder="••••••••" onChange={handleChange} />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '24px' }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              Đăng ký miễn phí
            </Link>
          </p>

          {/* Ghi chú nhỏ - không bắt buộc đăng nhập */}
          <div style={{
            marginTop: '20px', padding: '12px 16px',
            background: 'var(--tertiary-container)', borderRadius: 'var(--r-md)',
            fontSize: '12px', color: 'var(--on-tertiary-container)', textAlign: 'center'
          }}>
            💡 Bạn có thể <Link to="/" style={{ color: 'var(--on-tertiary-container)', fontWeight: '700' }}>khám phá FocusLearn</Link> mà không cần đăng nhập.
            Chỉ cần đăng nhập khi muốn <strong>tạo phòng học riêng</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
