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
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(5,15,28,.72)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(125,196,240,.10)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '14px 5vw' : '18px 6vw' }}>
        <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '.04em', color: '#fff' }}>
          <span style={{ color: '#ffb24d' }}>RFID</span> CINEMATIC
        </span>

        {isMobile ? (
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: '1px solid rgba(125,196,240,.25)', borderRadius: 3, padding: '7px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}
            aria-label="Menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: 18, height: 1.5, background: menuOpen ? '#ffb24d' : '#7fa9c9', transition: 'background .2s' }} />
            ))}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 28 }}>
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 12, letterSpacing: '.12em', color: href === '#compare' ? '#ffb24d' : '#4d7796', textDecoration: 'none' }}>
                {label}
              </a>
            ))}
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(125,196,240,.12)', background: 'rgba(5,15,28,.95)' }}>
          {NAV_LINKS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 13, letterSpacing: '.12em', color: href === '#compare' ? '#ffb24d' : '#7fa9c9', textDecoration: 'none', padding: '14px 5vw', borderBottom: '1px solid rgba(125,196,240,.08)' }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
