import { RevealBox } from '../atoms/RevealBox';

const ITEMS = [
  {
    icon: 'ph-car',
    label: 'E-Toll / ERP',
    desc: 'Saat mobilmu melewati gerbang tol, transponder UHF di kaca depan langsung terbaca — tanpa berhenti, tanpa sentuh.',
    tag: 'UHF · Pasif',
    color: '#ffb24d',
  },
  {
    icon: 'ph-train',
    label: 'Kartu Commuter / MRT',
    desc: 'Tap kartu di gate stasiun pakai HF 13.56 MHz. Saldo terpotong dalam 0,1 detik — itu RFID, bukan NFC.',
    tag: 'HF · Pasif',
    color: '#7fc4f0',
  },
  {
    icon: 'ph-fingerprint',
    label: 'Absensi Sekolah',
    desc: 'Mesin absensi di sekolahmu baca chip di kartu pelajar. Data langsung masuk ke sistem — tidak ada tanda tangan manual.',
    tag: 'HF · Pasif',
    color: '#7fc4f0',
  },
  {
    icon: 'ph-identification-card',
    label: 'KTP Elektronik',
    desc: 'KTP-el punya chip RFID HF di dalamnya. Berisi data biometrik warga yang bisa dibaca mesin verifikasi resmi.',
    tag: 'HF · Pasif',
    color: '#7fc4f0',
  },
  {
    icon: 'ph-storefront',
    label: 'Label Toko (Retail)',
    desc: 'Minimarket besar scan ratusan produk sekaligus tanpa scan satu-satu. UHF RFID bisa baca 1.000 tag per detik.',
    tag: 'UHF · Pasif',
    color: '#ffb24d',
  },
  {
    icon: 'ph-passport',
    label: 'Paspor Elektronik',
    desc: 'Logo chip di sampul paspor menandakan ada RFID di dalamnya. Berisi foto dan sidik jari yang dienkripsi.',
    tag: 'HF · Pasif',
    color: '#7fc4f0',
  },
];

export function RelateSection() {
  return (
    <section
      id="relate"
      style={{ position: 'relative', padding: 'clamp(60px,8vw,100px) clamp(5vw,6vw,6vw) 80px', zIndex: 5 }}
    >
      {/* Header */}
      <div style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, letterSpacing: '.22em', color: '#ffb24d', marginBottom: 12 }}>
        SECTION 01 · DI SEKITARMU
      </div>
      <h2 style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 700, color: '#fff', letterSpacing: '-.03em', marginBottom: 10 }}>
        Kamu Sudah Pakai RFID Setiap Hari
      </h2>
      <p style={{ fontSize: 14, color: '#7fa9c9', marginBottom: 48, maxWidth: 520, lineHeight: 1.7 }}>
        Sebelum masuk ke teknis, kenali dulu — berapa kali kamu sudah berinteraksi dengan RFID tanpa sadar?
      </p>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(280px,100%),1fr))', gap: 16 }}>
        {ITEMS.map((item, i) => (
          <RevealBox key={item.label} delay={i * 70}>
            <div style={{
              background: 'rgba(12,28,50,.55)',
              border: '1px solid rgba(125,196,240,.15)',
              borderRadius: 8,
              padding: '22px 20px',
              display: 'flex', flexDirection: 'column', gap: 10,
              height: '100%',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <i className={`ph-fill ${item.icon}`} style={{ fontSize: 26, color: item.color }} />
                <span style={{
                  fontFamily: '"IBM Plex Mono",monospace', fontSize: 9,
                  letterSpacing: '.12em', color: item.color,
                  background: `${item.color}18`, border: `1px solid ${item.color}44`,
                  borderRadius: 2, padding: '3px 8px', whiteSpace: 'nowrap',
                }}>
                  {item.tag}
                </span>
              </div>
              <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 600, fontSize: 16, color: '#fff' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: '#8ab4cc' }}>
                {item.desc}
              </div>
            </div>
          </RevealBox>
        ))}
      </div>

      {/* Bottom callout */}
      <div style={{
        marginTop: 40,
        padding: '18px 22px',
        background: 'rgba(255,178,77,.07)',
        border: '1px solid rgba(255,178,77,.2)',
        borderRadius: 6,
        fontFamily: '"IBM Plex Mono",monospace',
        fontSize: 12,
        letterSpacing: '.08em',
        color: '#ffcf8f',
        lineHeight: 1.7,
        maxWidth: 680,
      }}>
        ☞ Semua contoh di atas menggunakan <strong style={{ color: '#ffb24d' }}>frekuensi yang berbeda</strong> tergantung kebutuhan jarak dan kecepatan baca. Kita akan bedah perbedaannya di bagian berikutnya.
      </div>
    </section>
  );
}
