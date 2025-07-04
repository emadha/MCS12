import ListingContainer from '@/Components/Listing/ListingContainer'

export default function Index ({ className, children, listings, title }) {
  return <>
    <div className={'container'}>
      <ListingContainer type={'cars'} hasSearch={true}/>
    </div>
  </>
}