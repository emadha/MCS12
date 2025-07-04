import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/AppContext'
import TextInput from '@/Components/Form/TextInput'

export default function GooglePlacesInput ({ className, children }) {
  const [query, setQuery] = useState('')
  const { api } = useContext(AppContext)
  useEffect(() => {
    api.post('/api/places', { q: query })
  }, [query])

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  return <div className={'max-w-2xl mx-auto pt-16'}>
    <TextInput
      clearable={true}
      placeholder={'Search for Location...'}
      defaultValue={query}
      handleChange={handleChange}/>
  </div>
}