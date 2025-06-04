<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserPermissionSeeder extends Seeder
{
    private $permissions = [
        'role',
    ];

    public function run(): void
    {
        foreach ($this->permissions as $permission) {
            Permission::findOrCreate($permission);
        }


        $user = User::create([
            'name' => 'Admin',
            'username' => 'Admin',
            'email' => 'Admin@gmail.com',
            'role' => 'Admin',
            'password' => Hash::make('12345678')
        ]);
        $user = User::create([
            'name' => 'Project Manager',
            'username' => 'PM',
            'email' => 'PM@gmail.com',
            'role' => 'Project Manager',
            'password' => Hash::make('12345678')
        ]);
        $user = User::create([
            'name' => 'Team Member',
            'username' => 'TM',
            'email' => 'TeamMember@gmail.com',
            'role' => 'Team Member',
            'password' => Hash::make('12345678')
        ]);

        $role = Role::create(['name' => 'admin']);

        $permissions = Permission::pluck('id', 'id')->all();

        $role->syncPermissions($permissions);

        if ($user && $role) {
            $user->assignRole('admin');
        }
    }
}
