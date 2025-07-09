import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../resources/css/leaflet-custom.css';
import Loading from "@/Components/Loading.jsx";
import L from 'leaflet';
import axios from 'axios';

// Note: Using Nominatim geocoding service which has usage policy:
// - Maximum 1 request per second
// - Set a meaningful User-Agent identifying your application
// - For heavy usage, consider setting up your own instance or using a commercial provider
// Fix for marker icons in Leaflet with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Simple throttle function to limit API calls
function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// Component to handle map events and interactions
function MapController({
                           handleOnClick,
                           setGeoLocation,
                           setGeoLocationMessage,
                           setLoadingGeoLocation,
                           setLocationText,
                           setMarkerPosition
                       }) {
    const map = useMap();

    useEffect(() => {
        // Get user's location on component mount
        navigator?.geolocation.getCurrentPosition(
            ({coords: {latitude: lat, longitude: lng}}) => {
                if (lat && lng) {
                    map.setView([lat, lng], 15);
                }
            },
            () => {
                // Default view if geolocation fails
                map.setView([0, 0], 2);
            }
        );
    }, [map]);

    useEffect(() => {
        // Add click handler to map with throttling to respect Nominatim usage policy
        const handleMapClick = throttle(async (e) => {
            const {lat, lng} = e.latlng;

            setLoadingGeoLocation(true);
            setGeoLocationMessage('Loading');

            // Update marker position immediately on click
            setMarkerPosition([lat, lng]);

            try {
                // Use our server-side proxy to avoid CORS issues
                const response = await axios.get(route('api.geocode.reverse', {
                    lat: lat,
                    lon: lng,
                    zoom: 18,
                    addressdetails: 1
                }));

                if (response.data) {
                    const locationData = {
                        formatted_address: response.data.display_name,
                        geometry: {
                            location: {
                                lat: parseFloat(lat),
                                lng: parseFloat(lng)
                            }
                        },
                        address_components: response.data.address
                    };

                    // Create an array similar to the previous implementation to maintain compatibility
                    const responseData = [locationData];

                    handleOnClick(responseData);
                    setGeoLocation(locationData);
                    setLocationText(locationData.formatted_address);
                }
            } catch (error) {
                console.error('Error fetching location data:', error);
                setGeoLocationMessage('Failed to load location data');
                setLocationText(null);
                setError('Error: Could not retrieve location information. Please try again.');
            } finally {
                setLoadingGeoLocation(false);
            }
        }, 1000); // Throttle to 1 request per second to follow Nominatim usage policy

        // Attach the click handler to the map
        map.on('click', handleMapClick);

        // Clean up event listener when component unmounts
        return () => {
            map.off('click', handleMapClick);
        };
    }, [map, handleOnClick, setGeoLocation, setGeoLocationMessage, setLoadingGeoLocation, setLocationText, setMarkerPosition]);

    return null;
}

export default function LeafletMapComponent({
                                                handleOnClick = () => {
                                                },
                                                setGeoLocationMessage = () => {
                                                },
                                                setGeoLocation = () => {
                                                },
                                                initialLocation = null
                                            }) {
    const [loadingGeoLocation, setLoadingGeoLocation] = useState(false);
    const [locationText, setLocationText] = useState('');
    const [markerPosition, setMarkerPosition] = useState(initialLocation);
    const [isMapReady, setIsMapReady] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Set map as ready when component mounts
        setIsMapReady(true);

        // If initialLocation is provided, use it
        if (initialLocation) {
            setMarkerPosition(initialLocation);
            return;
        }

        // Otherwise get user's location
        setLoadingGeoLocation(true);
        navigator?.geolocation.getCurrentPosition(
            ({coords: {latitude: lat, longitude: lng}}) => {
                if (lat && lng) {
                    setMarkerPosition([lat, lng]);
                    // Optionally fetch address for initial position
                    fetchLocationAddress(lat, lng);
                }
                setLoadingGeoLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setError('Could not access your location. Please allow location access or click on the map to select a location.');
                setLoadingGeoLocation(false);
            }
        );
    }, [initialLocation]);

    // Function to fetch address for a given location
    const fetchLocationAddress = async (lat, lng) => {
        try {
            const response = await axios.get(
                route('api.geocode.reverse', {
                    lat: lat,
                    lon: lng,
                    zoom: 18,
                    addressdetails: 1
                })
            );

            if (response.data) {
                setLocationText(response.data.display_name);
            }
        } catch (error) {
            console.error('Error fetching initial location data:', error);
        }
    };


    if (!isMapReady) {
        return <Loading/>;
    }

    // Show a loading indicator while fetching location
    const renderLocationDisplay = () => {
        if (loadingGeoLocation) {
            return (
                <div className="flex items-center justify-center gap-2">
                    <div
                        className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent"></div>
                    <span>Loading location data...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-red-500">
                    {error}
                </div>
            );
        }

        return (
            <div className="break-words" title={locationText}>
                {locationText || 'Click on the map to select a location'}
            </div>
        );
    };

    return (
        <div className={'leaflet-map-wrapper'}>
            <div
                className={'select-none min-h-10 px-4 py-2 border dark:border-neutral-600 dark:bg-neutral-700 bg-neutral-100 rounded mb-2 transition-all'}>
                {renderLocationDisplay()}
            </div>

            <div className="leaflet-container shadow-lg rounded-lg overflow-hidden"
                 style={{height: '650px', width: '100%'}}>
                <MapContainer
                    center={[0, 0]}
                    zoom={2}
                    style={{height: '100%', width: '100%'}}
                    scrollWheelZoom={true}
                    zoomControl={true}
                    attributionControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapController
                        handleOnClick={handleOnClick}
                        setGeoLocation={setGeoLocation}
                        setGeoLocationMessage={setGeoLocationMessage}
                        setLoadingGeoLocation={setLoadingGeoLocation}
                        setLocationText={setLocationText}
                        setMarkerPosition={setMarkerPosition}
                    />

                    {markerPosition && (
                        <Marker position={markerPosition}>
                            <Popup className="custom-popup">
                                <div className="font-medium text-base mb-1">Selected Location</div>
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                    <span className="font-medium">Latitude:</span>
                                    <span>{markerPosition[0].toFixed(6)}</span>
                                    <span className="font-medium">Longitude:</span>
                                    <span>{markerPosition[1].toFixed(6)}</span>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
