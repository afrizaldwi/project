<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mobile_device_tokens', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_user')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->text('device_token');
            $table->string('platform', 20)->default('android');
            $table->timestamp('last_used_at')->nullable();

            $table->timestamps();

            $table->unique(['id_user', 'device_token'], 'mobile_tokens_user_token_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mobile_device_tokens');
    }
};
