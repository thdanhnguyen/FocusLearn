export default function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', width: '100%', fontFamily: "'Be Vietnam Pro', sans-serif"
    }} className="fade-in">
      {/* Simple animated spinner */}
      <div style={{
        width: '40px', height: '40px',
        border: '4px solid var(--surface-highest)',
        borderTop: '4px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px'
      }} />
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '1.5px' }}>
        ĐANG TẢI...
      </div>
    </div>
  );
}
