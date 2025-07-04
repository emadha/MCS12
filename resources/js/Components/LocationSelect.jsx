import React, { useContext, useState } from 'react'
import InputError from '@/Components/Form/InputError'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { AppContext } from '@/AppContext'

export default function LocationSelect ({
    className, locations = [], rootLocation = [],
    setRootLocation = () => {},
}) {

    const { lang } = useContext(AppContext)
    const [locations, setLocations] = useState(locations.length ?? [])
    const [selectedLocation, setSelectedLocation] = useState(locations[0])

    return <div className={'pl-10 rtl:pr-10 rtl-pl-0'} title={lang('Location')}>
        <i>{lang('Your shop will be located in these main locations.')}</i>
        <div className={'flex flex-wrap justify-start w-full mx-auto mt-10 rounded'}>
            {locations.map((_location, k) =>
                <div className={'sm:w-1/2 w-full p-1 max-w-xs'}>
                    <SecondaryButton
                        key={_location.id}
                        selected={data.location.id == predefined_location.id}
                        className={'w-full'}
                        onClick={e => setData('location', _location) || clearErrors('predefined_location')}
                    >
                        <FontAwesomeIcon icon={faCheckCircle}
                                         className={'mx-2 ' + (data.location.id === _location.id ? 'opacity-100 animate-pop-in-lg' : 'opacity-0')}/>
                        {lang(_location.name)}
                    </SecondaryButton>
                </div>)
            }
        </div>

        <InputError message={errors.location} className={'mt-2'}/>
    </div>

}
