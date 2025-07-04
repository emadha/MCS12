<?php

use App\Models\PredefinedLocation;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('predefined_locations', function(Blueprint $table) {
            $table->id();
            $table->string('region', 4);
            $table->string('name');
            $table->string('coordinates')->nullable();
            $table->timestamps();
        });

        $predefinedLocations = [
            'lb' => [
                'Akkar',
                'Baalbek-Hermel',
                'Beirut',
                'Beqaa',
                'Keserwan-Jbeil',
                'Mount Lebanon',
                'Nabatieh',
                'North',
                'South',
            ],
            'ae' => [
                'Dubai',
                'Abu Dhabi',
                'Sharjah',
                'Ajman',
                'Ras Al Khaimah',
                'Fujairah',
                'Umm Al Quwain',
                'Khor Fakkan',
                'Kalba',
                'Madinat Zayed',
                'Dibba Al-Fujairah',
                'Ruwais',
                'Ghayathi',
                'Dhaid',
                'Jebel Ali',
                'Liwa Oasis',
                'Hatta',
                'Ar-Rams',
                'Dibba Al-Hisn',
                'Al Jazirah Al Hamra',
            ],
            'sa' => [
                'Riyadh',
                'Jeddah',
                'Mecca',
                'Medina',
                'Ad Dammām',
                'Al Hufūf',
                'Ḩafr al Bāţin',
                'Al Ḩillah',
                'Aţ Ţā’if',
                'Tabūk',
                'Al Qaţīf',
                'Buraydah',
                'Al Jubayl',
                'Ḩā’il',
                'Al Kharj',
                'Al Qunfudhah',
                'Al Mubarraz',
                'Yanbu',
                'Sakākā',
                'Abhā',
                'Şabyā',
                'Al Khubar',
                'Qal‘at Bīshah',
                '‘Unayzah',
                'Ras Tanura',
                'Al Ḩawīyah',
                'Al Qurayyāt',
                'Ar Rass',
                'Jāzān',
                'Az Zulfī',
                'Sayhāt',
                'Ḩaraḑ',
                'Al Aḩad al Masāriḩah',
                'Khamīs Mushayţ',
                'Ţurayf',
                'Sharūrah',
                'Rafḩā',
                'Najrān',
                'Al Līth',
                'Ad Darb',
                'Ra’s al Khafjī',
                'Badr Ḩunayn',
                'Khulayş',
                'An Nimāş',
                'Al Majāridah',
                'Al Wajh',
                'Al Midhnab',
                'Abqaiq',
                'Al ‘Aqīq',
                'Ḑulay‘ Rashīd',
                'Shaqrā’',
                'Al Mindak',
                'Dhahran',
                'Al ‘Aydābī',
                'Qārā',
                'Ash Shinān',
                'Arar',
                'Ḩaql',
                'Ḑubā',
                'Al Bāḩah',
            ],
        ];

        foreach ($predefinedLocations as $region => $location) {
            foreach ($location as $_location) {
                PredefinedLocation::create([
                    'region' => $region,
                    'name' => $_location,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('predefined_locations');
    }

};
