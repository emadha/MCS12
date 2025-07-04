import React from 'react'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'

export default function Sitemap ({ className }) {
    return <>
        <div className={'flex gap-x-5 justify-center items-center'}>
            <PrimaryButton icon={faRefresh}>Create/Refresh All Sitemaps</PrimaryButton>
            <PrimaryButton icon={faRefresh}>Create/Refresh Listing Sitemap</PrimaryButton>
            <PrimaryButton icon={faRefresh}>Create/Refresh Cars Database Sitemap</PrimaryButton>
        </div>
    </>
}
