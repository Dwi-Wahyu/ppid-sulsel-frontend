# Error Pages - Image Assets

## Lokasi Gambar Error

Untuk halaman error (403, 404, 500, 503), gambar harus ditempatkan di folder `static/images/errors/`.

### Struktur Folder:
```
static/
└── images/
    └── errors/
        ├── 403.png  # Gambar untuk error 403 (Forbidden)
        ├── 404.png  # Gambar untuk error 404 (Not Found)
        ├── 500.png  # Gambar untuk error 500 (Internal Server Error)
        └── 503.png  # Gambar untuk error 503 (Service Unavailable)
```

## Rekomendasi Desain Gambar

- **Format**: PNG dengan background transparan
- **Ukuran**: Maksimal 512x512 px (akan di-resize otomatis via CSS)
- **Style**: Ilustrasi 3D modern dengan warna yang sesuai dengan tema blue/sky
- **Konten**: 
  - 403: Gembok atau tanda larangan
  - 404: Orang bingung atau jalan buntu (broken bridge seperti di contoh Blade)
  - 500: Server error atau tools rusak
  - 503: Maintenance atau sedang perbaikan

## Cara Menambahkan Gambar

1. Siapkan gambar dengan nama yang sesuai (403.png, 404.png, dll)
2. Letakkan di folder `static/images/errors/`
3. Jika folder belum ada, buat terlebih dahulu
4. Gambar akan otomatis tersedia di `/images/errors/[nama-file].png`

## Fallback

Jika gambar tidak ditemukan, halaman error tetap akan ditampilkan dengan baik tanpa gambar (gambar akan disembunyikan otomatis via `onerror` handler).

## Testing Error Pages

Untuk test halaman error:

1. **404 Error**: Kunjungi URL yang tidak ada, misal: `http://localhost:5173/halaman-tidak-ada`
2. **500 Error**: Buat error di code (misal throw error di +page.server.ts)
3. **403 Error**: Simulasi dengan throw error di hooks.server.ts
4. **503 Error**: Simulasi dengan throw error di hooks.server.ts

## Contoh Throw Error

Untuk testing, Anda bisa throw error dengan status code tertentu:

```javascript
// di +page.server.ts atau hooks.server.ts
import { error } from '@sveltejs/kit';

throw error(404, 'Halaman tidak ditemukan');
throw error(403, 'Akses ditolak');
throw error(500, 'Kesalahan server');
throw error(503, 'Layanan tidak tersedia');
```
