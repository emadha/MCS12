import { Fragment, useContext, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronDown, faMultiply } from '@fortawesome/free-solid-svg-icons'
import { isArray } from 'lodash'
import { AppContext } from '@/AppContext'

export default function Select ({
    name,
    className,
    options = [],
    placeholder,
    handleOnChange,
    onInputChange,
    disabled,
    leftIcon,
    multi,
    clearable = true,
    hasError,
    defaultValue,
}) {

    // Take RTL from Context or false
    const { rtl } = useContext(AppContext) ?? false

    const [query, setQuery] = useState('')

    const [selected, setSelected] = useState(
        multi
            ? defaultValue !== null ? isArray(defaultValue) ? defaultValue : [] : []
            : defaultValue !== null ? defaultValue : null,
    )
    const filteredOptions =
        query === ''
            ? options
            : options?.filter((option) =>
                option.label?.toString().toLowerCase()?.
                    replace(/\s+/g, '').
                    includes(query.toString().toLowerCase().replace(/\s+/g, '')),
            )

    const onChange = (e) => {
        setSelected(e)
        if (typeof handleOnChange === 'function') {
            return handleOnChange({ value: e, option: options?.filter(o => o.value === e)[0] })
        }
        return selected
    }

    return <div className={'relative ' + (className ? ' ' + className : '')}>
        <Combobox name={name} value={selected} onChange={onChange} disabled={disabled}
                  multiple={multi}>

            <div
                className={'relative text-left group'}>
                <Combobox.Input
                    className={'select-none text-black dark:text-white cursor-default focus-visible:ring-1 hover:ring-1 '
                        + (hasError ? ' ring-orange-600 dark:ring-orange-600 ' : '')
                        + (leftIcon || (clearable && selected !== null) ? ' px-10 ' : '')}
                    displayValue={v => {
                        if (multi) {
                            let filtered = options.filter(e => v.includes(e.value)) ?? []
                            return filtered?.length > 5
                                ? filtered.length + ' Selected'
                                : filtered.map(e => e.label).join(', ')
                        } else {
                            return options.filter(e => v === e.value)[0]?.label || defaultValue?.option?.label // < was || 'selected'
                        }
                    }}
                    placeholder={placeholder}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        if (typeof onInputChange === 'function') {
                            return onInputChange(e)
                        }
                    }}
                />
                {clearable && (multi ? selected?.length : selected !== null) ?
                    <FontAwesomeIcon
                        icon={faMultiply}
                        onClick={e =>
                            e.preventDefault() || setSelected(multi ? [] : null) || handleOnChange()}
                        className={'text-black dark:text-white mt-3 cursor-pointer absolute p-1 hover:bg-white/10 rounded-full aspect-square ' +
                            (rtl ? ' right-2 ' : ' left-2 ') +
                            (disabled ? 'hidden' : '')}/>
                    :
                    leftIcon && <button
                        type={'button'}
                        tabIndex={-1}
                        className={'absolute mt-1.5 p-1.5 text-neutral-400 disabled:text-neutral-300 dark:disabled:text-neutral-700/50 dark:text-neutral-500 ' +
                            (rtl ? 'right-2' : 'left-2')}
                        disabled={disabled}>
                        <FontAwesomeIcon icon={leftIcon} disabled={true}></FontAwesomeIcon>
                    </button>
                }

                <Combobox.Button
                    className={'absolute text-black dark:text-white disabled:bg-transparent dark:disabled:bg-transparent px-4 py-4 text-xs ' +
                        'inset-y-0 flex items-center rounded-r overflow-hidden ' +
                        'dark:disabled:text-neutral-700 disabled:text-neutral-300 ' +
                        (rtl ? ' left-0 ' : ' right-0 ') +
                        'dark:hover:bg-neutral-600/20 hover:bg-indigo-50'}>
                    <FontAwesomeIcon icon={faChevronDown} className={''}/>
                </Combobox.Button>

            </div>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery('')}
            >
                <Combobox.Options
                    className="absolute left-0 top-7 z-10 max-h-56 w-full overflow-auto dark:bg-neutral-800 bg-white dark:border-t-0 dark:border-neutral-900 border t-1 shadow-xl text-sm">
                    {filteredOptions?.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found.
                        </div>
                    ) : (
                        filteredOptions?.map((option) => (
                            <Combobox.Option
                                key={name + '_' + option.value}
                                className={({ active }) =>
                                    'relative dark:text-white cursor-pointer select-none py-2 pl-3 pr-4 ' +
                                    (active ? 'bg-blue-700 text-white dark:bg-indigo-700/30' : 'text-gray-900')
                                }
                                value={option.value}>
                                {({ selected, active }) =>
                                    <div className={`flex gap-x-1 items-center block truncate ${selected
                                        ? 'font-medium'
                                        : 'font-normal'}`}>
                                        <FontAwesomeIcon icon={faCheck} className={'w-5 aspect-square ' +
                                            (selected ? 'text-lime-600' : 'text-transparent dark:text-neutral-700/70')}/>
                                        {option.picture ? <img src={option.picture} className={'aspect-square rounded w-10'}/> :
                                            <div></div>}
                                        <span>{option.label}</span>
                                    </div>
                                }
                            </Combobox.Option>
                        ))
                    )}
                </Combobox.Options>
            </Transition>
        </Combobox>
    </div>
}
