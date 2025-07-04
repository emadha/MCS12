import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { Link } from '@inertiajs/react'

export default function CreateShopButton ( { className, children } ) {
  return <Link className={ ( className ? className + ' ' : '' ) } href={ route( 'shop.create' ) }>
    <PrimaryButton>Create a new Shop</PrimaryButton>
  </Link>
}