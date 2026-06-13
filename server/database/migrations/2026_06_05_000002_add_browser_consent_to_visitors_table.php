<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("visitors", function (Blueprint $table) {
            if (! Schema::hasColumn("visitors", "browser_consent")) {
                $table->boolean("browser_consent")->default(false)->after("location_consent");
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn("visitors", "browser_consent")) {
            return;
        }

        Schema::table("visitors", function (Blueprint $table) {
            $table->dropColumn("browser_consent");
        });
    }
};
