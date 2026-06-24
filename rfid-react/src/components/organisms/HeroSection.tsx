import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Cube } from '@phosphor-icons/react';
import { initHero } from '../../scenes/hero';
import { getLenis } from '../../hooks/useLenis';

function smoothTo(href: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector(href);
    const lenis = getLenis();
    if (target && lenis) lenis.scrollTo(target as HTMLElement, { duration: 1.4 });
    else if (target) target.scrollIntoView({ behavior: 'smooth' });
  };
}

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanups: Array<() => void> = [];
    initHero(canvasRef.current, cleanups);
    return () => cleanups.forEach(fn => { try { fn(); } catch { /* */ } });
  }, []);

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', zIndex: 5, overflow: 'hidden' }}>
      {/* Two-column layout */}
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, alignItems: 'center', minHeight: '100vh' }}>

        {/* Left: text */}
        <div style={{ padding: '120px 5vw 80px 6vw', zIndex: 4, position: 'relative' }}>
          <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, letterSpacing: '.3em', color: '#ffb24d', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 34, height: 1, background: '#ffb24d', display: 'inline-block' }} />
            RADIO-FREQUENCY IDENTIFICATION
          </div>

          <h1 style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 'clamp(36px,5.5vw,82px)', lineHeight: 0.88, letterSpacing: '-.03em', margin: 0, color: '#e8f3fb' }}>
            R<span style={{ color: '#ffb24d' }}>F</span>ID
          </h1>

          <p style={{ maxWidth: '42ch', fontSize: 'clamp(13px,1.2vw,16px)', lineHeight: 1.75, color: '#bcd6ea', margin: '22px 0 0' }}>
            Teknologi yang memakai <strong style={{ color: '#fff' }}>gelombang radio</strong> untuk mengenali objek dari jarak jauh — tanpa kontak, tanpa garis pandang. Sebuah <em style={{ color: '#ffb24d', fontStyle: 'normal' }}>tag</em> menyimpan identitas, sebuah <em style={{ color: '#ffb24d', fontStyle: 'normal' }}>reader</em> membacanya lewat udara dalam milidetik.
          </p>

          <div style={{ display: 'flex', gap: 20, marginTop: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#teardown" onClick={smoothTo('#teardown')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ffb24d', color: '#071423', fontWeight: 600, fontSize: 12, letterSpacing: '.1em', padding: '13px 22px', borderRadius: 2, textDecoration: 'none' }}>
              BEDAH KOMPONEN <ArrowDown size={13} weight="bold" />
            </a>
            <a href="#how" onClick={smoothTo('#how')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#bcd6ea', fontSize: 12, letterSpacing: '.1em', padding: '12px 4px', borderBottom: '1px solid rgba(125,196,240,.3)', textDecoration: 'none' }}>
              CARA KERJANYA <ArrowRight size={13} />
            </a>
          </div>

          <div style={{ marginTop: 36, fontSize: 10, letterSpacing: '.18em', color: '#5d83a3' }}>
            ☞ SERET MODEL UNTUK MEMUTAR →
          </div>

          {/* Bottom-left label */}
          <div style={{ position: 'absolute', left: '6vw', bottom: 20, fontSize: 10, letterSpacing: '.2em', color: '#4d7796' }}>
            FIG. 00 — PASSIVE INLAY · LIVE 3D
          </div>
        </div>

        {/* Right: canvas — no container box, just the canvas */}
        <div style={{ position: 'relative', height: '100vh' }}>
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'grab', zIndex: 1 }}
          />
          <div style={{ position: 'absolute', right: '5vw', bottom: 20, zIndex: 4, fontSize: 10, letterSpacing: '.18em', color: '#ffb24d', pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cube size={11} /> DRAG TO ROTATE
          </div>
        </div>
      </div>
    </section>
  );
}
