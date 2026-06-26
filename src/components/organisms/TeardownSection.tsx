import { useEffect, useRef, useState } from 'react';
import { initTeardown } from '../../scenes/teardown';
import { LAYERS } from '../../constants';
import { useIsMobile } from '../../hooks/useIsMobile';

export function TeardownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current) return;
    const cleanups: Array<() => void> = [];
    initTeardown(canvasRef.current, sectionRef.current, cleanups, setActive);
    return () => cleanups.forEach(fn => { try { fn(); } catch { /* */ } });
  }, []);

  const layer = LAYERS[active];

  return (
    <section
      id="teardown"
      ref={sectionRef}
      data-teardown=""
      style={{ position: 'relative', height: '380vh', zIndex: 5 }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* 3D canvas fills full screen */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />

        {/* Text panel — left column on desktop, bottom overlay on mobile */}
        <div style={{
          position: 'absolute',
          ...(isMobile
            ? { bottom: 0, left: 0, right: 0, top: 'auto', width: '100%', padding: '20px 5vw 32px', background: 'linear-gradient(0deg, rgba(5,15,28,.96) 80%, transparent)' }
            : { top: 0, left: 0, bottom: 0, width: 'clamp(280px, 35vw, 460px)', padding: '40px 40px 40px 6vw', background: 'linear-gradient(90deg, rgba(5,15,28,.92) 70%, transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }
          ),
          pointerEvents: 'none',
        }}>
          {!isMobile && (
            <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: '.22em', color: '#ffb24d', marginBottom: 12 }}>
              SECTION 03 · BEDAH TAG
            </div>
          )}
          <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: '.2em', color: 'rgba(255,178,77,.55)', marginBottom: isMobile ? 4 : 16 }}>
            {layer.tag}
          </div>

          <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: isMobile ? 22 : 'clamp(24px,3vw,38px)', fontWeight: 700, color: '#fff', letterSpacing: '-.03em', marginBottom: 4 }}>
            {layer.name}
          </div>
          <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, letterSpacing: '.18em', color: '#ffb24d', marginBottom: isMobile ? 8 : 18 }}>
            {layer.id}
          </div>

          <p style={{ fontSize: isMobile ? 13 : 'clamp(13px,1.1vw,15px)', lineHeight: 1.72, color: '#c8dcea', marginBottom: isMobile ? 10 : 22, maxWidth: isMobile ? '100%' : '36ch' }}>
            {layer.desc}
          </p>

          {!isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, color: '#7fc4f0', letterSpacing: '.06em' }}>{layer.a}</div>
              <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, color: '#7fc4f0', letterSpacing: '.06em' }}>{layer.b}</div>
            </div>
          )}

          {isMobile && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, color: '#7fc4f0', letterSpacing: '.06em' }}>{layer.a}</div>
              <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, color: '#7fc4f0', letterSpacing: '.06em' }}>{layer.b}</div>
            </div>
          )}
        </div>

        {/* Layer dots */}
        <div style={{
          position: 'absolute',
          ...(isMobile
            ? { left: '5vw', top: '50%', transform: 'translateY(-50%)', flexDirection: 'column' }
            : { right: '4vw', top: '50%', transform: 'translateY(-50%)', flexDirection: 'column' }
          ),
          display: 'flex', gap: 10, pointerEvents: 'none',
        }}>
          {LAYERS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === active ? 10 : 6,
                height: i === active ? 10 : 6,
                borderRadius: '50%',
                background: i === active ? '#ffb24d' : 'rgba(125,196,240,.35)',
                transition: 'all .3s',
              }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        {!isMobile && (
          <div style={{
            position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
            fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: '.22em',
            color: '#5d83a3', pointerEvents: 'none',
          }}>
            SCROLL TO EXPLORE LAYERS ↓
          </div>
        )}
      </div>
    </section>
  );
}
