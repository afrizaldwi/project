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
        Schema::create('keluhan', function (Blueprint $table) {
            $table->id('id_keluhan'); //
            $table->foreignId('id_sewa')->constrained('riwayat_sewa', 'id_sewa')->onDelete('cascade'); //
            $table->string('judul_keluhan', 100); //
            $table->text('deskripsi_keluhan'); //
            $table->string('foto_kerusakan')->nullable(); //
            $table->enum('status_keluhan', ['pending', 'proses', 'selesai'])->default('pending'); //
            $table->timestamp('tanggal_lapor')->useCurrent(); //
            $table->timestamp('tanggal_selesai')->nullable(); //
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keluhans');
    }
};
