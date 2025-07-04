import MainButton from '@/Components/Form/Buttons/MainButton'

export default function PrimaryButton ({
    type = 'button',
    disabled = false,
    className = '',
    selected = false,
    icon,
    iconPosition,
    processing,
    children,
    onClick,
    size,
    dir,
}) {
    return <MainButton
        type={type}
        onClick={onClick}
        className={(className ? className + ' ' : '') +
            ' main-btn primary-btn '
        }
        disabled={disabled || processing}
        icon={icon} processing={processing}
        size={size} dir={dir} iconPosition={iconPosition}>
        <span>{children}</span>
    </MainButton>

}
