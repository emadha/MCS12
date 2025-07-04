import { createRef, useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '@/AppContext'

export default function TextInput (
    {
        icon,
        iconInline = true,
        prefixIconClassName,
        suffixIconClassName,
        type = 'text',
        label,
        name,
        id,
        className,
        inputClassName,
        autoComplete,
        required,
        isFocused,
        handleChange,
        onClick,
        onFocus,
        onBlur,
        onClear,
        placeholder,
        disabled,
        steps,
        min,
        max,
        maxLength,
        defaultValue,
        labelAfter = false,
        style,
        isLoading,
        clearable,
        value,
        hasError,
        keepPositiveIfNumeric = false,
    }) {

    const input = createRef()
    const { rtl } = useContext(AppContext)
    const [currentValue, setCurrentValue] = useState(value)
    useEffect(() => {
        if (isFocused) {
            input.current?.focus()
        }
        setCurrentValue(defaultValue)
    }, [])

    const clear = (e) => {
        onClearEvent(e)
        setCurrentValue('')
        handleChange(e)
    }

    const onClearEvent = (e) => {
        typeof onClear != 'undefined' && onClear(e)
    }

    const onChange = (e) => {

        if (type === 'number' && keepPositiveIfNumeric) {
            e.target.value = Math.floor(Math.max(e.target.value, 0))
        }

        setCurrentValue(e.target.value)
        typeof handleChange != 'undefined' && handleChange(e)
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 27 && clearable) {
            clear(e)
        }
    }

    return <div className={'text-neutral-400 relative ' + (className ? ' ' + className : '')}>

        {!labelAfter && label && id &&
            <label className={'input-label'} htmlFor={id}>{label}</label>}

        {icon && <FontAwesomeIcon
            icon={icon}
            className={'absolute rtl:right-4 left-4 top-4 dark:text-neustral-500 ' + (prefixIconClassName)}/>
        }
        {isLoading && <FontAwesomeIcon icon={faSpinner} spin={true} className={'right-3 top-4 absolute'}/>}
        <input autoComplete={autoComplete}
               className={
                   ' '
                   + (icon ? (rtl ? '!pr-10' : '!pl-10 ') : '')
                   + (inputClassName ? ' ' + inputClassName : '') + ' '
                   + (hasError ? ' ring-orange-600 dark:ring-orange-600' : '')
               }
               id={id}
               ref={input}
               disabled={disabled}
               min={min}
               max={max}
               maxLength={maxLength}
               name={name}
               onChange={(e) => onChange(e)}
               onFocus={onFocus}
               onBlur={onBlur}
               onClick={onClick}
               placeholder={placeholder}
               type={type}
               required={required}
               style={style}
               value={value}
               defaultValue={currentValue}
               step={steps}
               onKeyDown={handleKeyDown}
        />
        {clearable && currentValue !== ''
            ? <FontAwesomeIcon
                onClick={e => clear(e)} icon={faXmark}
                className={'absolute cursor-pointer hover:!text-red-500 rtl:right-[95%] right-3 top-4 dark:text-neutral-500'}/>
            : <></>}
        {labelAfter && label && id && <label className={'select-none whitespace-nowrap'} htmlFor={id}>{label}</label>}
    </div>
}
