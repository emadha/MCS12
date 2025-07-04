<?php

namespace App\Console\Commands\Admin\Sitemaps;

use App\Models\Car;
use App\Models\ListingItem;
use Carbon\Carbon;
use Illuminate\Console\Command;

class Generate extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:sitemaps:generate {--type=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Sitemap';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating sitemap...');

        # Main sitemap file
        $this->info('Generating main sitemap file');
        $mainSitemap = view('sitemap.main', [
            'listing_cars_lastmod' => Carbon::now()->format('c'),
            'db_lastmod'           => Carbon::now()->format('c'),
        ])->render();

        file_put_contents(public_path('sitemap.xml'), $mainSitemap);

        switch ($this->option('type')) {
            case 'listing_cars':
            {
                $this->info('Generating listing cars sitemap file...');
                $listingCarsData = $this->generateListedCarsSitemap();
                break;
            }
            case 'cars_database':
                {
                    $this->info('Generating Cars Database sitemap file...');
                    $carsDBData = $this->generateDBSitemap();
                }

                return 1;
        }
    }

    /**
     * @return array
     */
    private function generateListedCarsSitemap(): array
    {
        # Get all Listed cars
        $listingCarsData = [];

        ListingItem::typeCars()->get()->each(function ($item) use (&$listingCarsData) {
            $listingCarsData[] = [
                'loc'        => $item->links->item,
                'lastmod'    => $item->created_at->format('c'),
                'changefreq' => 'daily',
                'priority'   => 0.9,
            ];

            $viewData = view('sitemap.listing_cars', [
                'urls' => $listingCarsData,
            ])->render();

            file_put_contents(public_path('listing-items-cars-sitemap.xml'), $viewData);
        });
        return $listingCarsData;
    }

    /**
     * @return array
     */
    private function generateDBSitemap(): array
    {
        # Get all Database Cars
        $carsDBData = [];

        Car::all()->each(function ($item) use (&$carsDBData) {
            $carsDBData[] = [
                'loc'        => route('database.cars.trim', [
                    'make_slug'   => $item->make_slug,
                    'model_slug'  => $item->model_slug,
                    'series_slug' => $item->series_slug,
                    'trim'        => $item->trim_slug,
                ]),
                'lastmod'    => Carbon::now()->format('c'),
                'changefreq' => 'weekly',
                'priority'   => 0.5,
            ];

            $viewData = view('sitemap.cars_database', [
                'urls' => $carsDBData,
            ])->render();

            file_put_contents(public_path('database-sitemap.xml'), $viewData);
        });
        return $carsDBData;
    }

}
