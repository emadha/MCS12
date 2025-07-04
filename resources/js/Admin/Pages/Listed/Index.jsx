import React, { useContext, useEffect } from 'react'
import { AdminContext } from '@/AdminContext'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Inertia } from '@inertiajs/inertia'

export default function Index ({ title, listingItems = [] }) {
    const { titleOptions, setTitleOptions } = useContext(AdminContext)

    useEffect(() => {
        setTitleOptions(prevState => [
            { title: 'Create Listing Item', icon: faPlus, onClick: () => Inertia.visit('/') },
            { title: 'Delete All' },
        ])
    }, [])

    return <>
        <div className={'px-5'}>
            <p>Found {listingItems.total} items</p>
            {listingItems.data.length ? listingItems.data.map(item => <>
                {item.id}
            </>) : <></>}
        </div>
    </>
}
