# Portofolio Pribadi & Orbit Kreatif (Light Theme & Space Aesthetic)

Website profil dan portofolio pribadi multi-halaman statis (**3 Halaman Terpisah: `index.html`, `profil.html`, `kontak.html`**) yang dirancang dengan estetika bertema planet & luar angkasa (*Space & Orbit Aesthetic*), berpadu gaya *Euro-minimalism*, bersih, modern, dan responsif.

---

## 🪐 Fitur & Keunggulan Utama

1. **Struktur Multi-Halaman HTML Murni:**
   - **`index.html` (Halaman Utama):** Navbar konsisten, sapaan hangat di hero section, tombol CTA navigasi, ilustrasi eksplorasi luar angkasa modern, dan 3 kartu sorotan keahlian dengan animasi *hover lift*.
   - **`profil.html` (Halaman Profil):** Biografi lengkap, foto profil bergaris orbit dan satelit melayang, cerita latar belakang, linimasa karier/pendidikan, serta 4 kartu kompetensi utama berornamen visual.
   - **`kontak.html` (Halaman Kontak):** Ajakan diskusi hangat dengan ilustrasi komunikasi luar angkasa, formulir pesan interaktif dengan modal konfirmasi "Pesan Terkirim!", tautan media sosial resmi (LinkedIn, GitHub, Instagram, X), dan area khusus **Dashboard Pesan Masuk (Inbox)**.

2. **Tema Planet & Ornamen Nirgravitasi (*Light Theme*):**
   - Latar belakang putih bersih (`#FFFFFF`) dan abu-biru lembut (`#F8FAFC`) dengan teks gelap yang kontras dan nyaman dibaca.
   - Aksen warna biru langit (`#38BDF8`), ungu pastel (`#C084FC`), dan indigo lembut (`#6366F1`).
   - Ornamen vektor planet bercincin, bulan sabit, garis orbit melingkar dengan satelit yang berputar perlahan, serta taburan bintang halus berkilau (*twinkling stars*).

3. **Fitur Edit Teks & Ganti Foto Langsung di Layar:**
   - **Tombol "Mode Edit Teks":** Tersedia di pojok kanan atas navigasi. Saat diaktifkan, semua judul dan teks narasi bisa langsung diketik dan diubah di layar (*contentEditable*).
   - **Ganti Foto Profil:** Klik langsung pada foto profil di `profil.html` untuk mengunggah foto asli Anda dari galeri perangkat (tersimpan otomatis di browser).

4. **Sistem Kotak Masuk Pesan Real-Time (Inbox Dashboard):**
   - Setiap pesan yang dikirimkan pengunjung akan langsung tercatat ke dalam sistem.
   - Klik tombol rahasia **"Lihat Pesan Masuk (Admin)"** di bagian bawah halaman kontak untuk membuka dashboard dan membaca seluruh pesan yang masuk.

5. **Kepatuhan Privasi Ketat:**
   - Bebas dari nomor HP, nomor WhatsApp, alamat fisik, nama kota, dan alamat email pribadi di seluruh halaman.

---

## 📁 Struktur Direktori

```
portfolio-orbit-space/
├── index.html                           # Halaman Utama
├── profil.html                          # Halaman Profil & Biografi
├── kontak.html                          # Halaman Kontak & Formulir
├── vercel.json                          # Konfigurasi Clean URLs Vercel
├── assets/
│   ├── css/
│   │   └── style.css                    # Styling kustom, keyframes orbit & partikel
│   ├── js/
│   │   └── main.js                      # Logika interaktif, navigasi, mode edit, dan inbox
│   └── images/
│       ├── favicon.svg                  # Icon planet untuk tab browser
│       ├── illustration-space-hero.svg  # Ilustrasi eksplorasi luar angkasa di Hero
│       ├── illustration-contact.svg     # Ilustrasi komunikasi orbit di Kontak
│       └── profile-placeholder.svg      # Placeholder foto potret berkualitas tinggi
└── README.md
```

---

## 🚀 Cara Menjalankan Pratinjau Lokal

Anda dapat membuka file `index.html` langsung di browser Anda, atau menggunakan server lokal ringan (seperti Python atau Live Server):

```powershell
# Menggunakan Python HTTP Server
cd "C:\Users\Nasywa Ayyatul Husna\.gemini\antigravity\scratch\portfolio-orbit-space"
python -m http.server 8080
```
Buka browser di: **`http://localhost:8080`**

---

## ☁️ Cara Deploy ke Vercel

Proyek ini telah dilengkapi `vercel.json` dan relative path murni, sehingga 100% siap dideploy langsung ke Vercel tanpa konfigurasi rumit:

### Melalui Vercel CLI Langsung dari Terminal:
```powershell
cd "C:\Users\Nasywa Ayyatul Husna\.gemini\antigravity\scratch\portfolio-orbit-space"
npx vercel
```
Ikuti instruksi di terminal (tekan Enter untuk pilihan default). Website Anda akan langsung online dengan domain gratis seperti `https://portofolio-orbit-anda.vercel.app`!
