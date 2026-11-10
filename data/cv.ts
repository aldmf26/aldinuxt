// CV content, ID (from the owner's PDF) and EN (translation, owner to review).
// Public version: street address shortened to the city on purpose.
// Rendered by pages/cv.vue; PDFs are printed from that page by scripts/cv-pdf.mjs.

export type CvLang = 'id' | 'en'

type Job = { org: string; place: string; role: string; period: string; intro?: string; points: string[] }
type Item = { name: string; url?: string; text: string }

export type Cv = {
  name: string
  headline: string
  contact: { label: string; value: string; href?: string }[]
  headings: { summary: string; experience: string; education: string; projects: string; skills: string }
  summary: string
  jobs: Job[]
  education: { school: string; place: string; degree: string; period: string; note: string }
  projects: Item[]
  skills: { group: string; items: string }[]
}

const contact = (city: string, site: string) => [
  { label: 'Email', value: 'aldimf26@gmail.com', href: 'mailto:aldimf26@gmail.com' },
  { label: 'WhatsApp', value: '+62 895 4131 1053', href: 'https://wa.me/6289541311053' },
  { label: site, value: 'aldimf.vercel.app', href: 'https://aldimf.vercel.app' },
  { label: 'GitHub', value: 'github.com/aldmf26', href: 'https://github.com/aldmf26' },
  { label: city, value: 'Banjarmasin, Indonesia' },
]

