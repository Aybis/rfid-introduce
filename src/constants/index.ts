// ─── Types ────────────────────────────────────────────────────────────────────

export type Band = 'LF' | 'HF' | 'UHF';
export type WaveMode = 'passive' | 'active';
export type PlanKey = 'warehouse' | 'toll' | 'logistics' | 'library' | 'livestock' | 'gate';

export interface BandInfo {
  abbr: string; full: string; freq: string;
  range: string; rangeMid: string; rulerMax: string;
  activeRange: string; activeMid: string;
  wl: string; need: string;
  use: string;       // passive applications
  useActive: string; // active applications
}

export interface WaveCfgEntry {
  wl: number; speed: number; dist: number; amp: number;
  cr: number; cg: number; cb: number;
}

export interface WaveCfgRuntime extends WaveCfgEntry {
  mode: WaveMode;
}

export interface Layer {
  i: number; tag: string; name: string; id: string;
  desc: string; a: string; b: string;
}

export interface Step { n: string; t: string; }

export interface UseCase {
  icon: string; band: Band; plan: PlanKey;
  title: string; sub: string; desc: string;
  planTitle: string; planDesc: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const BAND_INFO: Record<Band, BandInfo> = {
  LF: {
    abbr:'LF', full:'Low Frequency', freq:'125–134 kHz',
    range:'0–10 cm', rangeMid:'5 cm', rulerMax:'± 10 cm',
    activeRange:'1–5 m', activeMid:'2,5 m',
    wl:'2.400 m',
    need:'Penetrasi logam & air tinggi, jarak sangat dekat.',
    use:'Microchip hewan peliharaan, akses kendaraan di gerbang, identifikasi aset industri berat.',
    useActive:'Sensor khusus industri berat, pemantauan kondisi mesin dari dekat, jarang digunakan luas.',
  },
  HF: {
    abbr:'HF', full:'High Frequency', freq:'13,56 MHz',
    range:'0–30 cm', rangeMid:'15 cm', rulerMax:'± 30 cm',
    activeRange:'1–10 m', activeMid:'5 m',
    wl:'22 m',
    need:'Kecepatan transfer sedang, harga terjangkau, standar NFC.',
    use:'Kartu akses gedung, pembayaran NFC, tiket transportasi, manajemen perpustakaan, e-passport.',
    useActive:'Tracking pasien & peralatan rumah sakit, smart card aktif, tiket konser & acara besar.',
  },
  UHF: {
    abbr:'UHF', full:'Ultra High Frequency', freq:'860–960 MHz',
    range:'1–12 m', rangeMid:'6 m', rulerMax:'± 12 m',
    activeRange:'10–100 m', activeMid:'50 m',
    wl:'33 cm',
    need:'Membaca ratusan tag sekaligus, cepat, dan dari jarak jauh untuk volume tinggi.',
    use:'Retail & inventaris massal, logistik & supply chain, e-Toll otomatis, rantai pasok global.',
    useActive:'RTLS (pelacakan aset real-time), kendaraan dalam kompleks, tracking kontainer di pelabuhan, outdoor monitoring.',
  },
};

export const WAVE_CFG: Record<Band, WaveCfgEntry> = {
  LF:  { wl:2.7, speed:1.4, dist:4.4, amp:0.62, cr:0.56, cg:0.75, cb:0.90 },
  HF:  { wl:1.5, speed:2.3, dist:6.0, amp:0.46, cr:0.66, cg:0.83, cb:1.00 },
  UHF: { wl:0.72, speed:3.6, dist:8.0, amp:0.32, cr:1.00, cg:0.70, cb:0.30 },
};

export const LAYERS: Layer[] = [
  { i:0, tag:'LAYER 01 / 04', name:'Substrate', id:'LAPISAN DASAR',
    desc:'Lapisan dasar dari film PET atau kertas. Inilah fondasi tempat antena dan chip dipasang — memberi bentuk fisik dan kekuatan.',
    a:'Bahan · PET / kertas', b:'Tebal · 25–50 µm' },
  { i:1, tag:'LAYER 02 / 04', name:'Antenna', id:'ANTENA KUMPARAN',
    desc:'Kumparan logam yang menangkap gelombang reader untuk memberi daya ke chip, lalu memancarkan balik datanya. Bentuknya menentukan frekuensi kerja.',
    a:'Bahan · Tembaga / aluminium', b:'Bentuk · Coil / dipole' },
  { i:2, tag:'LAYER 03 / 04', name:'Microchip', id:'OTAK TAG · IC',
    desc:'Otak dari tag. Menyimpan nomor identitas unik (UID/EPC) dan mengatur seluruh komunikasi. Ukurannya bisa lebih kecil dari sebutir pasir.',
    a:'Ukuran · 0,3–0,5 mm', b:'Daya · dari medan RF' },
  { i:3, tag:'LAYER 04 / 04', name:'Casing', id:'PELINDUNG · LAMINATE',
    desc:'Lapisan laminasi pelindung yang membungkus seluruh inlay. Membuat tag tahan air dan goresan, sekaligus jadi permukaan label.',
    a:'Bahan · PET / PVC', b:'Fungsi · Proteksi & label' },
];

export const STEPS_PASSIVE: Step[] = [
  { n:'01', t:'Reader memancarkan gelombang radio terus-menerus ke sekitarnya.' },
  { n:'02', t:'Antena tag menangkap gelombang dan mengubahnya menjadi listrik untuk menyalakan chip — tanpa baterai.' },
  { n:'03', t:'Chip mengirim balik nomor ID-nya dengan memantulkan sinyal (backscatter).' },
  { n:'04', t:'Reader menangkap ID dan meneruskannya ke sistem untuk diproses.' },
];

/** @deprecated use STEPS_PASSIVE */
export const STEPS = STEPS_PASSIVE;

export const STEPS_ACTIVE: Step[] = [
  { n:'01', t:'Tag aktif memancarkan sinyal secara mandiri menggunakan baterai internal — tanpa perlu diaktifkan reader.' },
  { n:'02', t:'Sinyal broadcast tersebar jauh; banyak reader di berbagai titik bisa menangkap sekaligus.' },
  { n:'03', t:'Reader menerima sinyal, mencatat ID & waktu, lalu menentukan posisi tag via trilateration.' },
  { n:'04', t:'Sistem menggabungkan data semua reader untuk tracking real-time aset atau kendaraan.' },
];

export const USE_CASES: UseCase[] = [
  { icon:'ph-storefront', band:'UHF', plan:'warehouse', title:'Retail & Inventory', sub:'Pelacakan stok otomatis',
    desc:'Ribuan barang dibaca sekaligus tanpa scan satu per satu — stok real-time, kehilangan barang berkurang.',
    planTitle:'Gudang ritel', planDesc:'Setiap pallet melewati gerbang dock; reader UHF di portal membaca semua tag sekaligus saat lewat.' },
  { icon:'ph-road-horizon', band:'UHF', plan:'toll', title:'e-Toll & Transport', sub:'Bayar tanpa berhenti',
    desc:'Tag di kendaraan dibaca saat melintas gantry, transaksi otomatis tanpa antre.',
    planTitle:'Gerbang tol', planDesc:'Gantry di atas jalur memancarkan medan UHF; tag di kaca mobil terbaca dan palang terangkat otomatis.' },
  { icon:'ph-identification-badge', band:'HF', plan:'gate', title:'Akses & Identitas', sub:'Kartu masuk gedung',
    desc:'Tap kartu untuk membuka pintu, absensi, dan identifikasi karyawan secara aman.',
    planTitle:'Pintu akses', planDesc:'Reader HF di samping pintu membaca kartu saat ditap dari dekat, lalu daun pintu terbuka.' },
  { icon:'ph-truck', band:'UHF', plan:'logistics', title:'Logistik & Supply Chain', sub:'Pelacakan pengiriman',
    desc:'Palet dan kontainer dilacak di gudang serta jalur distribusi untuk visibilitas penuh.',
    planTitle:'Dok pengiriman', planDesc:'Kotak berjalan di konveyor melewati portal reader menuju truk; tiap kotak terbaca otomatis saat dimuat.' },
  { icon:'ph-books', band:'HF', plan:'library', title:'Perpustakaan', sub:'Self-checkout & anti-pencurian',
    desc:'Tag RFID di setiap buku memungkinkan peminjaman mandiri tanpa antre kasir, dan gerbang EAS berbunyi jika buku keluar tanpa checkout.',
    planTitle:'Gerbang EAS Perpustakaan', planDesc:'Siswa bawa buku ke kiosk self-checkout — semua tag terbaca sekaligus, pinjaman tercatat otomatis. Kalau buku keluar tanpa checkout, gerbang EAS berbunyi.' },
  { icon:'ph-paw-print', band:'LF', plan:'livestock', title:'Hewan & Ternak', sub:'Ear tag & manajemen kawanan',
    desc:'Ear tag RFID di telinga ternak menyimpan ID nasional (IDN-360), berat, status vaksinasi, dan riwayat kesehatan — terbaca saat hewan lewat timbangan otomatis.',
    planTitle:'Timbangan & Scanner Ternak', planDesc:'Sapi masuk kandang melewati timbangan digital + reader LF. Sistem langsung catat: ID nasional, ras, berat hari ini, dan status vaksinasi FMD/Brucella.' },
];
