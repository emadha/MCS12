export default function DaysOfWeekCheckBoxes ({ days }) {

  const daysReadable = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday']

  return <div className={'flex space-x-0.5 w-full'}>

    {daysReadable.map((readable, key) =>
      <div key={key} className={'w-4 h-4 inline-block aspect-square rounded-sm ' +
        (days.includes(key) ? 'bg-lime-400' : 'bg-lime-400/10')} title={readable}></div>,
    )}
  </div>
}