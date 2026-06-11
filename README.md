# Instalasi Project

## 1. Clone the Repository
Buka terminal dan clone repository:

```
git clone <url-repository-web>
cd <repository-web>
````

## 2\. Jalankan Docker

Jalankan docker container dengan perintah berikut:

```
docker compose up -d --build
```

*Tunggu hingga proses selesai*

## 3\. Install Backend Dependencies

```
docker exec -it laravel-api composer install
```

## 4\. Generate Keys and Migrate the Database

```
docker exec -it laravel-api php artisan key:generate
docker exec -it laravel-api php artisan jwt:secret
docker exec -it laravel-api php artisan storage:link
docker exec -it laravel-api php artisan migrate:fresh --seed
```
-----

# Features Developed

## Login

Fitur Login digunakan sebagai pintu masuk pengguna ke dalam sistem Manajemen Kost. Pengguna harus memasukkan kredensial yang valid sebelum dapat mengakses fitur yang tersedia.

## Dashboard

Dashboard merupakan halaman utama yang ditampilkan setelah pengguna berhasil login. Halaman ini memberikan gambaran umum mengenai informasi penting dalam sistem Manajemen Kost.

## Laporan Kerusakan

Menyediakan fitur bagi penyewa untuk melapor kerusakan via Mobile dan website dan ditindaklanjuti oleh Admin via Web dan mobile. Foto kerusakan yang diunggah penyewa dari Mobile akan muncul di halaman Admin sebagai tugas yang harus diselesaikan.

## Pendataan Tamu

Mengelola catatan kunjungan tamu harian secara terstruktur untuk keperluan keamanan kost.

## Fitur Notifikasi Jatuh Tempo

Mendeteksi tagihan yang mendekati tanggal jatuh tempo (kurang dari atau sama dengan 7 hari) dan otomatis membuat notifikasi sistem serta mengirimkan Push Notification ke HP penyewa.

## Fitur Penagihan WhatsApp

Mengirim pesan pengingat tagihan kost secara personal langsung ke WhatsApp penyewa dengan pesan yang sudah terformat otomatis.

## Fitur Data Penghuni

Fitur Data Penghuni digunakan untuk mengelola informasi penghuni yang terdaftar dalam sistem, seperti nama, alamat, nomor kamar atau unit, kontak, serta metode pembayaran. Admin dapat Mengelola basis data penghuni aktif serta sistem pengarsipan riwayat penyewaan untuk data alumni.

## Invoice Transaksi

Membuat generator invoice otomatis berbasis data pembayaran yang dapat diunduh dalam format PDF. Invoice yang dibuat oleh Admin di Web setelah pembayaran dikonfirmasi akan langsung tersedia untuk diunduh oleh Penyewa di Mobile.

## Laporan Keuangan

Mengolah data transaksi menjadi laporan periodik yang dapat diekspor ke format Excel (CSV).

## Manajemen Data Kamar

Mengelola data inventaris kamar kost, termasuk fitur unggah foto fasilitas, luas, status dan pengaturan harga sewa.

## Perpanjangan Masa Sewa

Membuat logika sistem kalkulasi otomatis untuk tanggal berakhir dan biaya sewa baru saat melakukan perpanjangan sewa.

## Laporan Keuangan

Mencatat pengeluaran operasional dan menghitung laba bersih kost (Pemasukan - Pengeluaran).

-----

## 🌐 Accessing the Application

Setelah semuanya selesai, buka halaman berikut di browser:

  * **Web Dashboard (React/Vite):** [http://localhost:5173](http://localhost:5173)
  * **API Gateway (Laravel/Nginx):** [http://localhost:8000](http://localhost:8000)

-----
