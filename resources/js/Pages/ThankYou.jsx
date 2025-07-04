import PageContainer from '@/Layouts/PageContainer'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'

export default function ThankYou ({ title, packages = [] }) {
    const { lang } = useContext(AppContext)
    return <PageContainer title={lang(title)}>
        <p className={'max-w-2xl text-xl mb-16 select-none text-center mx-auto italic'}>Thank you, every single one of you, who wrote or contributed to these packages and made <i>mecarshop.com</i> along with
            plenty of other
            websites
            available.</p>
        <ul className={'xl:columns-4 md:columns-2 list-none dark:text-neutral-400 md:text-left md:rtl:text-right text-center'}>{
            packages.map(_package => <li className={'my-2'}>
                {_package}
            </li>)
        }</ul>
    </PageContainer>
}
