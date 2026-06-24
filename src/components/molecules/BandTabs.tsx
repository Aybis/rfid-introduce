import type { Band } from '../../constants';

interface Props {
  active: Band;
  onChange: (b: Band) => void;
}

const BANDS: { key: Band; label: string; sub: string }[] = [
  { key: 'LF',  label: 'LF',  sub: 'Low Frequency' },
  { key: 'HF',  label: 'HF',  sub: 'High Frequency' },
  { key: 'UHF', label: 'UHF', sub: 'Ultra High Freq.' },
];

export function BandTabs({ active, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 0, border: '1px solid rgba(125,196,240,.18)', borderRadius: 4, overflow: 'hidden' }}>
      {BANDS.map(({ key, label, sub }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '12px 6px 10px',
              cursor: 'pointer',
              border: 'none',
              borderRight: key !== 'UHF' ? '1px solid rgba(125,196,240,.18)' : 'none',
              background: isActive ? '#ffb24d' : 'transparent',
              transition: 'background .2s',
            }}
          >
            <span style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '.12em',
              color: isActive ? '#071423' : '#9cc2dd',
              lineHeight: 1,
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 9,
              letterSpacing: '.06em',
              color: isActive ? 'rgba(7,20,35,.65)' : '#4d7796',
              lineHeight: 1,
            }}>
              {sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
