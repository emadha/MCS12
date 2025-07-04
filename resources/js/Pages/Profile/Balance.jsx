import PageContainer from '@/Layouts/PageContainer'
import Field from '@/Components/Form/Field'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { faAdd, faFileCsv, faFilePdf, faGift } from '@fortawesome/free-solid-svg-icons'
import AppLink from '@/Components/AppLink'

import { useContext, useState } from 'react'
import { AppContext } from '@/AppContext'
import { Head, Link } from '@inertiajs/react'
import Hr from '@/Components/Hr'

export default function Balance({ title, balance }) {
    const { lang, rtl } = useContext(AppContext)
    const [isLoaded, setIsLoaded] = useState(false)
    return <PageContainer title={lang('Your Balance')} className={''}>

        <Head title={lang('Your Balance')}/>

        <Field legendClassName={'px-5 font-extrabold'} className={''}>
            <table className={'w-full table text-left'}>
                <thead>
                <tr>
                    <th colSpan={5} className={'px-5'}>
                        <div className={'flex justify-between w-full py-5'}>

              <span>{lang('Balance')} <strong className={'text-purple-500'}>
                {balance.sum ?? 0}</strong> {lang(balance.sum > 1 ? 'Point' : 'Points')}
              </span>

                            <div className={'flex space-x-2 items-center justify-end divide-x divide-neutral-700'}>
                                <div className={'flex gap-x-2'}>
                                    <AppLink href={route('balance.add')} icon={faAdd}>Add Credits</AppLink>
                                    <AppLink href={route('balance.redeem')} icon={faGift}>Redeem Code</AppLink>
                                </div>

                                <div className={'px-2 flex gap-x-2'}>
                                    <PrimaryButton icon={faFileCsv}>CSV</PrimaryButton>
                                    <PrimaryButton icon={faFilePdf}>PDF</PrimaryButton>
                                </div>
                            </div>

                        </div>
                    </th>
                </tr>
                <tr>
                    <th className={'p-5 select-none ' + (rtl ? 'text-right' : 'text-left')}>#</th>
                    <th className={'w-min ' + (rtl ? 'text-right' : 'text-left')}>{lang('Note')}</th>
                    <th className={'w-min ' + (rtl ? 'text-right' : 'text-left')}>{lang('Item')}</th>
                    <th className={'w-min ' + (rtl ? 'text-left' : 'text-right')}>{lang('Amount')}</th>
                    <th className={'w-min px-5 ' + (rtl ? 'text-left' : 'text-right')}>{lang('Date')}</th>
                </tr>
                </thead>
                <tbody>
                {balance.data.data.map(credit => <tr className={'dark:odd:bg-neutral-900 hover:bg-black/10'}>
                    <td className={'py-2 px-5 select-none ' + (rtl ? 'text-right' : 'text-left')}>{credit.id}</td>
                    <td className={'' + (rtl ? 'text-right' : 'text-left')}>
                        <span>{lang(credit.note)}</span>
                    </td>
                    <td className={'text-sm ' + (rtl ? 'text-right' : 'text-left')}>
                        {credit.target_text
                            ? credit.target_link
                                ? <AppLink className={'text-blue-800 dark:text-blue-500 hover:!text-blue-400 transition-all'}
                                           href={credit.target_link}>{credit.target_text}</AppLink>
                                : <span className={'select-none dark:text-neutral-600 line-through'}>{credit.target_text}</span>
                            : <>-</>
                        }
                    </td>
                    <td className={'w-min ' + (rtl ? 'text-left' : 'text-right')}>
                        <span dir={'ltr '} className={(parseInt(credit.amount) > 0 ? ' text-lime-600 ' : ' text-red-400 ')}>{credit.amount}</span>
                    </td>
                    <td className={'px-5 w-min whitespace-nowrap ' + (rtl ? 'text-left' : 'text-right')}>{credit.created_at}</td>
                </tr>)}
                </tbody>
            </table>

        </Field>
        <Hr className={'!my-12'}/>
        {balance.data?.meta.last_page > 1 ? <div
            className={'flex select-none flex-wrap justify-center my-5 items-center space-x-0.5 text-center'}>

            {balance.data.meta.links && balance.data.meta.links.map(link => <Link
                key={'l_' + link.label}
                href={link.url}
                preserveScroll={true}
                className={'px-5 py-2 transition-all ' + ' rounded text-sm whitespace-nowrap' +
                    (link.active ? ' active bg-red-500 dark:bg-red-800 text-white ' : ' dark:hover:bg-neutral-700 hover:bg-neutral-200' + ' disabled:!bg-transparent disabled:opacity-10')}

                dangerouslySetInnerHTML={{ __html: lang(link.label) }}/>)}
            <div className={'mx-auto p-10 text-xs text-center dark:text-neutral-600 text-neutral-400'}>
                {lang('Found a total of ')} {balance.data.meta?.total} {lang('item(s)')}
            </div>
        </div> : <></>}
    </PageContainer>
}
