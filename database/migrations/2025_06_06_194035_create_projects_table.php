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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description');
            $table->foreignId('leader_id')->constrained('users')->onDelete('cascade'); // Project leader (Project Manager)
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // User who created the project
            $table->enum('status', ['Planning', 'In Progress', 'Completed', 'On Hold'])->default('Planning');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
