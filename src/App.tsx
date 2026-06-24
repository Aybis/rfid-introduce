import { useState, useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import { SplashScreen } from './components/organisms/SplashScreen';
import { HeroSection } from './components/organisms/HeroSection';
import { WaveSection } from './components/organisms/WaveSection';
import { TeardownSection } from './components/organisms/TeardownSection';
import { AppsSection } from './components/organisms/AppsSection';
import { Footer } from './components/organisms/Footer';
import { PlanModal } from './components/organisms/PlanModal';
import type { UseCase } from './constants';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [activeUC, setActiveUC] = useState<UseCase | null>(null);
  const [scrollPct, setScrollPct] = useState(0);
  useLenis();

  // Progress bar
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight || 1;
      setScrollPct((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleEnter = () => {
    const el = document.getElementById('splash');
    if (el) { el.style.opacity = '0'; el.style.transition = 'opacity .6s'; }
    setTimeout(() => setSplashDone(true), 620);
  };

  return (
    <>
      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 400, background: 'rgba(0,0,0,.3)' }}>
        <div style={{ height: '100%', width: `${scrollPct}%`, background: '#ffb24d', boxShadow: '0 0 12px rgba(255,178,77,.7)', transition: 'width .1s linear' }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 6vw', background: 'rgba(5,15,28,.72)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(125,196,240,.10)' }}>
        <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '.04em', color: '#fff' }}>
          <span style={{ color: '#ffb24d' }}>RFID</span> CINEMATIC
        </span>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['#how', 'CARA KERJA'], ['#teardown', 'BEDAH'], ['#apps', 'APLIKASI']].map(([href, label]) => (
            <a key={href} href={href} style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 12, letterSpacing: '.12em', color: href === '#apps' ? '#ffb24d' : '#4d7796', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
      </nav>

      {/* Background — cutting mat grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundColor: '#050f1c',
        backgroundImage: [
          'repeating-linear-gradient(rgba(125,196,240,.055) 0px, rgba(125,196,240,.055) 1px, transparent 1px, transparent 40px)',
          'repeating-linear-gradient(90deg, rgba(125,196,240,.055) 0px, rgba(125,196,240,.055) 1px, transparent 1px, transparent 40px)',
          'repeating-linear-gradient(rgba(125,196,240,.018) 0px, rgba(125,196,240,.018) 1px, transparent 1px, transparent 8px)',
          'repeating-linear-gradient(90deg, rgba(125,196,240,.018) 0px, rgba(125,196,240,.018) 1px, transparent 1px, transparent 8px)',
          'radial-gradient(120% 90% at 60% 20%, rgba(0,68,136,.16), transparent 55%)',
        ].join(','),
      }} />

      {/* Sections */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <HeroSection />
        <WaveSection />
        <TeardownSection />
        <AppsSection onSelect={setActiveUC} />
        <Footer />
      </div>

      {/* Overlays */}
      {!splashDone && <SplashScreen onEnter={handleEnter} />}
      {activeUC && <PlanModal uc={activeUC} onClose={() => setActiveUC(null)} />}
    </>
  );
}
