import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { initWave } from '../../scenes/wave';
import { BAND_INFO, WAVE_CFG, STEPS_PASSIVE, STEPS_ACTIVE } from '../../constants';
import { BandTabs } from '../molecules/BandTabs';
import { ModeTabs } from '../molecules/ModeTabs';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { Band, WaveMode, WaveCfgRuntime } from '../../constants';

const GREEN = '#39d98a';

export function WaveSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cfgRef = useRef<WaveCfgRuntime>({ ...WAVE_CFG['UHF'], mode: 'passive' });
  const [band, setBandState] = useState<Band>('UHF');
  const [mode, setModeState] = useState<WaveMode>('passive');
  const [phaseLabel, setPhaseLabel] = useState('PASSIVE · Reader memancarkan sinyal ke sekitar');
  const isMobile = useIsMobile();
  const info = BAND_INFO[band];
  const steps = mode === 'passive' ? STEPS_PASSIVE : STEPS_ACTIVE;
  const isActive = mode === 'active';
  const accentColor = isActive ? GREEN : '#ffb24d';

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanups: Array<() => void> = [];
    initWave(canvasRef.current, cleanups, cfgRef.current, setPhaseLabel);
    return () => cleanups.forEach(fn => { try { fn(); } catch { /* */ } });
  }, []);

  const setBand = useCallback((b: Band) => {
    setBandState(b);
    gsap.to(cfgRef.current, { ...WAVE_CFG[b], duration: 1.0, ease: 'power2.inOut' });
  }, []);

  const setMode = useCallback((m: WaveMode) => {
    setModeState(m);
    cfgRef.current.mode = m;
    if (m === 'active') setPhaseLabel('ACTIVE · Sinyal dua arah terus-menerus');
    else setPhaseLabel('PASSIVE · Reader memancarkan sinyal ke sekitar');
  }, []);

  return (
    <section id="how" style={{ position: 'relative', padding: isMobile ? '60px 5vw 50px' : '90px 6vw 80px', zIndex: 5 }}>
      <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, letterSpacing: '.22em', color: '#ffb24d', marginBottom: 12 }}>SECTION 02 · CARA KERJA</div>
      <h2 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(22px,3.5vw,44px)', fontWeight: 700, color: '#fff', letterSpacing: '-.03em', marginBottom: isMobile ? 24 : 36 }}>Simulasi Gelombang</h2>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(340px,1fr))', gap: 28, alignItems: 'start' }}>

        {/* Canvas */}
        <div style={{ position: 'relative', height: isMobile ? 300 : 640 }}>
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'grab', borderRadius: 6 }}
          />

          {/* Phase label top */}
          <div style={{ position: 'absolute', top: 16, left: 16, right: 16, fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: '.2em', color: isActive ? GREEN : '#7fa9c9', pointerEvents: 'none', transition: 'color .4s' }}>
            {phaseLabel}
          </div>

          {/* Band label + SCROLL hint above ruler */}
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 58, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'none' }}>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 700, fontSize: 28, color: accentColor, letterSpacing: '-.02em', transition: 'color .4s' }}>
              {band}
            </div>
            <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 9, letterSpacing: '.14em', color: '#3d6480' }}>
              SCROLL TO ZOOM
            </div>
          </div>

          {/* Range ruler */}
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, pointerEvents: 'none' }}>
            <div style={{ position: 'relative', height: 32, margin: '0 2px' }}>
              {/* Dashed line */}
              <div style={{ position: 'absolute', top: 8, left: '8%', right: '8%', height: 1, borderTop: `1px dashed rgba(${isActive ? '57,217,138' : '125,196,240'},.3)`, transition: 'border-color .4s' }} />

              {/* READER tick — left */}
              <div style={{ position: 'absolute', left: '8%', top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 1, height: 14, background: accentColor, transition: 'background .4s' }} />
                <span style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 9, letterSpacing: '.1em', color: accentColor, whiteSpace: 'nowrap', transition: 'color .4s' }}>READER · 0</span>
              </div>

              {/* Mid tick */}
              <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 1, height: 8, background: isActive ? `${GREEN}80` : 'rgba(125,196,240,.4)', marginTop: 3, transition: 'background .4s' }} />
                <span style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 9, letterSpacing: '.1em', color: isActive ? `${GREEN}aa` : '#5d83a3', whiteSpace: 'nowrap', transition: 'color .4s' }}>
                  {isActive ? info.activeMid : info.rangeMid}
                </span>
              </div>

              {/* Max tick — right */}
              <div style={{ position: 'absolute', right: '8%', top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 1, height: 14, background: isActive ? GREEN : '#7fc4f0', transition: 'background .4s' }} />
                <span style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 9, letterSpacing: '.1em', color: isActive ? GREEN : '#7fc4f0', whiteSpace: 'nowrap', transition: 'color .4s' }}>
                  {isActive ? info.activeRange : info.rulerMax}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls + info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <BandTabs active={band} onChange={setBand} />
          <ModeTabs active={mode} onChange={setMode} />

          <div style={{ background: 'rgba(8,23,38,.6)', border: `1px solid ${isActive ? `${GREEN}30` : 'rgba(125,196,240,.15)'}`, borderRadius: 6, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color .4s' }}>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-.02em' }}>{info.freq}</div>
            <div style={{ fontSize: 12, letterSpacing: '.14em', color: '#7fa9c9' }}>{info.full.toUpperCase()}</div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: '#5d83a3', marginBottom: 4 }}>JANGKAUAN</div>
                <div style={{ fontSize: 17, color: accentColor, fontWeight: 600, transition: 'color .4s' }}>
                  {isActive ? info.activeRange : info.range}
                </div>
                <div style={{ fontSize: 10, color: isActive ? `${GREEN}80` : '#3d6480', marginTop: 2, letterSpacing: '.08em', transition: 'color .4s' }}>
                  {isActive ? 'AKTIF' : 'PASIF'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#5d83a3', marginBottom: 4 }}>PANJANG GELOMBANG</div>
                <div style={{ fontSize: 17, color: '#7fc4f0', fontWeight: 600 }}>{info.wl}</div>
              </div>
            </div>

            <div style={{ fontSize: 13, lineHeight: 1.65, color: '#cfe2f2', borderTop: '1px solid rgba(125,196,240,.12)', paddingTop: 14 }}>
              {info.need}
            </div>

            {/* Application box — green when active */}
            <div style={{ background: isActive ? `${GREEN}0d` : 'rgba(255,178,77,.06)', border: `1px solid ${isActive ? `${GREEN}30` : 'rgba(255,178,77,.14)'}`, borderRadius: 4, padding: '12px 14px', transition: 'all .4s' }}>
              <div style={{ fontSize: 10, letterSpacing: '.14em', color: accentColor, marginBottom: 6, transition: 'color .4s' }}>
                {isActive ? '⚡ APLIKASI · AKTIF (BATERAI)' : '📡 APLIKASI · PASIF'}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: '#cfe2f2' }}>
                {isActive ? info.useActive : info.use}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps grid */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: '.2em', color: accentColor, marginBottom: 16, transition: 'color .4s' }}>
          {isActive ? '⚡ ALUR KERJA RFID AKTIF' : '📡 ALUR KERJA RFID PASIF'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fit,minmax(200px,1fr))', gap: 1, background: isActive ? `${GREEN}22` : 'rgba(125,196,240,.14)', border: `1px solid ${isActive ? `${GREEN}33` : 'rgba(125,196,240,.14)'}`, borderRadius: 6, overflow: 'hidden', transition: 'all .4s' }}>
          {steps.map(s => (
            <div key={s.n} style={{ padding: '20px 22px', background: 'rgba(8,18,35,.82)' }}>
              <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontWeight: 700, fontSize: 26, color: accentColor, marginBottom: 10, transition: 'color .4s' }}>{s.n}</div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: '#9cbdd1' }}>{s.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
