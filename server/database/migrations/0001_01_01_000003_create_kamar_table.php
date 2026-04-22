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
        Schema::create('kamar', function (Blueprint $table) {
            $table->id('id_kamar'); //
            $table->string('nomor_kamar', 10)->unique(); //
            $table->text('fasilitas')->nullable(); //
            $table->decimal('harga_bulanan', 15, 2); //
            $table->string('luas_kamar', 50)->nullable(); //
            $table->string('foto_kamar')->nullable(); //
            $table->enum('status_kamar', ['tersedia', 'terisi', 'perbaikan'])->default('tersedia'); //
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kamar');
    }
};
