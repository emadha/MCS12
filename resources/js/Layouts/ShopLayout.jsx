import React from 'react';
import {Link} from "@inertiajs/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";

function ShopLayout({shop, children}) {
    return <div className={'container mt-24'}>
        <Link href={route('shops.index')} className={'hover:border-b-primary transition-all w-min px-2 border-b-transparent border-b flex items-center gap-x-1 my-3 font-black text-sm'}>
            <FontAwesomeIcon icon={faChevronLeft} className={'text-xs'}/> Shops
        </Link>
        {children}
    </div>
}

export default ShopLayout;
