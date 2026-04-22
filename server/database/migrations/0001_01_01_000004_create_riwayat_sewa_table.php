<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('riwayat_sewa', function (Blueprint $table) {
            $table->id('id_sewa'); //
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade'); //
            $table->foreignId('id_kamar')->constrained('kamar', 'id_kamar')->onDelete('restrict'); //
            $table->date('tanggal_masuk'); //
            $table->date('tanggal_keluar')->nullable(); //
            $table->decimal('harga_deal', 15, 2); //
            $table->integer('durasi_sewa_bulan')->default(1); //
            $table->enum('status_sewa', ['aktif', 'selesai', 'dibatalkan'])->default('aktif'); //
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riwayat_sewa');
    }
};
