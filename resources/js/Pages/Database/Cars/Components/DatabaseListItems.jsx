import { useContext, useState } from 'react'
import { AppContext } from '@/AppContext'

export default function DatabaseListItems ({
    afterTitle, title, data,
    itemKey = '',
    backHref, breadcrumbs = [],
    children,
}) {
    const { lang } = useContext(AppContext)

    const [loadedData, setLoadedData] = useState(data?.data ?? [])

    const groupedData = loadedData?.reduce((acc, item) => {
        const firstLetter = item[itemKey][0].toUpperCase()
        acc[firstLetter] = acc[firstLetter] || []
        acc[firstLetter].push(item)
        return acc
    }, {})

    const GO_BACK_TEXT = lang('Go Back')
    const filter = (e) => {

        if (loadedData && e.target.value.trim()) {
            setLoadedData(data.filter(f => f.make.toLowerCase().includes(e.target.value.toLowerCase())))
        } else {
            setLoadedData(data)
        }

    }

    return <div className={'flex flex-wrap w-full'}>

        <div className={'w-full flex flex-wrap justify-between'}>
            {loadedData && Object.entries(loadedData).map(([letter, items]) => (
                <div key={letter + itemKey} className={'w-1/6'}>
                    <h3 className={'select-none'}>{letter}</h3>
                    <ul className={'p-0'}>
                        {children}
                    </ul>
                </div>
            ))}
        </div>
    </div>
}
