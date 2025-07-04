import React from 'react'
import PageContainer from '@/Layouts/PageContainer'
import { Link } from '@inertiajs/react'

export default function Index ({ className }) {
    return <PageContainer title={'Mecarshop Database Index'}>
        <div className={'flex items-center justify-center min-h-32 select-none'}>
            Currently, only <Link className={'mx-2 font-black text-red-500 underline'} href={route('database.cars.index')}>Cars Database</Link> is available.
        </div>
    </PageContainer>
}
