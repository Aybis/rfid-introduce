import { useEffect, useRef } from 'react';

export interface LogEntry {
  id: number;
  text: string;
  color: string;
}

interface Props {
  entries: LogEntry[];
}

export function ReadLog({ entries }: Props) {
  const topRef = useRef<HTMLDivElement>(null);

  // Scroll newest entry into view
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [entries.length]);

  return (
    <div
      id="readLog"
      style={{
        display: 'flex', flexDirection: 'column-reverse', gap: 4,
        maxHeight: 220, overflowY: 'hidden',
      }}
    >
      <div ref={topRef} />
      {entries.map(e => (
        <div
          key={e.id}
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 11,
            letterSpacing: '.04em',
            color: e.color || '#cfe2f2',
            background: 'rgba(8,24,42,.72)',
            border: `1px solid rgba(125,196,240,.18)`,
            borderLeft: `2px solid ${e.color || '#ffb24d'}`,
            borderRadius: 3,
            padding: '6px 10px',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            animation: 'fadeSlideIn .3s ease forwards',
          }}
        >
          {e.text}
        </div>
      ))}
    </div>
  );
}
