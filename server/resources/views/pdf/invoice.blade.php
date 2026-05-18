<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Invoice Pembayaran Kost</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #111827;
            font-size: 12px;
            line-height: 1.5;
        }

        .header {
            border-bottom: 2px solid #1D4ED8;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }

        .title {
            font-size: 22px;
            font-weight: bold;
            color: #1D4ED8;
            margin: 0;
        }

        .subtitle {
            margin: 4px 0 0;
            color: #6B7280;
        }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: #DCFCE7;
            color: #166534;
            font-weight: bold;
            font-size: 11px;
        }

        .section {
            margin-top: 18px;
        }

        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td,
        th {
            border: 1px solid #E5E7EB;
            padding: 8px;
            vertical-align: top;
        }

        th {
            background: #F3F4F6;
            text-align: left;
        }

        .summary-table td:first-child {
            width: 35%;
            font-weight: bold;
            color: #374151;
        }

        .amount {
            font-size: 18px;
            font-weight: bold;
            color: #166534;
        }

        .footer {
            margin-top: 28px;
            padding-top: 12px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 11px;
        }
    </style>
</head>

<body>
    @php
        $formatRupiah = function ($value) {
            return 'Rp ' . number_format((float) ($value ?? 0), 0, ',', '.');
        };

        $formatDate = function ($value) {
            return $value ? \Carbon\Carbon::parse($value)->format('d/m/Y') : '-';
        };
    @endphp

    <div class="header">
        <h1 class="title">Invoice Pembayaran Kost</h1>
        <p class="subtitle">Kost Management System</p>
    </div>

    <table class="summary-table">
        <tr>
            <td>Kode Invoice</td>
            <td>{{ $invoice['kode_invoice'] ?? '-' }}</td>
        </tr>
        <tr>
            <td>Status</td>
            <td><span class="badge">Pembayaran Diterima</span></td>
        </tr>
        <tr>
            <td>Tanggal Bayar</td>
            <td>{{ $formatDate($invoice['tanggal_bayar'] ?? null) }}</td>
        </tr>
        <tr>
            <td>Metode Pembayaran</td>
            <td>{{ $invoice['metode_pembayaran'] ?? '-' }}</td>
        </tr>
    </table>

    <div class="section">
        <div class="section-title">Data Penyewa</div>
        <table class="summary-table">
            <tr>
                <td>Nama</td>
                <td>{{ $invoice['penyewa']['nama_lengkap'] ?? '-' }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>{{ $invoice['penyewa']['email'] ?? '-' }}</td>
            </tr>
            <tr>
                <td>No. HP</td>
                <td>{{ $invoice['penyewa']['no_hp'] ?? '-' }}</td>
            </tr>
            <tr>
                <td>Alamat Asal</td>
                <td>{{ $invoice['penyewa']['alamat_asal'] ?? '-' }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Data Kamar</div>
        <table class="summary-table">
            <tr>
                <td>Nomor Kamar</td>
                <td>{{ $invoice['kamar']['nomor_kamar'] ?? '-' }}</td>
            </tr>
            <tr>
                <td>Luas Kamar</td>
                <td>{{ $invoice['kamar']['luas_kamar'] ?? '-' }}</td>
            </tr>
            <tr>
                <td>Fasilitas</td>
                <td>{{ $invoice['kamar']['fasilitas'] ?? '-' }}</td>
            </tr>
            <tr>
                <td>Harga Bulanan</td>
                <td>{{ $formatRupiah($invoice['kamar']['harga_bulanan'] ?? 0) }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Rincian Pembayaran</div>
        <table>
            <thead>
                <tr>
                    <th>Keterangan</th>
                    <th>Tanggal Tagihan</th>
                    <th>Jatuh Tempo</th>
                    <th>Tanggal Bayar</th>
                    <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Sewa kamar {{ $invoice['kamar']['nomor_kamar'] ?? '-' }}</td>
                    <td>{{ $formatDate($invoice['tanggal_tagihan'] ?? null) }}</td>
                    <td>{{ $formatDate($invoice['tanggal_jatuh_tempo'] ?? null) }}</td>
                    <td>{{ $formatDate($invoice['tanggal_bayar'] ?? null) }}</td>
                    <td>{{ $formatRupiah($invoice['jumlah_bayar'] ?? 0) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <p>Total Dibayar:</p>
        <p class="amount">{{ $formatRupiah($invoice['jumlah_bayar'] ?? 0) }}</p>
    </div>

    <div class="footer">
        Invoice ini dibuat otomatis oleh sistem setelah pembayaran diverifikasi oleh admin.
    </div>
</body>

</html>
