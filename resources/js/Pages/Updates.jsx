import PageContainer from '@/Layouts/PageContainer'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'

export default function Updates ({ title }) {
  const { lang } = useContext(AppContext)

  return <PageContainer title={lang(title)}>

  </PageContainer>
}