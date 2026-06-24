export function Footer() {
  const cols = [
    { label: 'TITLE',    value: 'RFID — Cinematic Edition',         color: '#e8f3fb' },
    { label: 'SECTIONS', value: 'CTA · Bands · Teardown · Apps',    color: '#e8f3fb' },
    { label: 'RENDER',   value: 'WebGL · Real-time 3D',             color: '#e8f3fb' },
    { label: 'REV',      value: '2.0 — 2026',                       color: '#ffb24d' },
  ];

  return (
    <footer style={{ position: 'relative', margin: '40px 6vw 0', borderTop: '1px solid rgba(125,196,240,.18)', zIndex: 5 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))' }}>
        {cols.map((c, i) => (
          <div
            key={c.label}
            style={{
              padding: '22px',
              borderRight: i < cols.length - 1 ? '1px solid rgba(125,196,240,.14)' : 'none',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: '.16em', color: '#4d7796', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 13, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '28px', fontSize: 11, letterSpacing: '.16em', color: '#2f526e' }}>
        END OF SHEET · RADIO-FREQUENCY IDENTIFICATION
      </div>
    </footer>
  );
}