export const cv: Record<CvLang, Cv> = {
  id: {
    name: 'Muhammad Fahrizaldi',
    headline: 'Web Developer · Music Producer',
    contact: contact('Lokasi', 'Website'),
    headings: { summary: 'Ringkasan', experience: 'Pengalaman', education: 'Pendidikan', projects: 'Proyek', skills: 'Keahlian' },
    summary:
      'Web Developer dengan keahlian pengembangan website menggunakan WordPress, CodeIgniter, dan Laravel, serta pengelolaan database seperti MySQL dan Elasticsearch. Berpengalaman mendesain sistem informasi untuk berbagai industri, termasuk restoran, peternakan, pelayaran, dan ekspor sarang burung walet. Mahir dalam pengaturan jaringan menggunakan Mikrotik, instalasi internet (termasuk fiber optik dan Starlink), dan administrasi sistem. Sebagai Music Producer, terampil menciptakan musik elektronik menggunakan FL Studio, bermain piano, dan drumpad.',
    jobs: [
      {
        org: 'PT Agrika Gatya Arum',
        intro: 'Developer dan IT in-house untuk PT Agrika Gatya Arum dan unit usaha di grupnya: CV Agrilaras (peternakan ayam petelur), Restoran Takemori & Soondobu, Orchard Salon, dan PT Virgo Karya Shipping.',
        place: 'Banjarmasin & Pelaihari, Indonesia',
        role: 'Web Developer, IT Support, Programmer',
        period: '2022 - Sekarang',
        points: [
          'Mengembangkan sistem penjualan sarang burung walet (PT Agrika Gatya Arum) menggunakan Laravel 8 dan MySQL, termasuk sistem penggajian berdasarkan divisi (cabut, cetak, sortir) dengan pelaporan berat dan susut.',
          'Merancang aplikasi kasir untuk Restoran Takemori & Soondobu di Banjarmasin menggunakan Laravel, mencakup pencatatan kasbon, denda, poin pelayan, sistem dapur, penggajian, dan laporan penjualan.',
          'Mengembangkan sistem manajemen salon Orchard: appointment terapis, POS, produk dan layanan, stok/opname, pelanggan, diskon, DP, invoice, void, absensi, kasbon, denda, tips, komisi, penggajian, serta laporan pendapatan dan penjualan.',
          'Membuat sistem informasi peternakan ayam di CV Agrilaras menggunakan Laravel dan MySQL, termasuk perhitungan jumlah ayam, pakan, telur, serta akuntansi untuk laporan laba rugi, neraca, dan jurnal.',
          'Membangun sistem untuk PT Virgo Karya Shipping: alur PO, pembayaran, penerimaan multi-kapal, stok ledger, pemakaian BBM, selisih, dan verifikasi berbasis peran; terintegrasi dengan jurnal akuntansi, buku besar, hutang, saldo awal, costing, dashboard, serta laporan stok Excel.',
          'Mengelola instalasi dan konfigurasi jaringan menggunakan Mikrotik dan Ruijie Reyee untuk distribusi internet di seluruh lantai kantor, dengan IndiHome sebagai server utama.',
          'Memasang infrastruktur internet di lokasi terpencil (hutan) untuk CV Agrilaras, termasuk kabel fiber optik, antena LHG, dan konfigurasi Starlink.',
          'Melakukan pemeliharaan database dan sistem untuk memastikan operasi cepat dan aman.',
        ],
      },
      {
        org: 'Rukita.id',
        place: 'Yogyakarta, Indonesia',
        role: 'Web Developer',
        period: 'Januari 2020 - September 2020',
        points: [
          'Mengembangkan website e-commerce menggunakan WordPress.',
          'Membangun website menggunakan CodeIgniter 3 dengan database Elasticsearch untuk pencarian cepat dan efisien.',
        ],
      },
    ],
    education: {
      school: 'Universitas Islam Kalimantan Muhammad Arsyad Al Banjari',
      place: 'Banjarmasin, Indonesia',
      degree: 'Sarjana Sistem Informasi',
      period: '2017 - 2021',
      note: 'IPK 3,60 / 4,00',
    },
    projects: [
      { name: 'Kasir OK', url: 'https://kasirsimple.vercel.app/', text: 'POS untuk UMKM: produk dan stok, transaksi, diskon/pajak, pengeluaran, shift, nota thermal, laporan, log aktivitas, PIN pemilik, serta kontrol langganan.' },
      { name: 'English for Wetlands', url: 'https://englishforwetlands.web.id', text: 'Kamus kosakata lahan basah Indonesia-Inggris bergambar, kuis multi-tipe/matching, word scramble, hasil dan riwayat peserta, serta panel admin konten dan pengguna.' },
      { name: 'Circle English Course', url: 'https://circleenglishcourse.com', text: 'Aplikasi pendaftaran kursus bahasa Inggris di Muara Teweh.' },
      { name: 'Aldi Teori', url: 'https://alditeori.vercel.app/', text: 'Website kumpulan teori umum yang bisa dicari.' },
      { name: 'Catat Duit', text: 'Website pencatat transaksi uang masuk dan keluar yang sederhana.' },
      { name: 'Terjemahan Dayak', text: 'Website penerjemah bahasa Dayak ke Indonesia dan sebaliknya.' },
    ],
    skills: [
      { group: 'Backend', items: 'PHP, Laravel, CodeIgniter, REST API, Livewire' },
      { group: 'Frontend', items: 'HTML, CSS, JavaScript, Vue, Nuxt, Blade, WordPress' },
      { group: 'Database', items: 'MySQL, Supabase, Elasticsearch' },
      { group: 'Jaringan', items: 'Mikrotik, Ruijie Reyee, Fiber Optik, Starlink' },
      { group: 'Produksi Musik', items: 'FL Studio, Piano, Drumpad' },
      { group: 'Lainnya', items: 'Akuntansi Sistem, Pengembangan Sistem Informasi, Administrasi Server' },
    ],
  },

  en: {
    name: 'Muhammad Fahrizaldi',
    headline: 'Web Developer · Music Producer',
    contact: contact('Location', 'Website'),
    headings: { summary: 'Summary', experience: 'Experience', education: 'Education', projects: 'Projects', skills: 'Skills' },
    summary:
      'Web Developer skilled in building websites with WordPress, CodeIgniter and Laravel, and in managing databases such as MySQL and Elasticsearch. Experienced in designing information systems for several industries, including restaurants, livestock farming, shipping and edible bird\'s nest export. Proficient in network setup with Mikrotik, internet installation (including fiber optic and Starlink) and system administration. As a Music Producer, creates electronic music in FL Studio and plays piano and drum pads.',
    jobs: [
      {
        org: 'PT Agrika Gatya Arum',
        intro: 'In-house developer and IT for PT Agrika Gatya Arum and the businesses in its group: CV Agrilaras (layer poultry farm), Takemori & Soondobu restaurants, Orchard Salon and PT Virgo Karya Shipping.',
        place: 'Banjarmasin & Pelaihari, Indonesia',
        role: 'Web Developer, IT Support, Programmer',
        period: '2022 - Present',
        points: [
          'Developed a bird\'s nest sales system for PT Agrika Gatya Arum with Laravel 8 and MySQL, including division-based payroll (cleaning, molding, sorting) with weight and shrinkage reporting.',
          'Designed a cashier application for Takemori & Soondobu restaurants in Banjarmasin with Laravel, covering staff advances, penalties, waiter points, kitchen orders, payroll and sales reports.',
          'Developed a salon management system for Orchard: therapist appointments, POS, products and services, stock taking, customers, discounts, down payments, invoices, voids, attendance, staff advances, penalties, tips, commissions, payroll, and revenue and sales reports.',
          'Built an information system for a poultry farm at CV Agrilaras with Laravel and MySQL, covering flock counts, feed and eggs, plus accounting for profit and loss, balance sheet and journal reports.',
          'Built a system for PT Virgo Karya Shipping: purchase orders, payments, multi-vessel receiving, stock ledger, fuel usage, variances and role-based verification, integrated with accounting journals, general ledger, payables, opening balances, costing, dashboards and Excel stock reports.',
          'Managed network installation and configuration with Mikrotik and Ruijie Reyee to distribute internet across every office floor, with IndiHome as the main uplink.',
          'Installed internet infrastructure at a remote forest site for CV Agrilaras, including fiber optic cabling, LHG antennas and Starlink configuration.',
          'Maintained databases and systems to keep operations fast and secure.',
        ],
      },
      {
        org: 'Rukita.id',
        place: 'Yogyakarta, Indonesia',
        role: 'Web Developer',
        period: 'January 2020 - September 2020',
        points: [
          'Developed an e-commerce website with WordPress.',
          'Built a website with CodeIgniter 3 and an Elasticsearch database for fast, efficient search.',
        ],
      },
    ],
    education: {
      school: 'Universitas Islam Kalimantan Muhammad Arsyad Al Banjari',
      place: 'Banjarmasin, Indonesia',
      degree: 'Bachelor of Information Systems',
      period: '2017 - 2021',
      note: 'GPA 3.60 / 4.00',
    },
    projects: [
      { name: 'Kasir OK', url: 'https://kasirsimple.vercel.app/', text: 'POS for small businesses: products and stock, transactions, discounts and tax, expenses, shifts, thermal receipts, reports, activity log, owner PIN and subscription control.' },
      { name: 'English for Wetlands', url: 'https://englishforwetlands.web.id', text: 'Illustrated Indonesian-English wetland vocabulary dictionary with multi-type and matching quizzes, word scramble, participant results and history, and an admin panel for content and users.' },
      { name: 'Circle English Course', url: 'https://circleenglishcourse.com', text: 'Registration app for an English course in Muara Teweh.' },
      { name: 'Aldi Teori', url: 'https://alditeori.vercel.app/', text: 'Searchable collection of common theories.' },
      { name: 'Catat Duit', text: 'Simple money tracker for income and expenses.' },
      { name: 'Terjemahan Dayak', text: 'Translator between the Dayak language and Indonesian.' },
    ],
    skills: [
      { group: 'Backend', items: 'PHP, Laravel, CodeIgniter, REST API, Livewire' },
      { group: 'Frontend', items: 'HTML, CSS, JavaScript, Vue, Nuxt, Blade, WordPress' },
      { group: 'Database', items: 'MySQL, Supabase, Elasticsearch' },
      { group: 'Networking', items: 'Mikrotik, Ruijie Reyee, Fiber Optic, Starlink' },
      { group: 'Music Production', items: 'FL Studio, Piano, Drum Pads' },
      { group: 'Other', items: 'Accounting Systems, Information Systems Development, Server Administration' },
    ],
  },
}

export const cvPdf = (lang: CvLang) => `/cv/Muhammad-Fahrizaldi-CV-${lang.toUpperCase()}.pdf`
