import { isObject } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-regular-svg-icons'
import TextInput from '@/Components/Form/TextInput'
import { faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/AppContext.jsx'

export default function SingleCarDetailBox ({ car }) {
    const [specs, setSpecs] = useState([])
    const { lang } = useContext(AppContext)

    const filterSpecs = (query) => {
        query ? setSpecs(e => Object.entries(car).filter(item => item[0].toLowerCase().includes(query.toLowerCase())))
            : setSpecs(Object.entries(car))
    }
    useEffect(e => {
        setSpecs(Object.entries(car))
    }, [])

    const capitalize = (v) => {
        return v.charAt(0).toUpperCase() + v.slice(1)
    }

    return <div className={'mt-5 px-0'}>
        <div>
            <h3>{lang('Stock Specifications')}
                <FontAwesomeIcon
                    className={'text-xs align-baseline ml-5 cursor-pointer'}
                    icon={faFlag}/>
            </h3>
            <div className={'flex justify-between items-end flex-wrap'}>
                <p className={'text-sm text-neutral-400 md:w-7/12 md:pr-5 mt-5'}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={'mr-2'}/>
                    Below, you can find the stock car specifications,
                    however this data does not accurately represent the
                    current car specifications, and may contain wrong information.
                </p>
                <div className={'md:w-5/12 w-full mt-5'}>
                    <TextInput className={'rounded-lg'}
                               icon={faSearch} clearable={true}
                               handleChange={e => filterSpecs(e.target.value)}
                               placeholder={lang('Search details here...')}/>
                </div>
            </div>
        </div>
        <div
            className={'mt-5 bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden rounded grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid'}>
            {specs.filter(e => e[1] !== '').map(e =>
                <div
                    className={'text-sm hover:bg-neutral-400/20 hover:dark:bg-neutral-800 py-1 px-2 rounded flex items-center'}
                    key={e}>
                    <div className={'py-1 w-full select-none'}>
                        <span className={'!text-neutral-500'}>{capitalize(e[0].replace('_', ' '))}</span>
                    </div>
                    <div className={'text-right w-full font-bold py-1'}>

                        <p>{!isObject(e[1])
                            ? e[1] ? e[1] : <span className={'font-thin'}>-</span>
                            : 'is Object #SingleCarDetailsBox.jsx'}
                        </p>
                    </div>
                </div>,
            )}
        </div>
    </div>
}
