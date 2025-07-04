import React, { useContext, useState } from 'react'
import { Link } from '@inertiajs/react'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import { faBackspace } from '@fortawesome/free-solid-svg-icons'
import TextInput from '@/Components/Form/TextInput'
import { AppContext } from '@/AppContext'
import PageContainer from '@/Layouts/PageContainer'

export default function CarDbLayout ({
    className, title, data = [],
    breadcrumbs = [], backHref, afterTitle, children,
}) {
    const { lang } = useContext(AppContext)
    const [loadedData, setLoadedData] = useState(data)

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

    const GO_BAC_TEXT = ''

    return <PageContainer title={title ?? 'Car Database'}>
        <div className={'w-full flex justify-between items-center'}>
            <div>
                <h3 className={'m-0'}>{lang(title)}</h3>

                <div className={'flex gap-x-2 mb-5'}>
                    {breadcrumbs.map((breadcrumb, i) => <div className={'select-none'}>
                        <div className={'flex gap-x-1 items-center'}>
                            {breadcrumb.link
                                ? <Link href={breadcrumb.link} className={'font-bold px-2 rounded bg-neutral-100'}>
                                    {breadcrumb.label}
                                </Link>
                                : <span>{breadcrumb.label}</span>}
                        </div>
                    </div>)}
                </div>

                <SecondaryButton icon={faBackspace}>
                    {backHref ? <Link href={backHref}>{GO_BACK_TEXT}</Link> : <>{GO_BACK_TEXT}</>}
                </SecondaryButton>

                {afterTitle}
            </div>
            <div className={'w-2/5'}>
                <TextInput isFocused={true} className={''} handleChange={filter} placeholder={lang('Search for cars here...')}/>
            </div>
        </div>
        <div>
            {children}
        </div>
    </PageContainer>
}
