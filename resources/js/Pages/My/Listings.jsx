import React from 'react'
import PageContainer from '@/Layouts/PageContainer'
import Field from '@/Components/Form/Field'
import ListingItemCarBlock from '@/Components/Listing/ListingItemCarBlock'

export default function Listings ({ title, cars = [] }) {
    return <PageContainer title={title}>
        <div>
            <Field title={'Listings (' + cars.data.length ?? '0' + ')'}>
                <div className={'flex flex-wrap'}>
                    {cars.data.map(item => <ListingItemCarBlock item={item} className={'lg:w-1/4 sm:w-1/2 w-full'}/>)}
                </div>
            </Field>
        </div>
    </PageContainer>
}
