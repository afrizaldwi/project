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
        Schema::create('pengeluaran', function (Blueprint $table) {
            $table->id('id_pengeluaran'); //
            $table->string('judul_pengeluaran', 100); //
            $table->text('deskripsi')->nullable(); //
            $table->decimal('jumlah_pengeluaran', 15, 2); //
            $table->date('tanggal_pengeluaran'); //
            $table->string('bukti_foto')->nullable(); //
            $table->foreignId('dibuat_oleh')->constrained('users')->onDelete('set null'); //
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengeluarans');
    }
};
