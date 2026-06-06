<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("visitors", function (Blueprint $table) {
            if (! Schema::hasColumn("visitors", "country")) {
                $table->string("country", 100)->nullable();
            }

            if (! Schema::hasColumn("visitors", "city")) {
                $table->string("city", 100)->nullable();
            }

            if (! Schema::hasColumn("visitors", "browser_name")) {
                $table->string("browser_name", 50)->nullable();
            }

            if (! Schema::hasColumn("visitors", "last_seen_at")) {
                $table->timestamp("last_seen_at")->nullable();
            }

            if (! Schema::hasColumn("visitors", "analytics_consent")) {
                $table->boolean("analytics_consent")->default(false);
            }

            if (! Schema::hasColumn("visitors", "location_consent")) {
                $table->boolean("location_consent")->default(false);
            }

            if (! Schema::hasColumn("visitors", "browser_consent")) {
                $table->boolean("browser_consent")->default(false);
            }

        });

        DB::table("visitors")->update([
            "analytics_consent" => true,
        ]);
    }

    public function down(): void
    {
        $columns = array_filter([
            "country",
            "city",
            "browser_name",
            "last_seen_at",
            "analytics_consent",
            "location_consent",
            "browser_consent",
        ], fn (string $column): bool => Schema::hasColumn("visitors", $column));

        if ($columns === []) {
            return;
        }

        Schema::table("visitors", function (Blueprint $table) use ($columns) {
            $table->dropColumn($columns);
        });
    }
};
