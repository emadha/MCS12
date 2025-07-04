export default function Types ( { types } ) {
  return <>
    { types.length && types.map( type =>
      <span className={ 'bg-indigo-200 rounded px-1 pb-0.5 text-white' }>
        { type.title }
      </span>
    ) }
  </>
}