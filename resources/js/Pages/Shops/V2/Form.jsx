import React, { useContext, useState } from 'react'
import ShopFormInitialStep from '@/Pages/Shops/ShopFormSteps/ShopFormInitialStep'
import PageContainer from '@/Layouts/PageContainer'
import { AppContext } from '@/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

export default function Form ({}) {
    const { lang } = useContext(AppContext)
    const [steps, setSteps] = useState([
        {
            label: 'Step 1',
        },
        {
            label: 'Step 2',
        }, {
            label: 'Step 3',
        }, {
            label: 'Step 4',
        },
    ])
    return <PageContainer title={lang('Create a new Shop')} className={'!max-w-4xl'}>
        <ShopFormInitialStep/>
        <div className={'flex space-x-2 w-full items-center justify-center my-10'}>
            {steps.map(step => <FontAwesomeIcon
                className={'hover:opacity-100 hover:text-xs opacity-20 transition-all cursor-pointer'}
                size={'2xs'}
                icon={faCircle}/>)}
        </div>
    </PageContainer>
}
