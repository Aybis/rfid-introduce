interface Props { pct: number }

export function ScrollProgressBar({ pct }: Props) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 400, background: 'rgba(0,0,0,.3)' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: '#ffb24d', boxShadow: '0 0 12px rgba(255,178,77,.7)', transition: 'width .1s linear' }} />
    </div>
  );
}
