export function Footer() {
  const cols = [
    {
      label: 'TITLE',
      value: 'RFID — Sama-Sama Baca Data, Beda Cara Kerjanya',
      color: '#e8f3fb',
    },
    {
      label: 'SECTIONS',
      value: 'CTA · Bands · Teardown · Apps',
      color: '#e8f3fb',
    },
    { label: 'CREATOR', value: 'Muchtar', color: '#e8f3fb' },
    { label: 'VERSION', value: '1.0 — 2026', color: '#ffb24d' },
  ];

  return (
    <footer
      style={{
        position: 'relative',
        margin: '40px 5vw 0',
        borderTop: '1px solid rgba(125,196,240,.18)',
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
        }}
      >
        {cols.map((c, i) => (
          <div
            key={c.label}
            style={{
              padding: '18px 16px',
              borderRight:
                i < cols.length - 1
                  ? '1px solid rgba(125,196,240,.14)'
                  : 'none',
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: '.16em',
                color: '#4d7796',
                marginBottom: 6,
              }}
            >
              {c.label}
            </div>
            <div
              style={{ fontSize: 12, color: c.color, wordBreak: 'break-word' }}
            >
              {c.value}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          textAlign: 'center',
          padding: '24px 16px',
          fontSize: 10,
          letterSpacing: '.14em',
          color: '#2f526e',
        }}
      >
        END OF SHEET · RADIO-FREQUENCY IDENTIFICATION
      </div>
    </footer>
  );
}
