import { useEffect, useRef, useState } from 'react';
import { initTeardown } from '../../scenes/teardown';
import { LAYERS } from '../../constants';

export function TeardownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);

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
        {/* 3D canvas fills right ~55% */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />

        {/* Text panel — left column with semi-transparent backdrop */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: 'clamp(280px, 35vw, 460px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '40px 40px 40px 6vw',
          background: 'linear-gradient(90deg, rgba(5,15,28,.92) 70%, transparent)',
          pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: '.22em', color: '#ffb24d', marginBottom: 12 }}>
            SECTION 03 · BEDAH TAG
          </div>
          <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: '.2em', color: 'rgba(255,178,77,.55)', marginBottom: 16 }}>
            {layer.tag}
          </div>

          <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(24px,3vw,38px)', fontWeight: 700, color: '#fff', letterSpacing: '-.03em', marginBottom: 6 }}>
            {layer.name}
          </div>
          <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, letterSpacing: '.18em', color: '#ffb24d', marginBottom: 18 }}>
            {layer.id}
          </div>

          <p style={{ fontSize: 'clamp(13px,1.1vw,15px)', lineHeight: 1.78, color: '#c8dcea', marginBottom: 22, maxWidth: '36ch' }}>
            {layer.desc}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, color: '#7fc4f0', letterSpacing: '.06em' }}>{layer.a}</div>
            <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, color: '#7fc4f0', letterSpacing: '.06em' }}>{layer.b}</div>
          </div>
        </div>

        {/* Layer dots — right side */}
        <div style={{
          position: 'absolute', right: '4vw', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
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

        {/* Layer name chip bottom center */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: '.22em',
          color: '#5d83a3', pointerEvents: 'none',
        }}>
          SCROLL TO EXPLORE LAYERS ↓
        </div>
      </div>
    </section>
  );
}
