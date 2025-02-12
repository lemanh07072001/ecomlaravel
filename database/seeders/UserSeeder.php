<?php

namespace Database\Seeders;


use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $userId = User::firstOrCreate([
      'name' => 'admin',
      'email' => 'admin@gmail.com',
      'password' => Hash::make('password'),
    ]);

    // Tạo role "Super Admin"
    $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);

    // Gán tất cả quyền (permissions) cho Super Admin
    $allPermissions = Permission::pluck('name')->toArray();
    $superAdminRole->syncPermissions($allPermissions);
    // Gán role Super Admin cho user
    $userId->assignRole($superAdminRole);
    }
}
