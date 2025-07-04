import PageContainer from '@/Layouts/PageContainer'
import LoginComponent from '@/Components/LoginComponent'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'

export default function Login ({ status, canResetPassword, title }) {
  const { lang } = useContext(AppContext)

  return <PageContainer
    className={'mx-auto shadow-sm p-10 max-w-xl px-12 bg-neutral-50 dark:bg-neutral-800/20 rounded'}
    title={lang(title)}>
    <LoginComponent status={status} canResetPassword={canResetPassword}/>

  </PageContainer>
}
