import { Link } from '@inertiajs/react'
import AppLink from '@/Components/AppLink'
import { faShop } from '@fortawesome/free-solid-svg-icons'
import PageContainer from '@/Layouts/PageContainer'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import Hr from '@/Components/Hr'
import ShopBlock from "@/Components/Shops/ShopBlock.jsx";

export default function Shops ({ className, title, shops = [] }) {

    return <PageContainer title={title} className={''}>

        <div>
            <Link href={route('shop.create')}>
                <PrimaryButton>
                    Create a New Shop
                </PrimaryButton>
            </Link>
        </div>

        <Hr/>

        <div className={'flex @container/shops  items-stretch flex-wrap'}>
            {shops?.data?.length ? shops.data.map(shop =>
                <ShopBlock className={'w-1/3'} shop={shop}/>) : <></>}
        </div>

        <div className={'flex items-center flex-wrap justify-center'}>
            <AppLink href={route('shops.index')}
                     className={'mx-auto text-xs text-center px-5 rounded py-3 bg-neutral-800/20 dark:text-gray-300 text-neutral-300 dark:hover:text-white transition-all'}
                     icon={faShop}>View All</AppLink>
        </div>

    </PageContainer>
}
