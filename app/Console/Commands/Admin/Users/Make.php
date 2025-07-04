<?php

namespace App\Console\Commands\Admin\Users;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Exceptions\RoleDoesNotExist;
use Spatie\Permission\Models\Role;

class Make extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:admin:make {user_id} {--super}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Give admin privileges to a {user_id}';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $User = User::where('id', $this->argument('user_id'))->first();

        $RoleName = $this->option('super') ? 'Super Admin' : 'Admin';

        if (!$User) {
            $this->warn('User Not Found');

            return;
        }

        try {
            Role::findByName($RoleName);
        } catch (RoleDoesNotExist $exception) {
            Role::create(['name' => $RoleName]);
        }


        if ($User->hasRole($RoleName)) {
            $this->warn("User already has $RoleName Role");

            return;
        }

        $RoleAssigned = $User->assignRole($RoleName);
        if ($RoleAssigned) {
            $this->info(sprintf($RoleName." privileges given to '%s'", $RoleAssigned->display->name));
        } else {
            $this->warn("Could not add $RoleName privileges to this user");
        }
    }
}
