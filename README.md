# 📚 Buku Kita

Website pencari buku yang modern dan user-friendly menggunakan Google Books API. Temukan jutaan buku dari seluruh dunia dengan mudah!

## ✨ Fitur Utama

### 🔍 **Pencarian Cerdas**
- Pencarian berdasarkan judul, penulis, atau kata kunci
- Integrasi dengan Google Books API
- Hasil pencarian real-time
- Loading animation yang smooth

### 🎨 **Tampilan Modern**
- Desain responsive untuk semua perangkat
- Gradient background yang menarik
- Card design yang elegan
- Animasi hover dan transisi yang smooth

### 📖 **Informasi Buku Lengkap**
- Cover buku dengan fallback image
- Rating bintang visual
- Informasi penulis, tahun terbit, dan halaman
- Deskripsi buku yang informatif
- Kategori/genre buku

### 🔧 **Filter & Sorting**
- Filter berdasarkan bahasa
- Filter berdasarkan tahun terbit
- Filter berdasarkan rating minimal
- Sorting: relevansi, terbaru, terlama, rating, A-Z

### 👀 **Dua Mode Tampilan**
- **Grid View**: Tampilan card yang menarik
- **List View**: Tampilan list yang kompak

### ❤️ **Sistem Favorit**
- Tambah/hapus buku dari favorit
- Sidebar favorit yang elegant
- Penyimpanan data di localStorage
- Counter jumlah favorit

### 🚀 **Fitur Tambahan**
- Preview buku langsung di Google Books
- Link ke info lengkap buku
- Tombol hapus hasil pencarian
- Error handling yang user-friendly
- Suggestion text yang dinamis

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur semantic yang baik
- **CSS3**: Styling modern dengan flexbox dan grid
- **Vanilla JavaScript**: Logika aplikasi yang clean
- **Google Books API**: Data buku real-time
- **LocalStorage**: Penyimpanan data favorit

## 📁 Struktur File

```
book finder/
├── index.html          # File HTML utama
├── styles.css          # File CSS untuk styling
├── script.js           # File JavaScript untuk logika aplikasi
└── README.md          # Dokumentasi proyek
```

## 🚀 Cara Menggunakan

### 1. **Buka Website**
- Buka file `index.html` di browser Chrome (atau browser modern lainnya)
- Website akan langsung siap digunakan

### 2. **Mencari Buku**
- Ketik kata kunci di kolom pencarian (judul, penulis, atau topik)
- Klik tombol "🔍 Cari" atau tekan Enter
- Tunggu hasil pencarian muncul

### 3. **Menggunakan Filter**
- Klik tombol "🔧 Filter & Urutkan"
- Pilih filter yang diinginkan:
  - **Bahasa**: Pilih bahasa buku
  - **Tahun Terbit**: Filter berdasarkan periode
  - **Rating**: Filter berdasarkan rating minimal
- Hasil akan ter-filter secara otomatis

### 4. **Mengubah Tampilan**
- Gunakan tombol "⊞ Grid" atau "☰ List" untuk mengubah tampilan
- Pilih sorting di dropdown untuk mengurutkan hasil

### 5. **Menambah Favorit**
- Klik tombol "🤍 Tambah Favorit" pada buku yang disukai
- Buku akan tersimpan di sidebar favorit
- Klik tombol "❤️ Favorit" untuk melihat daftar favorit

### 6. **Melihat Detail Buku**
- Klik "👁️ Preview" untuk melihat preview buku di Google Books
- Klik "ℹ️ Info" untuk melihat informasi lengkap buku

## 🎯 Tips Penggunaan

### **Pencarian Efektif**
- Gunakan kata kunci yang spesifik untuk hasil yang lebih baik
- Coba pencarian dengan nama penulis lengkap
- Gunakan tanda kutip untuk pencarian exact phrase

### **Filter yang Berguna**
- Filter bahasa untuk mendapatkan buku dalam bahasa yang diinginkan
- Filter rating untuk mendapatkan buku berkualitas tinggi
- Filter tahun terbit untuk buku-buku terkini atau klasik

### **Manajemen Favorit**
- Favorit tersimpan secara lokal di browser
- Data favorit akan hilang jika localStorage dibersihkan
- Gunakan fitur favorit untuk membuat wishlist pribadi

## 🔧 Kustomisasi

### **Mengubah Tema Warna**
Edit file `styles.css` pada bagian:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### **Mengubah Jumlah Hasil**
Edit file `script.js` pada bagian:
```javascript
const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(query)}&maxResults=40`);
```

### **Menambah Filter Baru**
1. Tambahkan HTML di bagian filter section
2. Tambahkan logika filter di fungsi `applyFilters()`
3. Update CSS jika diperlukan

## 🌐 Kompatibilitas Browser

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (Limited support)

## 📱 Responsive Design

Website ini fully responsive dan akan bekerja dengan baik di:
- 🖥️ Desktop (1200px+)
- 💻 Laptop (768px - 1199px)
- 📱 Tablet (481px - 767px)
- 📱 Mobile (≤480px)

## 🐛 Troubleshooting

### **Hasil Pencarian Kosong**
- Pastikan koneksi internet stabil
- Coba kata kunci yang berbeda
- Periksa filter yang aktif

### **Gambar Buku Tidak Muncul**
- Ini normal untuk beberapa buku
- Placeholder akan muncul jika tidak ada gambar
- Tidak mempengaruhi fungsionalitas

### **Favorit Tidak Tersimpan**
- Pastikan localStorage tidak disabled
- Periksa storage quota browser
- Coba refresh halaman

## 🚀 Pengembangan Selanjutnya

Fitur yang bisa ditambahkan:
- [ ] Pencarian advanced dengan multiple criteria
- [ ] Export daftar favorit ke PDF/Excel
- [ ] Dark mode toggle
- [ ] Share buku ke social media
- [ ] Rekomendasi buku berdasarkan favorit
- [ ] Pencarian suara (voice search)
- [ ] Integration dengan toko buku online

## 📄 Lisensi

Proyek ini dibuat untuk tujuan edukasi dan penggunaan pribadi. Google Books API memiliki terms of service sendiri yang harus dipatuhi.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork proyek ini
2. Buat fitur baru
3. Submit pull request

---

**Selamat membaca! 📚✨**
