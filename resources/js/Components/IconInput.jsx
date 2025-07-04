import { forwardRef } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const IconInput = forwardRef(function IconInput(
    {
        id,
        name,
        label,
        value,
        error,
        icon = null,
        iconClassName = '',
        className = '',
        labelClassName = '',
        inputClassName = '',
        errorClassName = '',
        ...props
    },
    ref
) {
    return (
        <div className={className}>
            {label && (
                <InputLabel
                    htmlFor={id}
                    value={label}
                    className={labelClassName}
                />
            )}
            <TextInput
                id={id}
                name={name}
                value={value}
                icon={icon}
                iconClassName={iconClassName}
                className={inputClassName}
                ref={ref}
                {...props}
            />
            {error && <InputError message={error} className={errorClassName} />}
        </div>
    );
});

export default IconInput;
