import React, { useEffect, useState } from 'react'
import PageContainer from '@/Layouts/PageContainer'
import { LineChart } from '@mui/x-charts'
import { Link } from '@inertiajs/react'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'

export default function Stats ({ title, shop = null, stats = [] }) {

    const [totalViews, setTotalViews] = useState(0)
    const [totalLoggedInViews, setTotalLoggedInViews] = useState(0)
    const [totalNonLoggedInViews, setTotalNonLoggedInViews] = useState(0)

    useEffect(() => {
        setTotalLoggedInViews(0)
        setTotalNonLoggedInViews(0)
        setTotalViews(0)
        stats.data?.length && stats.data.map((f, i) => {
            setTotalLoggedInViews(prevState => parseInt(prevState) + parseInt(f.views_auth) ?? 0)
            setTotalNonLoggedInViews(prevState => parseInt(prevState) + parseInt(f.views_not_auth) ?? 0)
            setTotalViews(prevState => parseInt(prevState) + parseInt(f.views_total) ?? 0)
        })
    }, [])

    const StatBlock = ({ title, sub_title, value }) => <div className={'w-1/3 my-10 flex'}>
        <div className={'flex items-center flex-wrap rounded-xl justify-center p-10 select-none duration-500'}>
            <div className={'w-full text-center my-5'}>
                <h2 className={'font-black italic m-0 mb-5 p-0 w-full'}>{title}</h2>
                <p className={'text-xs'}>{sub_title}</p>
            </div>
            <div className={'font-black xl:text-8xl lg:text-7xl text-4xl w-full text-center drop-shadow'}>
                {Intl.NumberFormat('en', { notation: 'compact' }).format(value)}
            </div>
        </div>
    </div>

    const valueFormatter = (value) => Intl.NumberFormat('en', { natation: 'compact' }).format(value)

    return <PageContainer title={title} subtitle={'Showing visitor stats for the current month'}>
        <div className={'w-full content-stretch flex flex-wrap items-stretch justify-center'}>

            <StatBlock title={'Logged in'}
                       sub_title={'Total number of visitors from users who were logged in.'}
                       value={totalLoggedInViews}/>

            <StatBlock title={'Non-Logged'}
                       sub_title={'Total number of visitors from users who were not logged in.'}
                       value={totalNonLoggedInViews}/>

            <StatBlock title={'Total'}
                       sub_title={'Total number of views'}
                       value={totalViews}/>
        </div>
        <div>
            <div className={'flex items-center justify-center flex-wrap gap-x-2'}>
                <SecondaryButton size={'xs'}>Year</SecondaryButton>
                <SecondaryButton size={'xs'}>Month</SecondaryButton>
                <SecondaryButton size={'xs'}>Week</SecondaryButton>
                <SecondaryButton size={'xs'}>Day</SecondaryButton>
            </div>
            <div>
                <LineChart skipAnimation={false}
                           grid={{ horizontal: true, vertical: true }}
                           xAxis={[
                               {
                                   id: 'barCategories',
                                   data: Object.values(stats.data).map(v => new Date(v.date)),
                                   scaleType: 'utc',
                               },
                           ]}
                           yAxis={[
                               { id: 'ok', min: -2 },
                           ]}
                           series={[
                               {
                                   data: Object.values(stats.data).map(v => v.views_not_auth),
                                   label: 'Not logged in',
                                   valueFormatter,
                               },
                               {
                                   data: Object.values(stats.data).map(v => v.views_auth),
                                   label: 'Logged in',
                                   valueFormatter,
                               },
                               {
                                   data: Object.values(stats.data).map(v => v.views_total),
                                   label: 'Total',
                                   curve: '',
                                   valueFormatter,
                               },
                           ]}
                           height={300}
                />
            </div>
        </div>

        <div className={'rounded-xl shadow p-5 m-10 dark:bg-neutral-800/30 dark:text-white'}>
            <table className={'table w-full text-left text-sm'}>
                <thead>
                <tr className={'select-none'}>
                    <th className={'pb-10 font-black'}>Views (Not Logged in)</th>
                    <th className={'pb-10 font-black'}>Views (Logged In)</th>
                    <th className={'pb-10 font-black'}>Views Total</th>
                    <th className={'pb-10 font-black'}>Date</th>
                </tr>
                </thead>
                <tbody>
                {Object.values(stats.data).map((stat, i) =>
                    <Link
                        href={route('shop.single.stats.single', { shop_frontend_page: shop.id, date: stat.date })}
                        as={'tr'} key={i}
                        className={'hover:bg-neutral-200/10 transition-all cursor-pointer'}>
                        <td className={'p-2'}>{stat.views_not_auth}</td>
                        <td>{stat.views_auth}</td>
                        <td>{stat.views_total}</td>
                        <td>{stat.date}</td>
                    </Link>,
                )}
                </tbody>
            </table>
        </div>

    </PageContainer>
}
