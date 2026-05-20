<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifikasis', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_user')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('id_tagihan');
            $table->string('role_target', 20);
            $table->string('tipe', 50);

            $table->string('judul');
            $table->text('pesan');

            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('pushed_at')->nullable();

            $table->timestamps();

            $table->foreign('id_tagihan')
                ->references('id_tagihan')
                ->on('tagihan')
                ->cascadeOnDelete();

            $table->unique(
                ['id_user', 'id_tagihan', 'tipe'],
                'notifikasis_user_tagihan_tipe_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifikasis');
    }
};
