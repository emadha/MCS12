<?php

namespace App\Console\Commands\Credits;

use App\Http\Controllers\BalanceController;
use App\Models\User;
use Illuminate\Console\Command;

class GiveCreditsToUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:give-credits {user} {amount}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Give credits to User';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::find($this->argument('user'));

        if (!$user) {
            $this->error('User not found');

            return;
        }

        $this->info('Giving '.$this->argument('amount').' credits to '.$user->display->name);

        if (BalanceController::giveCreditsToUser($user, intval($this->argument('amount')),
            (intval($this->argument('amount')) < 0 ? "Deducted" : "Credited")." by admin")
        ) {
            $this->info('User was credited the amount.');
        } else {
            $this->warn('Could not give credits to user!');
        }
    }
}
