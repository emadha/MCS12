import ShopBlock from '@/Pages/Shops/Components/ShopBlock'
import { Link } from '@inertiajs/react'
import Alert from '@/Components/Alerts/Alert'

export default function ShopsContainer ({ className, onClick = () => {}, shops = [] }) {
  return <div className={'flex flex-wrap'} onClick={onClick}>
    {shops.length ?
      shops.map(shop => <ShopBlock className={'w-1/4'} shop={shop}/>)
      : <>
        <Alert className={'block w-full mb-1'} type={'info'}>
          <p>Did you know you can create your own shop on mecarshop.com?</p>
          <small>Shops can be used to group the product you're trying to sell, may it be a showroom, a car wash
            service...etc</small>
        </Alert>
        <div>You don't have any shop yet,&nbsp;<Link className={'link'} href={'/'}>Create one here!</Link></div>
      </>
    }
  </div>
}