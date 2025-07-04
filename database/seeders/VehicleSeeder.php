<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vehicles = [
            [
                'make' => 'Toyota',
                'model' => 'Camry',
                'year' => 2022,
                'price' => 28999.99,
                'vin' => 'JT2BF22K1W0123456',
                'color' => 'Silver',
                'transmission' => 'automatic',
                'mileage' => 15000,
                'description' => 'Well-maintained Toyota Camry with low mileage. Features include backup camera, Bluetooth connectivity, and power windows.',
                'status' => 'available',
            ],
            [
                'make' => 'Honda',
                'model' => 'Civic',
                'year' => 2021,
                'price' => 24500.00,
                'vin' => '2HGFC2F50MH567890',
                'color' => 'Blue',
                'transmission' => 'cvt',
                'mileage' => 22000,
                'description' => 'Fuel-efficient Honda Civic in excellent condition. Includes Honda Sensing safety features, Apple CarPlay, and Android Auto.',
                'status' => 'available',
            ],
            [
                'make' => 'Ford',
                'model' => 'F-150',
                'year' => 2020,
                'price' => 39995.00,
                'vin' => '1FTEW1EP7LFA12345',
                'color' => 'Black',
                'transmission' => 'automatic',
                'mileage' => 35000,
                'description' => 'Powerful Ford F-150 with towing package. Features include leather seats, navigation, and premium sound system.',
                'status' => 'available',
            ],
            [
                'make' => 'Tesla',
                'model' => 'Model 3',
                'year' => 2023,
                'price' => 52990.00,
                'vin' => '5YJ3E1EA1PF123456',
                'color' => 'White',
                'transmission' => 'automatic',
                'mileage' => 5000,
                'description' => 'Almost new Tesla Model 3 Long Range with Autopilot. Includes premium interior and sound system.',
                'status' => 'available',
            ],
            [
                'make' => 'Chevrolet',
                'model' => 'Equinox',
                'year' => 2021,
                'price' => 27500.00,
                'vin' => '2GNAXUEV3M6789012',
                'color' => 'Red',
                'transmission' => 'automatic',
                'mileage' => 28000,
                'description' => 'Spacious Chevrolet Equinox SUV with excellent fuel economy. Features include backup camera and Android Auto.',
                'status' => 'reserved',
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::create($vehicle);
        }
    }
}
