import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', background: 'var(--bg)',
          fontFamily: "'Be Vietnam Pro', sans-serif", padding: '24px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🪴</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>
            Oops! Có gì đó không ổn.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', maxWidth: '400px' }}>
            Không gian tập trung của bạn gặp chút sự cố kỹ thuật. Đừng lo, dữ liệu vẫn an toàn.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 24px', background: 'var(--primary)', color: 'white',
              border: 'none', borderRadius: 'var(--r-full)', fontWeight: '600', cursor: 'pointer'
            }}
          >
            Trở về Trang chủ
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
