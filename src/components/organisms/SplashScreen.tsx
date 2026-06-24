import { Broadcast, ArrowRight } from '@phosphor-icons/react';

interface Props {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: Props) {
  return (
    <div
      id="splash"
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: '#050f1c',
        backgroundImage: 'radial-gradient(120% 90% at 50% 30%,rgba(255,178,77,.10),transparent 55%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 22, textAlign: 'center', padding: 24,
      }}
    >
      <Broadcast weight="fill" size={60} color="#ffb24d" style={{ animation: 'splashmark 1s ease both' }} />
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(26px,5vw,46px)', fontWeight: 700, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.1 }}>
        Bagaimana RFID<br />bekerja?
      </div>
      <p style={{ fontSize: 15, color: '#7fa9c9', maxWidth: 340, lineHeight: 1.65 }}>
        Pelajari teknologi di balik tap kartu, palang tol, dan lacak ribuan barang — semuanya tanpa kontak.
      </p>
      <button
        id="enterBtn"
        onClick={onEnter}
        style={{
          marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#ffb24d', color: '#071423', fontWeight: 600,
          fontSize: 13, letterSpacing: '.12em', padding: '15px 28px',
          border: 'none', borderRadius: 2, cursor: 'pointer',
        }}
      >
        MASUK <ArrowRight size={16} weight="bold" />
      </button>
    </div>
  );
}
