import { Link } from '@inertiajs/react'
import PageContainer from '@/Layouts/PageContainer'
import Hr from '@/Components/Hr'
import TextInput from '@/Components/Form/TextInput'
import { useContext, useState } from 'react'
import { AppContext } from '@/AppContext'

export default function ByMakeAndYearAndModelAndSeries ({ title, data = [] }) {
    const { lang } = useContext(AppContext)
    const [loadedData, setLoadedData] = useState(data?.data ?? [])

    const groupedData = loadedData?.reduce((acc, item) => {
        const firstLetter = item.trim[0].toUpperCase()
        acc[firstLetter] = acc[firstLetter] || []
        acc[firstLetter].push(item)
        return acc
    }, {})

    const GO_BACK_TEXT = lang('Go Back')
    const filter = (e) => {

        if (loadedData && e.target.value.trim()) {
            setLoadedData(data?.data.filter(f => f.trim.toLowerCase().includes(e.target.value.toLowerCase())))
        } else {
            setLoadedData(data.data ?? [])
        }

    }

    return <PageContainer title={title}>
        <div className={'flex items-center justify-between mb-7 select-none'}>
            <div className={'w-3/5'}>
                <small>Here you can find all our stock cars specification database, there are {data.length} makes available.</small>
            </div>
            <div className={'w-2/5'}>
                <TextInput isFocused={true} className={''} handleChange={filter} placeholder={lang('Search for cars here...')}/>
            </div>
        </div>

        <Hr/>

        <h2 className={'select-none'}>Select car <strong>year</strong></h2>
        <div className={'flex flex-wrap'}>
            {Object.entries(groupedData).map(([letter, items]) => (
                <div key={letter} className={'w-1/6 block'}>
                    <h3 className={'select-none'}>{letter}</h3>
                    <ul className={'p-0'}>
                        {items.map(item => (
                            <li key={item.model_slug} className={'list-none'}>
                                <Link href={route('database.cars.trim', [item.make_slug, item.year, item.model_slug, item.series_slug, item.trim_slug])}
                                      className={'hover:font-bold opacity-60 hover:opacity-100 block dark:text-white'}>
                                    {item.trim}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </PageContainer>
}
