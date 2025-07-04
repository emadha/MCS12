import { useState } from 'react'

export default function DateRangePicker ( { className, children } ) {
  const [ yearStart, setYearStart ] = useState( null )
  const [ yearEnd, setYearEnd ]     = useState( null )
  return <div>
    <div className={'border p-2'}></div>
  </div>
}