import TextInput from '@/Components/Form/TextInput'
import { useContext, useState } from 'react'
import { faCar } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '@/AppContext'

export default function CarSearchInput ( { className, children, handleChange } ) {

  const [ result, setResults ] = useState( [] )
  const { fn }                 = useContext( AppContext )
  const onChange               = () => {
    
  }

  return <>
    <TextInput placeholder={ 'Search for car...' }
               handleChange={ e => handleChange ?? fn.baseCarSearch( e.target.value ) }
               icon={ faCar }
               isLoading={ true }/>
  </>
}