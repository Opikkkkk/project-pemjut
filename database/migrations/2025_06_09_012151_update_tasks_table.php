// database/migrations/xxxx_xx_xx_update_tasks_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Pastikan kolom-kolom ini ada, jika belum ada maka tambahkan
            if (!Schema::hasColumn('tasks', 'status')) {
                $table->enum('status', ['To Do', 'In Progress', 'Done'])->default('To Do');
            }
            if (!Schema::hasColumn('tasks', 'priority')) {
                $table->enum('priority', ['Low', 'Medium', 'High'])->default('Medium');
            }
            if (!Schema::hasColumn('tasks', 'assigned_to')) {
                $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('tasks', 'due_date')) {
                $table->date('due_date')->nullable();
            }
            if (!Schema::hasColumn('tasks', 'completed_at')) {
                $table->timestamp('completed_at')->nullable();
            }
            if (!Schema::hasColumn('tasks', 'completed_by')) {
                $table->foreignId('completed_by')->nullable()->constrained('users')->onDelete('set null');
            }
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['completed_by']);
            $table->dropColumn(['completed_at', 'completed_by']);
        });
    }
};
