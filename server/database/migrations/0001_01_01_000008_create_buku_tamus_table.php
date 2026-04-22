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
        Schema::create('buku_tamu', function (Blueprint $table) {
            $table->id('id_tamu'); //
            $table->string('nama_tamu', 100); //
            $table->string('no_hp_tamu', 20)->nullable(); //
            $table->foreignId('bertemu_dengan')->nullable()->constrained('users')->onDelete('set null'); //
            $table->text('keperluan')->nullable(); //
            $table->timestamp('waktu_berkunjung')->useCurrent(); //
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buku_tamus');
    }
};
