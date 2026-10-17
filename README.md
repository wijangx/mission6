# Mission 6 - Chill Movie Streaming Web App (Intermediate Frontend Part 2)

Proyek lanjutan pengembangan frontend website streaming film **Chill** berbasis React, Vite, dan Tailwind CSS. Pada misi ini, fokus utama adalah menambahkan sisi interaktif pada aplikasi web statis menggunakan manajemen state (`useState`) dan manipulasi data array of objects (CRUD) langsung pada tampilan utama (Homepage).

---

## 🚀 Fitur Utama & Interaktivitas (CRUD Implementation)

Implementasi fitur interaktif berbasis **Array of Objects** yang ditampilkan dan dikelola langsung pada Homepage:

* **Read (Get Data):** Menampilkan katalog film favorit secara dinamis dari array object state (`useState`) lengkap dengan detail poster, durasi, rating usia, dan genre.
* **Create (Add Data):** Menambahkan film baru ke daftar katalog melalui form modal interaktif yang dilengkapi fitur *Live Preview Card*, pemilihan poster bawaan, dan input field dinamis.
* **Update (Edit Data):** Mengubah informasi data film (judul, durasi, rating usia, genre, dan poster) secara real-time via modal form edit.
* **Delete (Hapus Data):** Menghapus film dari daftar katalog dengan konfirmasi dialog browser serta pembaruan state secara *immutable*.

---

## 🧩 Arsitektur State & Komponen (State Management)

* **Parent Component (`Home.jsx`):** Bertindak sebagai pusat penyimpanan state (`useState`) data daftar film, modal state, form state, serta seluruh handler fungsi CRUD (`handleSaveMovie`, `handleDeleteMovie`, `handleOpenEditModal`).
* **Child Component (`MovieSection.jsx`):** Menerima data daftar film dan fungsi trigger aksi melalui *props* (*prop passing/event delegation*), serta menyediakan tombol akses penambahan film baru.
* **Child Component (`MovieCard.jsx`):** Komponen poster individual dengan portal hover card interaktif yang memuat tombol aksi **Edit** dan **Hapus** film.

---

## 🛠️ Tech Stack

* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS (Mobile-first responsive design, Dark Theme Chill style)
* **State Management:** React Hooks (`useState`, `useRef`, `useEffect`)
* **Routing:** `react-router-dom`
* **Version Control:** Git & GitHub

---

## 📝 Catatan Teknis (Technical Note)

Seluruh manipulasi data (Create, Read, Update, Delete) pada misi ini dijalankan secara reaktif pada sisi klien (*client-side state management*) menggunakan state array of objects React tanpa mutasi langsung (*immutable update patterns* menggunakan `filter` dan `map`), sesuai dengan rubrik kompetensi Intermediate Frontend Part 2.