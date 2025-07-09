<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodingController extends Controller
{
    /**
     * Proxy requests to Nominatim to avoid CORS issues
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reverseGeocode(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $zoom = $request->query('zoom', 18);
        $addressdetails = $request->query('addressdetails', 1);

        if (!$lat || !$lon) {
            return response()->json(['error' => 'Latitude and longitude are required'], 400);
        }

        try {
            $response = Http::withHeaders([
                'Accept-Language' => 'en',
                'User-Agent' => 'MecarshopApp'
            ])->get('https://nominatim.openstreetmap.org/reverse', [
                'format' => 'json',
                'lat' => $lat,
                'lon' => $lon,
                'zoom' => $zoom,
                'addressdetails' => $addressdetails
            ]);

            return response()->json($response->json());
        } catch (\Exception $e) {
            Log::error('Geocoding error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to get location data'], 500);
        }
    }
}
