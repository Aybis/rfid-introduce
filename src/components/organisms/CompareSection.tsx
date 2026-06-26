import { useIsMobile } from '../../hooks/useIsMobile';

/* ── Data ── */
const TECHS = [
  {
    name: 'RFID',
    color: '#ffb24d',
    icon: 'ph-broadcast',
    tagline: 'Tanpa lihat, tetap terbaca',
    best: 'Jarak jauh & volume besar',
  },
  {
    name: 'Barcode',
    color: '#7fc4f0',
    icon: 'ph-barcode',
    tagline: 'Harus scan satu-satu',
    best: 'Harga murah, sudah universal',
  },
  {
    name: 'QR Code',
    color: '#39d98a',
    icon: 'ph-qr-code',
    tagline: 'Kamera HP sudah cukup',
    best: 'Bayar & tiket digital',
  },
  {
    name: 'NFC',
    color: '#b48aff',
    icon: 'ph-contactless-payment',
    tagline: 'Tap dekat, data dua arah',
    best: 'Pembayaran & akses secure',
  },
];

/* Jarak baca: nilai max untuk bar proporsi */
const RANGE_DATA = [
  { label: '12 m', pct: 100, note: 'UHF', color: '#ffb24d', good: true },
  { label: '60 cm', pct: 5, note: '', color: '#ff6b6b', good: false },
  { label: '60 cm', pct: 5, note: '', color: '#ff6b6b', good: false },
  { label: '10 cm', pct: 1, note: '', color: '#ff6b6b', good: false },
];

/* Booleans */
type BoolRow = { val: boolean | 'partial'; note?: string }[];

const VISUAL_DATA: { label: string; sub: string; vals: BoolRow }[] = [
  {
    label: 'Butuh kamera / kontak visual?',
    sub: 'Harus terlihat oleh scanner',
    vals: [{ val: false }, { val: true }, { val: true }, { val: false }],
  },
  {
    label: 'Bisa baca banyak sekaligus?',
    sub: 'Multi-tag dalam satu scan',
    vals: [
      { val: true, note: '1.000+/detik' },
      { val: false },
      { val: false },
      { val: false },
    ],
  },
  {
    label: 'Bisa ditulis ulang?',
    sub: 'Data bisa diperbarui',
    vals: [
      { val: 'partial', note: 'Sebagian besar' },
      { val: false },
      { val: false },
      { val: true },
    ],
  },
  {
    label: 'Tahan kotor, basah, tertutup?',
    sub: 'Kondisi lapangan ekstrem',
    vals: [
      { val: true },
      { val: false },
      { val: false },
      { val: 'partial', note: 'Terbatas' },
    ],
  },
];

const PRICE_DATA = [
  { label: 'Rp 1–5 rb', coins: 2, color: '#ffb24d' },
  { label: 'Rp 200–500', coins: 1, color: '#7fc4f0' },
  { label: 'GRATIS', coins: 0, color: '#39d98a' },
  { label: 'Rp 3–15 rb', coins: 3, color: '#b48aff' },
];

const EXAMPLE_DATA = [
  'E-toll, absensi sekolah, gudang',
  'Label produk, perpustakaan',
  'QRIS, tiket event, menu restoran',
  'Tap to Pay, e-KTP, kartu hotel',
];

/* ── Sub-components ── */
function BoolIcon({ val, note }: { val: boolean | 'partial'; note?: string }) {
  const color =
    val === true ? '#39d98a' : val === 'partial' ? '#ffb24d' : '#ff5e5e';
  const icon =
    val === true
      ? 'ph-check-circle'
      : val === 'partial'
        ? 'ph-minus-circle'
        : 'ph-x-circle';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <i className={`ph-fill ${icon}`} style={{ fontSize: 28, color }} />
      {note && (
        <span
          style={{
            fontSize: 10,
            letterSpacing: '.06em',
            color,
            textAlign: 'center',
          }}
        >
          {note}
        </span>
      )}
    </div>
  );
}

