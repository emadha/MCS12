import { Link } from '@inertiajs/react'
import PageContainer from '@/Layouts/PageContainer'
import Hr from '@/Components/Hr'
import TextInput from '@/Components/Form/TextInput'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/AppContext'

export default function By ({ title, data = [] }) {
    const { lang } = useContext(AppContext)
    const [loadedData, setLoadedData] = useState(data?.data ?? [])
    const [lettersCount, setLettersCount] = useState(0)
    const groupedData = loadedData?.reduce((acc, item) => {
        const firstLetter = item.make[0].toUpperCase()
        acc[firstLetter] = acc[firstLetter] || []
        acc[firstLetter].push(item)
        return acc
    }, {})

    const GO_BACK_TEXT = lang('Go Back')
    const filter = (e) => {

        if (loadedData && e.target.value.trim()) {
            setLoadedData(data?.data.filter(f => f.make.toLowerCase().includes(e.target.value.toLowerCase())))
        } else {
            setLoadedData(data.data ?? [])
        }

    }

    useEffect(() => {
        setLettersCount(Object.values(groupedData)?.length ?? 0)
    }, [groupedData])

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

        <h2 className={'select-none'}>Select car <strong>make</strong></h2>
        <div className={'flex flex-wrap'}>
            {Object.entries(groupedData).map(([letter, items]) => (
                <div key={'m_' + letter} className={'text-center lg:text-left md:w-1/3 lg:w-1/5 w-1/2 block ' +
                    (lettersCount <= 1 ? ' !w-full  !text-center ' : '')}>
                    <h3 className={'select-none'}>{letter}</h3>
                    <ul className={'p-0'}>
                        {items.map(item => (
                            <li key={'mm_' + item.make} className={'list-none'}>
                                <Link href={route('database.cars.make', item.make_slug)}
                                      className={'hover:font-bold opacity-60 hover:opacity-100 block dark:text-white'}>{item.make}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </PageContainer>
}
