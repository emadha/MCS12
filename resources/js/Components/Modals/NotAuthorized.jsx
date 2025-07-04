import { useContext } from 'react'
import { AppContext } from '@/AppContext'
import LoginComponent from '@/Components/LoginComponent'

export default function NotAuthorized ({ className }) {

    const { lang } = useContext(AppContext)

    return <>
        <div className={'text-center dark:text-white'}>
            {lang('NOT_AUTHORIZED_MSG')}
        </div>

        <div className={'py-7 px-0'}><LoginComponent/></div>
    </>
}
