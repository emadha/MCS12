import { useState, Fragment } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Transition } from '@headlessui/react';

export default function AnimatedIconInput({
    type = 'text',
    name,
    id,
    value,
    icon,
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
    const [focused, setFocused] = useState(false);
    const [filled, setFilled] = useState(value ? true : false);

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

    const baseClasses = `block w-full rounded-md shadow-sm transition-all duration-300 ease-in-out
        border-gray-300 focus:border-accent focus:ring-opacity-50 placeholder:text-gray-400
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:ring-accent'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`.trim();

    return (
        <div className="relative">
            {label && (
                <InputLabel htmlFor={id} value={label} className={`mb-1 transition-all duration-300 ease-in-out ${focused ? 'text-accent' : ''}`} />
            )}

            <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 ease-in-out ${focused ? 'text-accent scale-110' : ''}${error ? ' text-red-500' : ''}`}>
                    {icon}
                </div>

                {(focused || filled) && (
                    <div className="absolute inset-0 bg-accent bg-opacity-5 rounded-md z-0 transition-all duration-300 ease-in-out" />
                )}

                <input
                    type={type}
                    name={name}
                    id={id}
                    value={value}
                    className={`${baseClasses} pl-10`}
                    autoComplete={autoComplete}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                    {...props}
                />

                {focused && (
                    <div className="absolute bottom-0 left-0 h-0.5 bg-accent rounded-full w-full transform origin-left transition-all duration-300 ease-in-out" />
                )}
            </div>

            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}
