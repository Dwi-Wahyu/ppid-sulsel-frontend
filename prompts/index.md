# 📘 Dokumentasi Arsitektur PPID (SvelteKit & Laravel API)

Sistem ini menggunakan arsitektur **Decoupled Frontend** dengan **Server-Side Proxy** untuk menjembatani antara SvelteKit (Frontend) dan Laravel (Backend/API). Arsitektur ini mengutamakan keamanan tinggi dengan menyembunyikan token akses dari sisi klien.

## 🏗️ Stack Teknologi

- **Backend:** Laravel (API mode) dengan Laravel Sanctum.
- **Frontend:** SvelteKit v5 (Runes) & Tailwind CSS v4.
- **Security:** `httpOnly` Cookies & Server-Side Proxy.

---

## 🛰️ Alur Komunikasi Data

Arsitektur ini menggunakan pola **BFF (Backend-for-Frontend)** sederhana melalui SvelteKit:

1.  **Client-Side (Svelte):** Memanggil endpoint internal `/api/proxy/*` menggunakan helper `src/lib/api.ts`.
2.  **SvelteKit Server:** \* Menerima request di rute `src/routes/api/proxy/[...path]/+server.ts`.
    - Mengambil `access_token` dari `httpOnly` cookie yang dikelola oleh `src/hooks.server.ts`.
    - Menyisipkan token ke header `Authorization: Bearer`.
3.  **Laravel API:** Menerima request terautentikasi dan memproses data melalui Controller.

---

## 🔒 Keamanan & Autentikasi

### 1. Token Isolation

Token akses (JWT/Sanctum) disimpan dalam **Cookie httpOnly**.

- **Keuntungan:** JavaScript di browser tidak memiliki akses ke token, sehingga kebal terhadap serangan **XSS**.
- **SameSite Policy:** Menggunakan `Lax` untuk mencegah serangan **CSRF**.

## 🛠️ Implementasi Kode Utama

### A. API Helper (`src/lib/api.ts`)

Digunakan di komponen Svelte untuk memanggil API dengan dukungan objek parameter pencarian untuk memfilter data di backend.

```typescript
// Contoh penggunaan di Svelte untuk pencarian user
const res = await api.get('/admin/users', { search: 'budi', page: 1 });
```

```typescript
// Contoh penggunaan di Svelte untuk simpan user
const res = await api.post('/admin/users', formData);
```

```typescript
// Memperbarui data user berdasarkan ID
const id = 5;
const res = await api.put(`/admin/users/${id}`, {
    name: 'Updated Name',
    username: 'new_username',
    email: 'newemail@example.com',
    // password: 'newpassword' // Isi hanya jika ingin ganti password
});
```
