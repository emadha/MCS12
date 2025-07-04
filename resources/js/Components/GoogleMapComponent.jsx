import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import { createRef, useCallback, useRef, useState } from 'react'

export default function GoogleMapComponent ({
    api, handleOnClick,
    geoLocationMessage, setGeoLocationMessage = () => {},
    geoLocation, setGeoLocation = () => {},
}) {

    let marker

    const [loadingGeoLocation, setLoadingGeoLocation] = useState(false)
    const [locationText, setLocationText] = useState('')
    const { isLoaded } = useJsApiLoader(
        {
            id: 'google-map-script',
            googleMapsApiKey: 'AIzaSyDyyhCzqt9QblWMhRCc5Nmv8-VsModYEnM',
        })

    const [map, setMap] = useState(null)
    const [position, setPosition] = useState(null)
    const mapTextRef = useRef()
    const onLoad = useCallback(function callback (map) {

        navigator?.geolocation.getCurrentPosition(
            ({ coords: { latitude: lat, longitude: lng } }) => {
                if (lat && lng) {
                    const pos = { lat, lng }
                    map.setCenter(pos)
                }
            }, () => {
                map.setCenter({ lat: 0, lng: 0 })
            },
        )

        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        map.addListener('click', function (e) {
            let latLngString = [e.latLng.lat(), e.latLng.lng()].join(',')
            placeMarker(e.latLng, map)
            setPosition(e.latLng)

            setGeoLocation(() => {
                setLoadingGeoLocation(true)
                setGeoLocationMessage('Loading')

                return axios.post(route('geocode', { 'latlng': latLngString })).then(res => {
                    handleOnClick(res.data)
                    setGeoLocation(() => res.data[0])
                    setLoadingGeoLocation(false)
                    setGeoLocationMessage('')

                    if (res.data) {
                        setLocationText(res.data[0].formatted_address)
                    }
                })

            })
        })

        setMap(map)
    }, [])

    function placeMarker (position, map) {
        if (marker) {
            return marker.setPosition(position)
        }

        marker = new google.maps.Marker({
            position: position,
            map: map,
        })
    }

    const onUnmount = useCallback(function callback (map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <div className={''}>
            <div className={'select-none py-2 px-4 border dark:border-neutral-600 dark:bg-neutral-700 bg-neutral-100 rounded mb-2'}>
                {loadingGeoLocation ?
                    <div className={''}>
                        Loading
                    </div> :
                    <div className={''}>
                        {locationText}
                    </div>
                }
            </div>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '650px' }}
                zoom={15}
                mapContainerClassName={'w-full'}
                onLoad={onLoad}
                onUnmount={onUnmount}>
                { /* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
        </div>
    ) : <></>
}
