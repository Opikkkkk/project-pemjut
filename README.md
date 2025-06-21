# 🗂️ Project Management System

Sebuah aplikasi manajemen tugas berbasis web yang memungkinkan tim untuk membuat proyek, menetapkan tugas, memantau progres, dan berkolaborasi secara efisien. Aplikasi ini dilengkapi dengan autentikasi JWT, pengelolaan peran pengguna, serta antarmuka frontend interaktif menggunakan TypeScript dan Tailwind CSS.

---
# Link Video
https://drive.google.com/file/d/1XfN-PWuAEMBrPYUW4gHzsb633C8JXjj6/view?usp=drivesdk 
---



## 👥 Anggota Kelompok

| Nama Lengkap                   | NIM           |
|--------------------------------|---------------|
| Muhammad Roji Taufik           | 152023103     |
| Shafa Gusti Faradilla          | 152023110     | 
| Amanda Pramitha Ramadhani      | 152023105     | 
| Muhammad Taufiq Rahman Hakim   | 152023119     | 

---

## 🚀 Fitur Utama

| Fitur               | Keterangan                                                                 |
|---------------------|----------------------------------------------------------------------------|
| Autentikasi JWT     | Login, registrasi, dan otorisasi user berbasis token JWT (dengan Refresh) |
| Manajemen User      | Role: Admin, Project Manager, Team Member                                  |
| CRUD Proyek         | Tambah, lihat, edit, hapus proyek                                           |
| CRUD Tugas          | Tambah, ubah, hapus tugas di dalam proyek                                  |
| Status Tugas        | Ubah status tugas: `To Do`, `In Progress`, `Done`                         |
| Komentar            | Komentar antar anggota tim pada masing-masing tugas                        |
| Dashboard Ringkasan | Statistik jumlah proyek, tugas, progres                                    |
| Edit Profil         | Setiap user dapat memperbarui profilnya                                    |

---

## 🧾 Roles & Permissions

| Permission       | Role yang Memiliki                |
|------------------|-----------------------------------|
| manage users     | Admin                             |
| create project   | Admin, Project Manager            |
| update project   | Admin, Project Manager            |
| delete project   | Admin                             |
| assign tasks     | Project Manager                   |
| update tasks     | Project Manager, Team Member      |
| comment tasks    | Semua Role                        |
| view dashboard   | Semua Role                        |



## 🗺️ Alur Sistem

![flowchart_pemrograman_web](https://github.com/user-attachments/assets/da873e1e-6420-4bb8-81ac-dbcea3f2a959)


---

## 🧩 ERD (Entity Relationship Diagram)

![ERD Project Management System]([docs/erd.png](https://github.com/user-attachments/assets/d6b9ee99-aa69-430d-bca9-ea24d967a137))  



---

## 📦 Cara Deployment

### 1. Clone Repository

```bash
git clone https://github.com/namakamu/project-management-system.git
cd project-management-system

composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
composer require tymon/jwt-auth spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"


#Pada .env
DB_DATABASE=laravel_typescript
DB_USERNAME=root
DB_PASSWORD= 

#Migrasi
php artisan migrate
php artisan db:seed DatabaseSeeder

npm install
npm install lucide-react
npm run dev
php artisan serve



