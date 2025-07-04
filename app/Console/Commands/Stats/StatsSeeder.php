<?php

namespace App\Console\Commands\Stats;

use App\Enum\StatsEnum;
use App\Http\Controllers\StatsController;
use App\Models\User;
use App\Traits\HasStats;
use Illuminate\Console\Command;

class StatsSeeder extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:stats:seed {model} {id} {--num=1} {--type=VIEW} {--user=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed Random Stats Data';

    /**
     * Execute the console command.
     *
     * @throws \Exception
     */
    public function handle(): bool
    {
        /** @var string $model */
        $model = $this->argument('model');

        /** @var int $id */
        $id = $this->argument('id');

        if (!is_numeric($this->option('num'))) {
            $this->error('Option num must be numeric');
            return false;
        }

        if (!is_numeric($this->option('user'))) {
            $this->error('Option user must be numeric');
            return false;
        }

        $statEnumTypes = StatsEnum::names();
        if (!in_array($this->option('type'), $statEnumTypes)) {
            $this->error('Option type not found, allowed types are: '.implode(',', $statEnumTypes));
            return false;
        }

        if (!class_exists($model)) {
            $this->error('Class not found');
            return false;
        }

        /** @var \App\Models\Base $modelObject */
        $modelObject = $model::find($id);

        if (!$modelObject) {
            $this->error('Model not found');
        }

        if (!in_array(HasStats::class, class_uses($modelObject))) {
            $this->error('Model must implement HasStats');
            return false;
        }

        if ($this->option('user') && !User::find($this->option('user'))) {
            $this->error('User not found');
            return false;
        }

        $statsCreated = 0;

        for ($i = 0; $i < $this->option('num'); $i++) {
            /** @var User $user */
            $user = User::find($this->option('user'));

            StatsController::create(StatsEnum::VIEW->name, $modelObject, $user, 'Seeder');

            $statsCreated++;
        }

        if ($statsCreated) {
            $this->info('Stats created successfully: '.$statsCreated);
            return true;
        }

        $this->error('Failed to create stats');
        return false;
    }

}