function RangeBar({
  pct,
  label,
  note,
  color,
}: {
  pct: number;
  label: string;
  note: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <div
        style={{
          fontFamily: '"Space Grotesk",sans-serif',
          fontWeight: 700,
          fontSize: 15,
          color,
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: '100%',
          height: 6,
          background: 'rgba(125,196,240,.12)',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.max(pct, 4)}%`,
            height: '100%',
            background: color,
            borderRadius: 99,
            transition: 'width .6s ease',
          }}
        />
      </div>
      {note && (
        <span
          style={{ fontSize: 10, color: '#5d83a3', letterSpacing: '.06em' }}
        >
          {note}
        </span>
      )}
    </div>
  );
}

function CoinPrice({
  coins,
  label,
  color,
}: {
  coins: number;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', gap: 3 }}>
        {coins === 0 ? (
          <i className="ph-fill ph-gift" style={{ fontSize: 22, color }} />
        ) : (
          Array.from({ length: coins }).map((_, i) => (
            <i
              key={i}
              className="ph-fill ph-coin"
              style={{ fontSize: 20, color, opacity: 1 - i * 0.15 }}
            />
          ))
        )}
      </div>
      <span
        style={{
          fontFamily: '"IBM Plex Mono",monospace',
          fontSize: 10,
          color,
          letterSpacing: '.06em',
          textAlign: 'center',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Main component ── */
export function CompareSection() {
  const isMobile = useIsMobile();

  /* Shared attribute section */
  const AttributeSection = ({
    label,
    sub,
    children,
  }: {
    label: string;
    sub: string;
    children: React.ReactNode;
  }) => (
    <div style={{ marginBottom: 2 }}>
      <div
        style={{
          padding: '12px 0 10px',
          borderBottom: '1px solid rgba(125,196,240,.1)',
        }}
      >
        <div
          style={{
            fontFamily: '"IBM Plex Mono",monospace',
            fontSize: 10,
            letterSpacing: '.18em',
            color: '#ffb24d',
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 11, color: '#4d7796', letterSpacing: '.04em' }}>
          {sub}
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <section
      id="compare"
      style={{
        position: 'relative',
        padding: 'clamp(60px,8vw,100px) clamp(5vw,6vw,6vw) 80px',
        zIndex: 5,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: '"IBM Plex Mono",monospace',
          fontSize: 11,
          letterSpacing: '.22em',
          color: '#ffb24d',
          marginBottom: 12,
        }}
      >
        PERBANDINGAN
      </div>
      <h2
        style={{
          fontFamily: '"Space Grotesk",sans-serif',
          fontSize: 'clamp(24px,3.5vw,44px)',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-.03em',
          marginBottom: 10,
        }}
      >
        Sama-Sama Baca Data,
        <br />
        Beda Cara Kerjanya
      </h2>
      <p
        style={{
          fontSize: 14,
          color: '#7fa9c9',
          marginBottom: isMobile ? 32 : 48,
          maxWidth: 480,
          lineHeight: 1.7,
        }}
      >
        RFID, Barcode, QR Code, dan NFC — empat teknologi auto-ID yang sering
        disalahpahami. Ini visualnya.
      </p>

      {/* ── Tech Header Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
          gap: 12,
          marginBottom: 40,
        }}
      >
        {TECHS.map((tech) => (
          <div
            key={tech.name}
            style={{
              background: `${tech.color}0e`,
              border: `1px solid ${tech.color}44`,
              borderRadius: 10,
              padding: isMobile ? '16px 14px' : '20px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <i
              className={`ph-fill ${tech.icon}`}
              style={{ fontSize: isMobile ? 28 : 34, color: tech.color }}
            />
            <div
              style={{
                fontFamily: '"Space Grotesk",sans-serif',
                fontWeight: 700,
                fontSize: isMobile ? 16 : 18,
                color: tech.color,
              }}
            >
              {tech.name}
            </div>
            <div
              style={{
                fontSize: isMobile ? 11 : 12,
                color: '#cfe2f2',
                lineHeight: 1.5,
              }}
            >
              {tech.tagline}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 10,
                letterSpacing: '.08em',
                color: tech.color,
                background: `${tech.color}14`,
                border: `1px solid ${tech.color}30`,
                borderRadius: 3,
                padding: '4px 8px',
                lineHeight: 1.4,
              }}
            >
              ★ {tech.best}
            </div>
          </div>
        ))}
      </div>

      {/* ── Visual Comparison Block ── */}
      <div
        style={{
          background: 'rgba(8,18,35,.6)',
          border: '1px solid rgba(125,196,240,.13)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {/* Column headers (repeat tech names) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? `120px repeat(2,1fr)`
              : `200px repeat(4,1fr)`,
            borderBottom: '1px solid rgba(125,196,240,.15)',
          }}
        >
          <div style={{ padding: '14px 16px' }} />
          {TECHS.slice(0, isMobile ? 2 : 4).map((tech) => (
            <div
              key={tech.name}
              style={{
                padding: '14px 8px',
                textAlign: 'center',
                borderLeft: '1px solid rgba(125,196,240,.1)',
              }}
            >
              <div
                style={{
                  fontFamily: '"Space Grotesk",sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  color: tech.color,
                }}
              >
                {tech.name}
              </div>
            </div>
          ))}
        </div>

        {/* Rows */}
        {[
          /* Bool rows */
          ...VISUAL_DATA.map((row) => ({
            label: row.label,
            sub: row.sub,
            cells: row.vals
              .slice(0, isMobile ? 2 : 4)
              .map((v, i) => <BoolIcon key={i} val={v.val} note={v.note} />),
          })),
          /* Range row */
          {
            label: 'Jarak baca maksimal',
            sub: 'Seberapa jauh tag bisa terdeteksi',
            cells: RANGE_DATA.slice(0, isMobile ? 2 : 4).map((r, i) => (
              <RangeBar
                key={i}
                pct={r.pct}
                label={r.label}
                note={r.note}
                color={r.color}
              />
            )),
          },
          /* Price row */
          {
            label: 'Harga per tag / label',
            sub: 'Estimasi biaya satu unit',
            cells: PRICE_DATA.slice(0, isMobile ? 2 : 4).map((p, i) => (
              <CoinPrice
                key={i}
                coins={p.coins}
                label={p.label}
                color={p.color}
              />
            )),
          },
          /* Example row */
          {
            label: 'Contoh nyata',
            sub: 'Digunakan di mana?',
            cells: EXAMPLE_DATA.slice(0, isMobile ? 2 : 4).map((ex, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11,
                  color: '#9cbdd1',
                  lineHeight: 1.55,
                  textAlign: 'center',
                }}
              >
                {ex}
              </div>
            )),
          },
        ].map((row, ri) => (
          <div
            key={row.label}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? `120px repeat(2,1fr)`
                : `200px repeat(4,1fr)`,
              background: ri % 2 === 0 ? 'rgba(5,14,28,.45)' : 'transparent',
              borderBottom: '1px solid rgba(125,196,240,.07)',
            }}
          >
            {/* Label cell */}
            <div
              style={{
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3,
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? 11 : 12,
                  color: '#cfe2f2',
                  lineHeight: 1.4,
                  fontWeight: 500,
                }}
              >
                {row.label}
              </div>
              {!isMobile && (
                <div
                  style={{
                    fontSize: 10,
                    color: '#4d7796',
                    letterSpacing: '.04em',
                  }}
                >
                  {row.sub}
                </div>
              )}
            </div>
            {/* Value cells */}
            {row.cells.map((cell, ci) => (
              <div
                key={ci}
                style={{
                  padding: '18px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '1px solid rgba(125,196,240,.08)',
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}

        {/* Mobile: show QR + NFC in second table */}
        {isMobile && (
          <>
            <div
              style={{
                padding: '10px 16px',
                background: 'rgba(255,178,77,.06)',
                borderTop: '1px solid rgba(255,178,77,.15)',
                fontFamily: '"IBM Plex Mono",monospace',
                fontSize: 10,
                letterSpacing: '.16em',
                color: '#ffb24d',
              }}
            >
              QR CODE & NFC
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `120px repeat(2,1fr)`,
                borderBottom: '1px solid rgba(125,196,240,.15)',
              }}
            >
              <div style={{ padding: '14px 16px' }} />
              {TECHS.slice(2).map((tech) => (
                <div
                  key={tech.name}
                  style={{
                    padding: '14px 8px',
                    textAlign: 'center',
                    borderLeft: '1px solid rgba(125,196,240,.1)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Space Grotesk",sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      color: tech.color,
                    }}
                  >
                    {tech.name}
                  </div>
                </div>
              ))}
            </div>
            {[
              ...VISUAL_DATA.map((row) => ({
                label: row.label,
                cells: row.vals
                  .slice(2)
                  .map((v, i) => (
                    <BoolIcon key={i} val={v.val} note={v.note} />
                  )),
              })),
              {
                label: 'Jarak baca',
                cells: RANGE_DATA.slice(2).map((r, i) => (
                  <RangeBar
                    key={i}
                    pct={r.pct}
                    label={r.label}
                    note={r.note}
                    color={r.color}
                  />
                )),
              },
              {
                label: 'Harga per tag',
                cells: PRICE_DATA.slice(2).map((p, i) => (
                  <CoinPrice
                    key={i}
                    coins={p.coins}
                    label={p.label}
                    color={p.color}
                  />
                )),
              },
              {
                label: 'Contoh nyata',
                cells: EXAMPLE_DATA.slice(2).map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 11,
                      color: '#9cbdd1',
                      lineHeight: 1.55,
                      textAlign: 'center',
                    }}
                  >
                    {ex}
                  </div>
                )),
              },
            ].map((row, ri) => (
              <div
                key={row.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `120px repeat(2,1fr)`,
                  background:
                    ri % 2 === 0 ? 'rgba(5,14,28,.45)' : 'transparent',
                  borderBottom: '1px solid rgba(125,196,240,.07)',
                }}
              >
                <div
                  style={{
                    padding: '18px 16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{ fontSize: 11, color: '#cfe2f2', lineHeight: 1.4 }}
                  >
                    {row.label}
                  </div>
                </div>
                {row.cells.map((cell, ci) => (
                  <div
                    key={ci}
                    style={{
                      padding: '18px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderLeft: '1px solid rgba(125,196,240,.08)',
                    }}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {[
          ['ph-check-circle', '#39d98a', 'Unggul'],
          ['ph-minus-circle', '#ffb24d', 'Sebagian'],
          ['ph-x-circle', '#ff5e5e', 'Tidak'],
        ].map(([icon, color, label]) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              color: '#5d83a3',
            }}
          >
            <i className={`ph-fill ${icon}`} style={{ fontSize: 14, color }} />
            {label}
          </div>
        ))}
      </div>

      {/* NFC note */}
      <div
        style={{
          marginTop: 28,
          padding: '16px 20px',
          background: 'rgba(180,138,255,.06)',
          border: '1px solid rgba(180,138,255,.2)',
          borderRadius: 6,
          fontSize: 13,
          color: '#cfe2f2',
          lineHeight: 1.75,
          maxWidth: 640,
        }}
      >
        💡{' '}
        <strong style={{ color: '#b48aff' }}>
          NFC sebenarnya bagian dari RFID
        </strong>{' '}
        — keduanya pakai frekuensi HF 13.56 MHz. Bedanya, NFC dirancang khusus
        untuk komunikasi <em>dua arah</em> jarak sangat dekat (&lt;10 cm) antara
        dua perangkat aktif, seperti HP ke mesin EDC.
      </div>
    </section>
  );
}
