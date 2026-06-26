import { useEffect, useRef, useState, useCallback } from 'react';
import { X } from '@phosphor-icons/react';
import { startPlan } from '../../scenes/plans';
import { ReadLog } from '../molecules/ReadLog';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { LogEntry } from '../molecules/ReadLog';
import type { UseCase } from '../../constants';
import type { PlanHandle } from '../../scenes/plans';

interface Props {
  uc: UseCase;
  onClose: () => void;
}

let _logId = 0;

export function PlanModal({ uc, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<PlanHandle | null>(null);
  const [count, setCount] = useState(0);
  const [label, setLabel] = useState('TAG TERBACA');
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const isMobile = useIsMobile();

  const logEvent = useCallback((text: string, color = '#cfe2f2') => {
    setEntries(prev => [{ id: ++_logId, text, color }, ...prev].slice(0, 9));
  }, []);

  const incCount = useCallback(() => setCount(c => c + 1), []);
  const resetCount = useCallback(() => setCount(0), []);
  const clearLog = useCallback(() => setEntries([]), []);
  const setLabelCb = useCallback((t: string) => setLabel(t), []);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Slight delay so canvas is sized by the DOM
    const t = setTimeout(() => {
      if (!canvasRef.current) return;
      handleRef.current = startPlan(uc.plan, canvasRef.current, {
        logEvent, incCount, resetCount, clearLog,
        setLabel: setLabelCb, canvas: canvasRef.current,
      });
    }, 80);
    return () => {
      clearTimeout(t);
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [uc.plan, logEvent, incCount, resetCount, clearLog, setLabelCb]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 280,
      background: 'rgba(3,8,16,.94)', backdropFilter: 'blur(10px)',
      display: 'flex', flexDirection: 'column',
      animation: 'modalin .3s ease both',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, padding: isMobile ? '12px 16px' : '18px 24px', borderBottom: '1px solid rgba(125,196,240,.14)', flexShrink: 0 }}>
        <i className={`ph-fill ${uc.icon}`} style={{ fontSize: isMobile ? 22 : 30, color: '#ffb24d' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: isMobile ? 15 : 20, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{uc.planTitle}</div>
          <div style={{ fontSize: 10, letterSpacing: '.12em', color: '#7fa9c9', marginTop: 1 }}>{uc.band} · {uc.sub.toUpperCase()}</div>
        </div>
        <button
          onClick={onClose}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(125,196,240,.3)', color: '#bcd6ea', fontSize: isMobile ? 11 : 12, letterSpacing: '.1em', padding: isMobile ? '8px 12px' : '11px 16px', borderRadius: 3, cursor: 'pointer', flexShrink: 0 }}
        >
          TUTUP <X size={isMobile ? 12 : 14} weight="bold" />
        </button>
      </div>

      {/* Body — stacks vertically on mobile */}
      <div style={{
        flex: 1,
        display: isMobile ? 'flex' : 'grid',
        flexDirection: isMobile ? 'column' : undefined,
        gridTemplateColumns: isMobile ? undefined : '1fr minmax(260px,320px)',
        minHeight: 0,
        overflow: isMobile ? 'auto' : undefined,
      }}>
        {/* Canvas */}
        <div style={{ position: 'relative', overflow: 'hidden', height: isMobile ? '40vh' : undefined, flexShrink: isMobile ? 0 : undefined }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'grab' }} />
        </div>

        {/* Sidebar */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 20,
          padding: isMobile ? '16px 5vw 24px' : '22px 20px',
          borderLeft: isMobile ? 'none' : '1px solid rgba(125,196,240,.12)',
          borderTop: isMobile ? '1px solid rgba(125,196,240,.12)' : 'none',
          overflowY: isMobile ? undefined : 'auto',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: isMobile ? 15 : 17, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{uc.planTitle}</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#cfe2f2' }}>{uc.planDesc}</div>
          </div>

          {/* Read counter */}
          <div style={{ background: 'rgba(8,18,35,.7)', border: '1px solid rgba(125,196,240,.18)', borderRadius: 6, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, letterSpacing: '.16em', color: '#ffcf8f', marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: isMobile ? 28 : 34, fontWeight: 700, color: '#ffb24d', lineHeight: 1 }}>
              {count}
            </div>
          </div>

          {/* Event log */}
          <ReadLog entries={entries} />
        </div>
      </div>
    </div>
  );
}
