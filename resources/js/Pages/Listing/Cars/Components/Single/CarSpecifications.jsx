import { useContext } from 'react'
import { AppContext } from '@/AppContext'
import ListingBlockBase from '@/Pages/Listing/Components/ListingBlockBase'

export default function CarSpecifications ({ className, specifications = [] }) {
    const { lang } = useContext(AppContext)

    return <div className={'w-full' + (className ? ' ' + className : '')}>
        <ListingBlockBase className={'pt-0'} title={lang('Specifications')}>
            {Object.values(specifications).length ? Object.values(specifications).map((specification, i) =>
                <div className={'flex justify-between py-2 odd:dark:bg-neutral-900/50 odd:bg-neutral-100 px-2 rounded'} key={i}>
                    <span className={'text-start opacity-70 select-none text-xs'}>{lang(Object.keys(specifications)[i])}</span>
                    <span className={'text-end dark:text-white text-sm'}>{lang(specification)}</span>
                </div>) : <>Non</>
            }
        </ListingBlockBase>
    </div>
}
