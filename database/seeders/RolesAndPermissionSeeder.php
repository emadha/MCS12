<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionSeeder extends Seeder
{

    const DEFAULT_ROLES
        = [
            ['name' => 'Super Admin'],
            ['name' => 'Admin'],
            ['name' => 'Manager'],
            ['name' => 'Auditor'],
            ['name' => 'User'],
        ];

    const DEFAULT_PERMISSIONS
        = [
            ['name' => 'access_backend'],
            ['name' => 'approve_listing_items'],
            ['name' => 'disapprove_listing_items'],
            ['name' => 'approve_shop'],
            ['name' => 'disapprove_shop'],
        ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {

            foreach (self::DEFAULT_PERMISSIONS as $_permission) {
                Permission::create($_permission);
            }

            foreach (self::DEFAULT_ROLES as $_role) {
                $Roles = Role::create($_role)->syncPermissions(collect(self::DEFAULT_PERMISSIONS)->pluck('name')->values());
            }
        } catch (\Exception $e) {

        }
    }

}
