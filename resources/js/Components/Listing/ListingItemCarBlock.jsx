import { faCarSide, faDashboard, faGasPump } from '@fortawesome/free-solid-svg-icons'
import ItemBlock from '@/Components/Listing/Components/ItemBlock'
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons'
import ItemMiscBlock from '@/Components/Listing/Components/ItemMiscBlock'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'

export default function ListingItemCarBlock ({
    k,
    className,
    item,
    itemsView = 'grid',
    sidebarOpen,
    options = {
        showImage: true, showTitle: true, hideBody: false, showPromoted: true,
        showContextMenu: true,
    },
}) {

    const { lang } = useContext(AppContext)

    return <ItemBlock k={k} item={item} className={'@container ' + className}
                      options={options}
                      sidebarOpen={sidebarOpen}
                      view={itemsView}>
        <h4 className={'font-extrabol italic'}>{item.title}</h4>
        {!options.hideBody && <div className={'text-xs max-h-48 overflow-auto flex justify-between text-neutral-700 flex-wrap'}>

            <ItemMiscBlock icon={faCalendarCheck} title={lang('Condition')}>{lang(item.condition)}</ItemMiscBlock>
            <ItemMiscBlock icon={faDashboard} title={lang('Odometer')}>{item.item.odometer} {lang(' ', 'Km')}</ItemMiscBlock>

            {/*<ItemMiscBlock icon={faCarSide} title={lang('Exterior')}>{lang(item.item.exterior_color)}</ItemMiscBlock>*/}

            <ItemMiscBlock icon={faCarSide} className={'w-full break-words'} title={lang('Interior')}>
                {lang(item.item.interior_material)} - {lang(item.item.interior_color)}</ItemMiscBlock>


            {(item.item.car && (item.item.car.mixed_fuel_consumption_per_100_km_l ||
                    item.item.car.fuel_grade ||
                    item.item.car.number_of_cylinders ||
                    item.item.car.engine_type)) &&
                <ItemMiscBlock icon={faGasPump} className={'!w-full'} title={lang('Engine')}>
                    <div className={'space-x-1 flex-wrap w-full break-words align-middle'}>
                        {item.item.car.number_of_cylinders &&
                            <span>{item.item.car.number_of_cylinders} Cylinders</span>
                        }
                        <span>{item.item.car.fuel_grade}</span>
                        <span>{item.item.car.engine_type}</span>

                        {item.item.car.mixed_fuel_consumption_per_100_km_l &&
                            <span>{item.item.car.mixed_fuel_consumption_per_100_km_l} L/100Km</span>
                        }
                    </div>
                </ItemMiscBlock>
            }</div>
        }
    </ItemBlock>
}
