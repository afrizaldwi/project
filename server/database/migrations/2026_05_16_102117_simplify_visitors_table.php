<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('visitors')->truncate();

        Schema::table('visitors', function (Blueprint $table) {
            if (! Schema::hasColumn('visitors', 'visitor_key')) {
                $table->string('visitor_key', 64)->after('id');
            }

            if (! Schema::hasColumn('visitors', 'visit_date')) {
                $table->date('visit_date')->after('visitor_key');
            }
        });

        Schema::table('visitors', function (Blueprint $table) {
            $columnsToDrop = [
                'ip_address',
                'user_agent',
                'page',
                'visited_at',
                'time_spent',
                'room_viewed',
                'created_at',
                'updated_at',
            ];

            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('visitors', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        Schema::table('visitors', function (Blueprint $table) {
            $table->unique(['visitor_key', 'visit_date'], 'visitors_visitor_key_visit_date_unique');
        });
    }

    public function down(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            $table->dropUnique('visitors_visitor_key_visit_date_unique');
        });

        Schema::table('visitors', function (Blueprint $table) {
            if (Schema::hasColumn('visitors', 'visitor_key')) {
                $table->dropColumn('visitor_key');
            }

            if (Schema::hasColumn('visitors', 'visit_date')) {
                $table->dropColumn('visit_date');
            }
        });

        Schema::table('visitors', function (Blueprint $table) {
            if (! Schema::hasColumn('visitors', 'ip_address')) {
                $table->string('ip_address')->nullable();
            }

            if (! Schema::hasColumn('visitors', 'user_agent')) {
                $table->text('user_agent')->nullable();
            }

            if (! Schema::hasColumn('visitors', 'page')) {
                $table->string('page')->default('/');
            }

            if (! Schema::hasColumn('visitors', 'visited_at')) {
                $table->timestamp('visited_at')->nullable();
            }

            if (! Schema::hasColumn('visitors', 'time_spent')) {
                $table->integer('time_spent')->default(0);
            }

            if (! Schema::hasColumn('visitors', 'room_viewed')) {
                $table->string('room_viewed')->nullable();
            }

            if (! Schema::hasColumn('visitors', 'created_at')) {
                $table->timestamp('created_at')->nullable();
            }

            if (! Schema::hasColumn('visitors', 'updated_at')) {
                $table->timestamp('updated_at')->nullable();
            }
        });
    }
};
