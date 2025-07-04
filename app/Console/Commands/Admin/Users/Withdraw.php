<?php

namespace App\Console\Commands\Admin\Users;

use App\Models\User;
use Illuminate\Console\Command;

class Withdraw extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:admin:withdraw {user_id} {--super}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Withdraw admin privileges from a {user_id}';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $User = User::where('id', $this->argument('user_id'))->first();

        if (!$User) {
            $this->warn('User Not Found');

            return;
        }

        $RoleName = $this->option('super') ? 'Super Admin' : 'Admin';

        if (!$User->hasRole($RoleName)) {
            $this->warn("User doesn't have Admin role...");

            return;
        }

        $RoleWithdrawn = $User->removeRole($RoleName);

        if ($RoleWithdrawn) {
            $this->info(sprintf($RoleName." role withdrawn from '%s'", $User->display->name));
        }
    }
}
