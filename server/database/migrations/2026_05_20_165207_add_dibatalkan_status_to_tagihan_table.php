<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE tagihan DROP CONSTRAINT IF EXISTS tagihan_status_tagihan_check");

        DB::statement("
            ALTER TABLE tagihan
            ADD CONSTRAINT tagihan_status_tagihan_check
            CHECK (status_tagihan IN ('belum_bayar', 'lunas', 'telat', 'dibatalkan'))
        ");
    }

    public function down(): void
    {
        DB::statement("UPDATE tagihan SET status_tagihan = 'belum_bayar' WHERE status_tagihan = 'dibatalkan'");

        DB::statement("ALTER TABLE tagihan DROP CONSTRAINT IF EXISTS tagihan_status_tagihan_check");

        DB::statement("
            ALTER TABLE tagihan
            ADD CONSTRAINT tagihan_status_tagihan_check
            CHECK (status_tagihan IN ('belum_bayar', 'lunas', 'telat'))
        ");
    }
};
