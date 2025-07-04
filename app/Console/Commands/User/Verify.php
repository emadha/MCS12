<?php

namespace App\Console\Commands\User;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

/**
 *
 */
class Verify extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:user:verify {userID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify a User';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::find($this->argument('userID'));

        if (!$user) {
            $this->warn('User not found');
            return 0;
        }

        $user->email_verified_at = Carbon::now();
        if ($user->save()) {
            $this->info('User verified');
            return 1;
        }

        return 0;
    }

}
