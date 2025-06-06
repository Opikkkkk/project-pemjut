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
                'description' => 'Membuat sebuah website laravel dengan fitur manajemen projek.',
                'start_date' => Carbon::now()->subDays(30),
                'end_date' => Carbon::now()->addDays(60),
                'status' => 'In Progress',
                'leader_id' => $projectManagers->first()->id,
                'created_by' => $admin->id,
                'member_id' => $teamMembers->first()->id,
            ]
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }

        $this->command->info('Projects seeded successfully!');
    }
}
