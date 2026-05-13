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
        Schema::create('tagihan', function (Blueprint $table) {
            $table->id('id_tagihan'); //
            $table->foreignId('id_sewa')->constrained('riwayat_sewa', 'id_sewa')->onDelete('cascade'); //
            $table->string('kode_invoice', 50)->unique(); //
            $table->date('tanggal_tagihan'); //
            $table->date('tanggal_jatuh_tempo'); //
            $table->decimal('total_tagihan', 15, 2); //
            $table->enum('status_tagihan', ['belum_bayar', 'lunas', 'telat', 'pending'])->default('belum_bayar'); //
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tagihan');
    }
};
