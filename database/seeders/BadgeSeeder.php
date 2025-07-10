<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badges = [
            [
                'name' => 'Authorized Dealer',
                'description' => 'This badge identifies officially authorized dealers recognized by manufacturers',
                'icon' => 'badge-authorized-dealer',
                'type' => 'verification',
                'level' => 2,
                'requirements' => json_encode([
                    'document_verification' => true,
                    'manufacturer_approval' => true
                ]),
                'status' => true,
                'points' => 50,
                'metadata' => json_encode([
                    'display_color' => '#007bff',
                    'priority' => 'high'
                ])
            ],
            [
                'name' => 'ISO Certified',
                'description' => 'Businesses that meet International Organization for Standardization requirements',
                'icon' => 'badge-iso-certified',
                'type' => 'certification',
                'level' => 3,
                'requirements' => json_encode([
                    'iso_certificate' => true,
                    'quality_review' => true
                ]),
                'status' => true,
                'points' => 75,
                'metadata' => json_encode([
                    'display_color' => '#28a745',
                    'priority' => 'medium'
                ])
            ],
            [
                'name' => 'Premium Partner',
                'description' => 'Top-tier partners with excellent service history and customer satisfaction',
                'icon' => 'badge-premium-partner',
                'type' => 'achievement',
                'level' => 4,
                'requirements' => json_encode([
                    'service_years' => 2,
                    'rating_minimum' => 4.5,
                    'premium_subscription' => true
                ]),
                'status' => true,
                'points' => 100,
                'metadata' => json_encode([
                    'display_color' => '#ffc107',
                    'priority' => 'highest'
                ])
            ],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}
