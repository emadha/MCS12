import PageContainer from '@/Layouts/PageContainer'
import { usePage } from '@inertiajs/react'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'

export default function Support ({ title }) {
  const { lang } = useContext(AppContext)

  return <PageContainer title={lang(title)}>Support</PageContainer>
}