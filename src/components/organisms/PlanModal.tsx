import { useEffect, useRef, useState, useCallback } from 'react';
import { X } from '@phosphor-icons/react';
import { startPlan } from '../../scenes/plans';
import { ReadLog } from '../molecules/ReadLog';
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderBottom: '1px solid rgba(125,196,240,.14)' }}>
        <i className={`ph-fill ${uc.icon}`} style={{ fontSize: 30, color: '#ffb24d' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 20, fontWeight: 600, color: '#fff' }}>{uc.planTitle}</div>
          <div style={{ fontSize: 11, letterSpacing: '.14em', color: '#7fa9c9', marginTop: 2 }}>{uc.band} · {uc.sub.toUpperCase()}</div>
        </div>
        <button
          onClick={onClose}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid rgba(125,196,240,.3)', color: '#bcd6ea', fontSize: 12, letterSpacing: '.12em', padding: '11px 16px', borderRadius: 3, cursor: 'pointer' }}
        >
          TUTUP <X size={14} weight="bold" />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr minmax(260px,320px)', minHeight: 0 }}>
        {/* Canvas */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'grab' }} />
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '22px 20px', borderLeft: '1px solid rgba(125,196,240,.12)', overflowY: 'auto' }}>
          <div>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{uc.planTitle}</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#cfe2f2' }}>{uc.planDesc}</div>
          </div>

          {/* Read counter */}
          <div style={{ background: 'rgba(8,18,35,.7)', border: '1px solid rgba(125,196,240,.18)', borderRadius: 6, padding: '16px 18px' }}>
            <div style={{ fontSize: 10, letterSpacing: '.16em', color: '#ffcf8f', marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 34, fontWeight: 700, color: '#ffb24d', lineHeight: 1 }}>
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
