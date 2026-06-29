import { useState, useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import { PageBackground } from './components/atoms/PageBackground';
import { ScrollProgressBar } from './components/molecules/ScrollProgressBar';
import { NavBar } from './components/organisms/NavBar';
import { SplashScreen } from './components/organisms/SplashScreen';
import { HeroSection } from './components/organisms/HeroSection';
import { HookSection } from './components/organisms/HookSection';
import { RelateSection } from './components/organisms/RelateSection';
import { WaveSection } from './components/organisms/WaveSection';
import { TeardownSection } from './components/organisms/TeardownSection';
import { AppsSection } from './components/organisms/AppsSection';
import { CompareSection } from './components/organisms/CompareSection';
import { Footer } from './components/organisms/Footer';
import { PlanModal } from './components/organisms/PlanModal';
import type { UseCase } from './constants';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [activeUC, setActiveUC] = useState<UseCase | null>(null);
  const [scrollPct, setScrollPct] = useState(0);
  useLenis();

  useEffect(() => {
    const onScroll = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setScrollPct((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleEnter = () => {
    const el = document.getElementById('splash');
    if (el) {
      el.style.opacity = '0';
      el.style.transition = 'opacity .6s';
    }
    setTimeout(() => setSplashDone(true), 620);
  };

  return (
    <>
      <ScrollProgressBar pct={scrollPct} />
      <NavBar />
      <PageBackground />

      <div style={{ position: 'relative', zIndex: 5 }}>
        <HeroSection />
        <RelateSection />
        <WaveSection />
        <TeardownSection />
        <AppsSection onSelect={setActiveUC} />
        <CompareSection />
        <Footer />
      </div>

      {!splashDone && <SplashScreen onEnter={handleEnter} />}
      {activeUC && (
        <PlanModal uc={activeUC} onClose={() => setActiveUC(null)} />
      )}
    </>
  );
}
