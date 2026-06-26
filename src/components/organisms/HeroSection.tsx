import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Cube } from '@phosphor-icons/react';
import { initHero } from '../../scenes/hero';
import { getLenis } from '../../hooks/useLenis';
import { useIsMobile } from '../../hooks/useIsMobile';

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
  const isMobile = useIsMobile();

  // Canvas init runs once — same canvas element is always in the DOM
  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanups: Array<() => void> = [];
    initHero(canvasRef.current, cleanups);
    return () => cleanups.forEach(fn => { try { fn(); } catch { /* */ } });
  }, []);

  return (
    <section style={{
      position: 'relative', zIndex: 5, overflow: 'hidden',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      minHeight: '100vh',
    }}>

      {/* Text panel */}
      <div style={{
        position: 'relative', zIndex: 4,
        flex: isMobile ? '0 0 auto' : '0 0 50%',
        display: 'flex', flexDirection: 'column', justifyContent: isMobile ? 'flex-start' : 'center',
        padding: isMobile ? '90px 5vw 24px' : '120px 5vw 80px 6vw',
      }}>
        <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: isMobile ? 10 : 11, letterSpacing: '.26em', color: '#ffb24d', marginBottom: isMobile ? 16 : 22, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: isMobile ? 24 : 34, height: 1, background: '#ffb24d', display: 'inline-block' }} />
          {isMobile ? 'RADIO-FREQUENCY ID' : 'RADIO-FREQUENCY IDENTIFICATION'}
        </div>

        <h1 style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: isMobile ? 'clamp(52px,18vw,80px)' : 'clamp(36px,5.5vw,82px)', lineHeight: 0.88, letterSpacing: '-.03em', margin: 0, color: '#e8f3fb' }}>
          R<span style={{ color: '#ffb24d' }}>F</span>ID
        </h1>

        <p style={{ fontSize: isMobile ? 14 : 'clamp(13px,1.2vw,16px)', lineHeight: 1.75, color: '#bcd6ea', margin: isMobile ? '18px 0 0' : '22px 0 0', maxWidth: isMobile ? '36ch' : '42ch' }}>
          Teknologi {isMobile ? '' : 'yang memakai '}
          <strong style={{ color: '#fff' }}>gelombang radio</strong> untuk mengenali objek dari jarak jauh — tanpa kontak{isMobile ? '.' : ', tanpa garis pandang.'} Sebuah <em style={{ color: '#ffb24d', fontStyle: 'normal' }}>tag</em> menyimpan identitas, sebuah <em style={{ color: '#ffb24d', fontStyle: 'normal' }}>reader</em> membacanya {isMobile ? 'dalam' : 'lewat udara dalam'} milidetik.
        </p>

        <div style={{ display: 'flex', gap: isMobile ? 14 : 20, marginTop: isMobile ? 26 : 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="#teardown" onClick={smoothTo('#teardown')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ffb24d', color: '#071423', fontWeight: 600, fontSize: 12, letterSpacing: '.1em', padding: isMobile ? '12px 20px' : '13px 22px', borderRadius: 2, textDecoration: 'none' }}>
            {isMobile ? 'BEDAH' : 'BEDAH KOMPONEN'} <ArrowDown size={12} weight="bold" />
          </a>
          <a href="#how" onClick={smoothTo('#how')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#bcd6ea', fontSize: 12, letterSpacing: '.1em', padding: '12px 4px', borderBottom: '1px solid rgba(125,196,240,.3)', textDecoration: 'none' }}>
            CARA KERJA{isMobile ? '' : 'NYA'} <ArrowRight size={12} />
          </a>
        </div>

        <div style={{ marginTop: isMobile ? 18 : 36, fontSize: isMobile ? 9 : 10, letterSpacing: '.18em', color: '#5d83a3' }}>
          ☞ SERET MODEL UNTUK MEMUTAR {isMobile ? '' : '→'}
        </div>

        {!isMobile && (
          <div style={{ position: 'absolute', left: '6vw', bottom: 20, fontSize: 10, letterSpacing: '.2em', color: '#4d7796' }}>
            FIG. 00 — PASSIVE INLAY · LIVE 3D
          </div>
        )}
      </div>

      {/* Canvas panel — always same element, never unmounted */}
      <div style={{
        position: 'relative',
        flex: isMobile ? '1 0 320px' : '0 0 50%',
        minHeight: isMobile ? 320 : '100vh',
        order: isMobile ? -1 : 0,  /* canvas first on mobile */
      }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'grab', zIndex: 1 }}
        />
        <div style={{ position: 'absolute', right: '5vw', bottom: isMobile ? 14 : 20, zIndex: 4, fontSize: isMobile ? 9 : 10, letterSpacing: '.16em', color: '#ffb24d', pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Cube size={isMobile ? 10 : 11} /> DRAG TO ROTATE
        </div>
        {isMobile && (
          <div style={{ position: 'absolute', left: '5vw', bottom: 14, fontSize: 9, letterSpacing: '.18em', color: '#4d7796', pointerEvents: 'none' }}>
            FIG. 00 — PASSIVE INLAY · LIVE 3D
          </div>
        )}
      </div>
    </section>
  );
}
