import InputLabel from '@/Components/Form/InputLabel'

export default function Checkbox ( { label, id, name, value, handleChange } ) {
  return <InputLabel forInput={ id }>
    <input
      type="checkbox"
      id={ id }
      name={ name }
      value={ value }
      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
      onChange={ ( e ) => handleChange( e ) }
    />
    <span className={ 'mx-2' }>{ label }</span>
  </InputLabel>
}
