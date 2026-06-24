import type { WaveMode } from '../../constants';

interface Props {
  active: WaveMode;
  onChange: (m: WaveMode) => void;
}

const GREEN = '#39d98a';

const MODES: { key: WaveMode; label: string }[] = [
  { key: 'passive', label: 'PASIF' },
  { key: 'active',  label: 'AKTIF' },
];

export function ModeTabs({ active, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {MODES.map(m => {
        const isActive = m.key === active;
        const isGreen = m.key === 'active' && isActive;
        return (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '.12em',
              padding: '9px 22px',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all .2s',
              border: `1px solid ${isGreen ? GREEN : isActive ? '#7fc4f0' : 'rgba(125,196,240,.22)'}`,
              background: isGreen ? `${GREEN}1a` : isActive ? 'rgba(127,196,240,.13)' : 'transparent',
              color: isGreen ? GREEN : isActive ? '#d4edfd' : '#6a9cbf',
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
