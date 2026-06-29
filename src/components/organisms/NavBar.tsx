import { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const NAV_LINKS: [string, string][] = [
  ['#relate', 'SEHARI-HARI'],
  ['#how', 'CARA KERJA'],
  ['#teardown', 'BEDAH'],
  ['#apps', 'APLIKASI'],
  ['#compare', 'PERBANDINGAN'],
];

export function NavBar() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(5,15,28,.72)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(125,196,240,.10)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '14px 5vw' : '18px 6vw',
        }}
      >
        <span
          style={{
            fontFamily: '"Space Grotesk",sans-serif',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: '.04em',
            color: '#fff',
          }}
        >
          <span style={{ color: '#ffb24d' }}>RFID</span>
        </span>
      </div>

      {isMobile && menuOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid rgba(125,196,240,.12)',
            background: 'rgba(5,15,28,.95)',
          }}
        >
          {NAV_LINKS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: '"IBM Plex Mono",monospace',
                fontSize: 13,
                letterSpacing: '.12em',
                color: href === '#compare' ? '#ffb24d' : '#7fa9c9',
                textDecoration: 'none',
                padding: '14px 5vw',
                borderBottom: '1px solid rgba(125,196,240,.08)',
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
