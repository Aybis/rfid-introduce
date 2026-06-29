export function PageBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      backgroundColor: '#050f1c',
      backgroundImage: [
        'repeating-linear-gradient(rgba(125,196,240,.055) 0px,rgba(125,196,240,.055) 1px,transparent 1px,transparent 40px)',
        'repeating-linear-gradient(90deg,rgba(125,196,240,.055) 0px,rgba(125,196,240,.055) 1px,transparent 1px,transparent 40px)',
        'repeating-linear-gradient(rgba(125,196,240,.018) 0px,rgba(125,196,240,.018) 1px,transparent 1px,transparent 8px)',
        'repeating-linear-gradient(90deg,rgba(125,196,240,.018) 0px,rgba(125,196,240,.018) 1px,transparent 1px,transparent 8px)',
        'radial-gradient(120% 90% at 60% 20%,rgba(0,68,136,.16),transparent 55%)',
      ].join(','),
    }} />
  );
}
