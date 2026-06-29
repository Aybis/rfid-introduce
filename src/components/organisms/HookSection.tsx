import { useIsMobile } from '../../hooks/useIsMobile';
import { RevealBox } from '../atoms/RevealBox';

const EVENTS = [
  { time: '06.45', icon: 'ph-train',              activity: 'Tap Kartu Commuter', where: 'Stasiun Depok Baru',   color: '#ffb24d' },
  { time: '07.12', icon: 'ph-car',                activity: 'Gerbang Tol Otomatis', where: 'Tol TB Simatupang', color: '#7fc4f0' },
  { time: '07.48', icon: 'ph-identification-card', activity: 'Absensi Sekolah',    where: 'Depan Ruang Piket',   color: '#39d98a' },
  { time: '08.05', icon: 'ph-door',               activity: 'Buka Pintu Lab',      where: 'Lab TKJ Lantai 2',    color: '#b48aff' },
  { time: '09.30', icon: 'ph-currency-circle-dollar', activity: 'Bayar di Kantin', where: 'Pakai e-money',       color: '#ffb24d' },
];

export function HookSection() {
  const isMobile = useIsMobile();

  return (
    <section style={{ position: 'relative', padding: isMobile ? '60px 5vw 70px' : '80px 6vw 90px', zIndex: 5 }}>

      {/* Header */}
      <RevealBox>
        <div style={{ marginBottom: isMobile ? 36 : 52 }}>
          <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, letterSpacing: '.22em', color: '#ffb24d', marginBottom: 14 }}>
            BAYANGKAN HARI INI
          </div>
          <h2 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(22px,3.2vw,42px)', fontWeight: 700, color: '#fff', letterSpacing: '-.03em', margin: '0 0 12px', lineHeight: 1.12 }}>
            Sebelum jam 10 pagi,<br />
            <span style={{ color: '#ffb24d' }}>kamu sudah pakai RFID 5 kali.</span>
          </h2>
          <p style={{ fontSize: 14, color: '#7fa9c9', maxWidth: 420, lineHeight: 1.7, margin: 0 }}>
            Tanpa kamu sadari. Ini yang sebenarnya terjadi —
          </p>
        </div>
      </RevealBox>

      {/* ── Event Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5,1fr)', gap: 12, marginBottom: isMobile ? 36 : 48 }}>
        {EVENTS.map((ev, i) => (
          <RevealBox key={ev.time} delay={i * 90}>
            <div style={{
              position: 'relative',
              background: `${ev.color}0c`,
              border: `1px solid ${ev.color}35`,
              borderRadius: 12,
              padding: isMobile ? '16px 18px' : '22px 16px',
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? 14 : 16,
              overflow: 'hidden',
            }}>
              {/* Pulse ring — decorative */}
              {!isMobile && (
                <div style={{
                  position: 'absolute', top: 28, right: 18,
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: ev.color,
                  animation: 'hookdot 2.4s ease-in-out infinite',
                  animationDelay: `${i * 0.4}s`,
                }}>
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    width: 30, height: 30,
                    borderRadius: '50%',
                    border: `1px solid ${ev.color}`,
                    animation: 'hookpulse 2.4s ease-out infinite',
                    animationDelay: `${i * 0.4}s`,
                    pointerEvents: 'none',
                  }} />
                </div>
              )}

              {/* Icon */}
              <div style={{
                width: isMobile ? 44 : 48, height: isMobile ? 44 : 48,
                borderRadius: 10,
                background: `${ev.color}18`,
                border: `1px solid ${ev.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className={`ph-fill ${ev.icon}`} style={{ fontSize: isMobile ? 22 : 24, color: ev.color }} />
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                {/* Time badge */}
                <div style={{
                  fontFamily: '"IBM Plex Mono",monospace', fontSize: 10,
                  letterSpacing: '.12em', color: ev.color,
                  marginBottom: 6,
                }}>
                  {ev.time}
                </div>
                <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 600, fontSize: isMobile ? 14 : 13, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>
                  {ev.activity}
                </div>
                <div style={{ fontSize: 11, color: '#5d83a3', letterSpacing: '.04em', lineHeight: 1.4 }}>
                  {ev.where}
                </div>
              </div>

              {/* RFID chip badge bottom */}
              <div style={{
                ...(isMobile ? {} : { marginTop: 'auto', paddingTop: 12 }),
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: `${ev.color}12`,
                border: `1px solid ${ev.color}30`,
                borderRadius: 3, padding: '3px 8px',
                flexShrink: 0,
              }}>
                <i className="ph-fill ph-broadcast" style={{ fontSize: 10, color: ev.color }} />
                <span style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 8, letterSpacing: '.14em', color: ev.color }}>RFID</span>
              </div>
            </div>
          </RevealBox>
        ))}
      </div>

      {/* ── Punchline row ── */}
      <RevealBox delay={550}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 20 : 0,
          background: 'rgba(8,18,35,.7)',
          border: '1px solid rgba(255,178,77,.2)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          {/* Left: big number */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '28px 24px 4px' : '40px 52px',
            borderRight: isMobile ? 'none' : '1px solid rgba(255,178,77,.15)',
            borderBottom: isMobile ? '1px solid rgba(255,178,77,.15)' : 'none',
            background: 'rgba(255,178,77,.05)',
            position: 'relative', overflow: 'hidden',
            minWidth: isMobile ? undefined : 220,
          }}>
            {/* Glow blob */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 160, height: 160,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,178,77,.18) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              fontFamily: '"Space Grotesk",sans-serif',
              fontSize: isMobile ? 72 : 96,
              fontWeight: 700,
              color: '#ffb24d',
              lineHeight: 1,
              letterSpacing: '-.06em',
              textShadow: '0 0 40px rgba(255,178,77,.4)',
              animation: 'countup .6s ease both',
              animationDelay: '.7s',
            }}>
              5×
            </div>
            <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: '.2em', color: 'rgba(255,178,77,.6)', marginTop: 8 }}>
              RFID EVENTS
            </div>
          </div>

          {/* Right: explanation */}
          <div style={{ padding: isMobile ? '20px 24px 28px' : '36px 40px', display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>
              Sebelum jam 10 pagi.<br />
              <span style={{ color: '#ffb24d' }}>Tanpa kamu sadar.</span>
            </div>
            <div style={{ width: 36, height: 2, background: '#ffb24d', borderRadius: 99 }} />
            <div style={{ fontSize: 14, color: '#bcd6ea', lineHeight: 1.75, maxWidth: 480 }}>
              Semua itu terjadi karena satu teknologi — <strong style={{ color: '#fff' }}>RFID</strong>. Gelombang radio yang membaca data dari jarak jauh, tanpa sentuh, tanpa garis pandang, dalam milidetik.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '.12em', color: '#ffb24d' }}>
              <i className="ph-fill ph-arrow-circle-down" style={{ fontSize: 18 }} />
              SCROLL UNTUK PELAJARI CARANYA
            </div>
          </div>
        </div>
      </RevealBox>
    </section>
  );
}
