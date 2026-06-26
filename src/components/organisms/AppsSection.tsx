import { USE_CASES, BAND_INFO } from '../../constants';
import type { UseCase } from '../../constants';
import { RevealBox } from '../atoms/RevealBox';

interface Props {
  onSelect: (uc: UseCase) => void;
}

const BAND_COLOR: Record<string, string> = {
  LF: '#7fc4f0',
  HF: '#39d98a',
  UHF: '#ffb24d',
};

export function AppsSection({ onSelect }: Props) {
  return (
    <section
      id="apps"
      style={{
        position: 'relative', padding: 'clamp(60px,10vw,100px) clamp(5vw,6vw,6vw) 70px',
        maxWidth: 1320, margin: '0 auto', zIndex: 5,
      }}
    >
      <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, letterSpacing: '.22em', color: '#ffb24d', marginBottom: 14 }}>
        SECTION 04 · APLIKASI
      </div>
      <h2 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(26px,4vw,46px)', fontWeight: 700, color: '#fff', letterSpacing: '-.03em', marginBottom: 10 }}>
        Di Mana RFID Digunakan?
      </h2>
      <p style={{ fontSize: 14, color: '#7fa9c9', marginBottom: 40, maxWidth: 540, lineHeight: 1.65 }}>
        Klik kartu untuk melihat simulasi 3D interaktif di setiap industri.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(280px,100%),1fr))', gap: 16, alignItems: 'stretch' }}>
        {USE_CASES.map((uc, i) => {
          const bandCol = BAND_COLOR[uc.band] ?? '#ffb24d';
          const info = BAND_INFO[uc.band];
          return (
            <RevealBox key={uc.plan} delay={i * 60} style={{ height: '100%' }}>
              <button
                onClick={() => onSelect(uc)}
                style={{
                  width: '100%', height: '100%', textAlign: 'left', cursor: 'pointer',
                  background: 'rgba(12,28,50,.6)', border: '1px solid rgba(125,196,240,.18)',
                  borderRadius: 8, padding: '24px 22px',
                  transition: 'border-color .2s, transform .2s',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = bandCol;
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(125,196,240,.18)';
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <i className={`ph-fill ${uc.icon}`} style={{ fontSize: 28, color: bandCol }} />
                  <span style={{
                    fontFamily: '"IBM Plex Mono",monospace', fontSize: 10,
                    letterSpacing: '.14em', color: bandCol,
                    background: `${bandCol}18`, border: `1px solid ${bandCol}44`,
                    borderRadius: 2, padding: '3px 8px',
                  }}>
                    {uc.band} · {info.freq}
                  </span>
                </div>
                <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 600, fontSize: 17, color: '#fff' }}>
                  {uc.title}
                </div>
                <div style={{ fontSize: 11, letterSpacing: '.12em', color: bandCol }}>
                  {uc.sub}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: '#7fa9c9', marginTop: 4 }}>
                  {uc.desc}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, letterSpacing: '.12em', color: '#4d7796', display: 'flex', alignItems: 'center', gap: 6 }}>
                  LIHAT SIMULASI <i className="ph ph-arrow-right" style={{ fontSize: 12 }} />
                </div>
              </button>
            </RevealBox>
          );
        })}
      </div>
    </section>
  );
}
