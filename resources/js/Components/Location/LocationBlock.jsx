export default function LocationBlock ( { className, location } ) {
  return <div className={ 'bg-white p-10 rounded-lg border shadow' }><h2>Location</h2>
    { location.long }
    { location.lat }
    { location.address }
  </div>
}
