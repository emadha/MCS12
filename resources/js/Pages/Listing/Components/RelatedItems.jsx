import React, { useContext, useEffect, useState } from 'react'
import Hr from '@/Components/Hr'
import { AppContext } from '@/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import ListingItemCarBlock from '@/Components/Listing/ListingItemCarBlock'

export default function RelatedItems ({ className, item }) {
    const { lang } = useContext(AppContext)

    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const [selectedType, setSelectedType] = useState(['make'])
    const allowedTypes = [
        'price', 'make', 'model', 'year',
    ]

    const handleTypeToggle = (type) => {
        setSelectedType((prevSelectedTypes) => {
            const index = prevSelectedTypes.indexOf(type)
            if (index !== -1) {
                return prevSelectedTypes.filter((t) => t !== type)
            } else {
                return [...prevSelectedTypes, type]
            }
        })
    }

    const getRelatedCars = () => {

        if (!selectedType.length) {
            setItems([])
            return
        }

        setLoading(true)

        axios.get('/api/related/' + item.id + '/' + (selectedType.join(','))).
            then(r => {
                setItems(r.data.data)
            }).
            catch(err => {
                setItems([])
            }).
            finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        setLoading(true)
        getRelatedCars()
    }, [selectedType])

    const TypeSelect = ({ title, type }) => <div
        className={'cursor-pointer select-none hover:opacity-100 rounded py-0.5 px-3 opacity-60 transition-all '
            + (selectedType.includes(type) ? 'text-white !opacity-100 shadow-lg bg-slate-600 dark:bg-white/40' : 'bg-white/5')}
        onClick={() => handleTypeToggle(type)}>
        <span className={'!text-inherit'}>
            {title}
        </span>
    </div>

    return <div>
        <div className={'select-none text-xs'}>
            <h2>{lang('Looking for something else?')}</h2>
            <p>{lang('You can find a few other items that may be related to this item')}</p>
            <Hr/>
            <div className={'flex space-x-1 pb-5 items-center justify-start text-sm max-w-[90vw] whitespace-nowrap overflow-auto'} style={{ scrollbarWidth: 'thin' }}>
                <TypeSelect type={'price'} title={lang('Price')}/>
                <TypeSelect type={'make'} title={lang('Make')}/>
                <TypeSelect type={'model'} title={lang('Model')}/>
                <TypeSelect type={'year'} title={lang('Year')}/>
                <TypeSelect type={'body_type'} title={lang('Body Type')}/>
                <TypeSelect type={'exterior_color'} title={lang('Exterior Color')}/>
                <TypeSelect type={'interior_color'} title={lang('Interior Color')}/>
                <TypeSelect type={'interior_material'} title={lang('Interior Material')}/>
                <TypeSelect type={'condition'} title={lang('Condition')}/>
                <TypeSelect type={'location'} title={lang('Location')}/>
            </div>
            {selectedType.length
                ? <div className={'bg-slate-800/5 dark:bg-white/5 backdrop-blur-xl rounded p-3 shadow'}>
                    {loading
                        ? <div className={'select-none text-xs flex justify-start items-center gap-x-1.5'}><FontAwesomeIcon icon={faSpinner} spin={true}/> Loading</div>
                        : items.length ? <div className={'flex flex-wrap'}>
                            {items.map(item => <div key={item.id} className={'xl:w-1/4 md:w-1/3 sm:w-1/2'}>
                                <ListingItemCarBlock className={''} itemsView={'list'} item={item}/>
                            </div>)}
                        </div> : <div className={'flex items-center justify-start text-xs select-none'}>
                            Nothing found
                        </div>
                    }
                </div> : <></>}
        </div>
    </div>
}
