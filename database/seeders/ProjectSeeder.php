<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Project;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users by role
        $admin = User::where('role', 'Admin')->first();
        $projectManagers = User::where('role', 'Project Manager')->get();
        $teamMembers = User::where('role', 'Team Member')->get();

        if (!$admin || $projectManagers->isEmpty() || $teamMembers->isEmpty()) {
            $this->command->warn('Please make sure you have users with Admin, Project Manager, and Team Member roles before running this seeder.');
            return;
        }

        $projects = [
            [
                'name' => 'Laravel Project Management System',
                'description' => 'Membuat sebuah website laravel dengan tema manajemen projek yang dapat membuat sebuah project dan colaborasi.',
                'start_date' => Carbon::now()->subDays(30),
                'end_date' => Carbon::now()->addDays(60),
                'status' => 'In Progress', // Sesuaikan dengan enum di migration
                'leader_id' => 4, // Project leader (Project Manager with ID 4)
                'created_by' => $admin->id, // User yang membuat project
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create($projectData);

            // Add specific team members for project ID 1
            if ($project->id === 1) {
            $memberIds = [5, 6, 7];
            } else {
            // For other projects, use original logic
            $memberIds = [];
            if ($teamMembers->count() >= 3) {
                $memberIds = $teamMembers->take(3)->pluck('id')->toArray();
            } else {
                $memberIds = $teamMembers->pluck('id')->toArray();
            }
            }

            // Attach team members to project
            $project->members()->attach($memberIds);

            $this->command->info("Project '{$project->name}' created with " . count($memberIds) . " team members.");
        }

        $this->command->info('Projects seeded successfully!');
    }
}
