import { useState, useEffect, useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

export default function EnhancedTextInput({
    type = 'text',
    name,
    id,
    value,
    className = '',
    autoComplete,
    required,
    isFocused,
    disabled = false,
    label,
    error,
    onChange,
    placeholder,
    ...props
}) {
    const input = useRef();
    const [focused, setFocused] = useState(false);
    const [filled, setFilled] = useState(value ? true : false);

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    const handleOnChange = (e) => {
        if (onChange) {
            onChange(e);
        }
        setFilled(e.target.value !== '');
    };

    const handleOnFocus = (e) => {
        setFocused(true);
        if (props.onFocus) {
            props.onFocus(e);
        }
    };

    const handleOnBlur = (e) => {
        setFocused(false);
        if (props.onBlur) {
            props.onBlur(e);
        }
    };

    const baseClasses = `
        peer block w-full rounded-md shadow-sm
        border-gray-300
        focus:border-indigo-500 focus:ring-indigo-500
        focus:ring-opacity-50 placeholder:text-transparent placeholder-shown:placeholder:text-gray-400
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        transition-all duration-300 ease-in-out
        ${className}
    `.trim();

    const labelClasses = `
        absolute text-sm text-gray-500
        duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2
        peer-focus:text-indigo-600
        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
        peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
        ${error ? 'text-red-500 peer-focus:text-red-500' : ''}
        ${focused ? 'text-indigo-600' : ''}
        ${filled && !focused ? 'text-gray-600' : ''}
    `.trim();

    return (
        <div className="relative">
            <div className="relative group">
                <input
                    type={type}
                    name={name}
                    id={id}
                    value={value}
                    className={baseClasses}
                    ref={input}
                    autoComplete={autoComplete}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder || ' '}
                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                    {...props}
                />

                <label
                    htmlFor={id}
                    className={labelClasses}
                >
                    {label}
                </label>

                <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 w-0 group-hover:w-1/4 ${focused ? 'w-full' : ''} transition-all duration-300 ease-in-out rounded-full`}></div>
            </div>

            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}
