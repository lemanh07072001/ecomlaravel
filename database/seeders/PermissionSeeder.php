<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataPermissions = [
            // Quản lý người dùng
            [
                'name'          => 'Thêm mới người dùng',
                'group'         => 'Quản lý người dùng',
            ],
            [
                'name'          => 'Cập nhật người dùng',
                'group'         => 'Quản lý người dùng',
            ],
            [
                'name'          => 'Xem danh sách người dùng',
                'group'         => 'Quản lý người dùng',
            ],
            [
                'name'          => 'Xóa người dùng',
                'group'         => 'Quản lý người dùng',
            ],

            // Quản lý phân quyền
            [
                'name'          => 'Thêm vai trò',
                'group'         => 'Quản lý phân quyền',
            ],
            [
                'name'          => 'Cập nhật vai trò',
                'group'         => 'Quản lý phân quyền',
            ],
            [
                'name'          => 'Xem danh sách vai trò',
                'group'         => 'Quản lý phân quyền',
            ],
            [
                'name'          => 'Xóa vai trò',
                'group'         => 'Quản lý phân quyền',
            ],
            [
                'name'          => 'Phân quyền',
                'group'         => 'Quản lý phân quyền',
            ],

            // Quản lý trang chủ
            [
              'name'          => 'Xem trang chủ',
              'group'         => 'Quản lý trang chủ',
            ],
        ];

        foreach ($dataPermissions as $permission) {
            Permission::firstOrCreate($permission);
        }

    }
}
