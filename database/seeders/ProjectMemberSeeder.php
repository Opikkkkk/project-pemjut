<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProjectMemberSeeder extends Seeder
{
    public function run(): void
    {
        // Dapatkan semua projects
        $projects = Project::all();

        // Dapatkan semua team members
        $teamMembers = User::where('role', 'Team Member')->get();

        if ($projects->isEmpty() || $teamMembers->isEmpty()) {
            $this->command->warn('Please make sure you have projects and team members before running this seeder.');
            return;
        }

        foreach ($projects as $project) {
            // Only assign members to project ID 1
            if ($project->id === 1) {
            $memberIds = [5, 6, 7];

            foreach ($memberIds as $memberId) {
                // Check if member is already assigned to project
                if (!DB::table('project_members')->where('project_id', $project->id)->where('user_id', $memberId)->exists()) {
                DB::table('project_members')->insert([
                    'project_id' => $project->id,
                    'user_id' => $memberId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                }
            }
            }

            $selectedMembers = User::whereIn('id', $memberIds)->get();

            $this->command->info("Added {$selectedMembers->count()} members to project '{$project->name}'");
        }

        $this->command->info('Project members seeded successfully!');
    }
}
