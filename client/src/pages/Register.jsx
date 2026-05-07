import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Tái sử dụng style object giống Login.jsx để đồng nhất visual
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
  wrapper: { width: '100%', maxWidth: '420px' },
  card: {
    background: 'var(--surface-low)',
    border: '1px solid var(--outline-subtle)',
    borderRadius: 'var(--r-xl)',
    padding: '40px',
    boxShadow: '0 4px 24px rgba(106,86,130,0.07)',
  },
  label: {
    display: 'block', fontSize: '13px', fontWeight: '600',
    color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.02em',
  },
  error: {
    background: '#ffdad6', color: '#93000a',
    padding: '12px 16px', borderRadius: 'var(--r-md)',
    fontSize: '13px', fontWeight: '500', marginBottom: '16px', border: '1px solid #ffb4ab',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: '12px',
    margin: '20px 0', color: 'var(--text-muted)', fontSize: '12px',
  },
  line: { flex: 1, height: '1px', background: 'var(--outline-subtle)' },
  googleBtn: {
    width: '100%', padding: '11px 16px',
    border: '1.5px solid var(--outline-subtle)', borderRadius: 'var(--r-full)',
    background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
    color: 'var(--text)', fontFamily: "'Be Vietnam Pro', sans-serif", transition: 'all 0.2s',
  },
};

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', displayName: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (data.success) {
        // Sau khi đăng ký, tự đăng nhập luôn thay vì đá sang trang login
        const loginRes = await fetchApi('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        if (loginRes.success) {
          login(loginRes.data.user, loginRes.data.token);
          navigate('/');
        } else {
          navigate('/login');
        }
      } else {
        setErrorMsg(data.message || 'Đăng ký thất bại');
      }
    } catch {
      setErrorMsg('Không thể kết nối máy chủ. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký/đăng nhập bằng Google (cùng endpoint với login)
  const handleGoogleSignup = async (googleCredential) => {
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

  const initGoogle = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: (response) => handleGoogleSignup(response.credential),
      });
      window.google.accounts.id.prompt();
    } else {
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
          <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: '26px', fontWeight: '500', marginBottom: '6px' }}>
            Tạo tài khoản
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
            Gia nhập cộng đồng học tập và tạo không gian tập trung của riêng bạn.
          </p>

          {/* Nút Google */}
          <button
            onClick={initGoogle}
            style={S.googleBtn}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-high)'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
            </svg>
            Đăng ký bằng Google
          </button>

          <div style={S.divider}>
            <div style={S.line} />
            <span>hoặc điền form</span>
            <div style={S.line} />
          </div>

          {errorMsg && <div style={S.error}>⚠️ {errorMsg}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={S.label}>Tên hiển thị</label>
              <input className="input" type="text" name="displayName" required placeholder="Ví dụ: Dân Cày Code" onChange={handleChange} />
            </div>
            <div>
              <label style={S.label}>Email</label>
              <input className="input" type="email" name="email" required placeholder="you@example.com" onChange={handleChange} />
            </div>
            <div>
              <label style={S.label}>Mật khẩu</label>
              <input className="input" type="password" name="password" required placeholder="••••••••" onChange={handleChange} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Tối thiểu 8 ký tự
              </span>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Ngay'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '24px' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              Đăng nhập ngay
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px', lineHeight: '1.5' }}>
            Khi đăng ký, bạn đồng ý với{' '}
            <a href="#" style={{ color: 'var(--primary)' }}>Điều khoản sử dụng</a>
            {' '}và{' '}
            <a href="#" style={{ color: 'var(--primary)' }}>Chính sách bảo mật</a> của FocusLearn.
          </p>
        </div>
      </div>
    </div>
  );
}
