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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id('id_pembayaran'); //
            $table->foreignId('id_tagihan')->constrained('tagihan', 'id_tagihan')->onDelete('cascade'); //
            $table->date('tanggal_bayar'); //
            $table->decimal('jumlah_bayar', 15, 2); //
            $table->string('metode_pembayaran', 50)->nullable(); //
            $table->string('bukti_bayar')->nullable(); //
            $table->enum('status_verifikasi', ['pending', 'diterima', 'ditolak'])->default('pending'); //
            $table->text('catatan_admin')->nullable(); //
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
