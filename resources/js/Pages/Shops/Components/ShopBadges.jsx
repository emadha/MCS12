import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

export default function ShopBadges ({ className, shop }) {
    return <div className={'' + (className ? ' ' + className : '')}>
        {shop.types.map(type =>
            <div key={type.title}
                 className={'cursor-pointer hover:bg-white/10 p-2 px-3 !-mx-2 rounded text-center inline-block mx-4 select-none text-xs'}>
                <div>
                    <FontAwesomeIcon
                        className={'mr-2 text-blue-300'}
                        icon={faCheckDouble}/>
                    {type.title}
                </div>
            </div>,
        )}
    </div>
}
