import MainButton from '@/Components/Form/Buttons/MainButton'

export default function SecondaryButton ({
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
        className={className +
            ' uppercase font-bold rounded hover:scale-105 ' +
            (selected ? ' !bg-slate-600 dark:bg-slate-700 text-white ' : ' dark:bg-neutral-700/50 bg-slate-200 text-slate-400 ')}
        disabled={disabled || processing}
        icon={icon} processing={processing}
        size={size} dir={dir} iconPosition={iconPosition}>
        <span>{children}</span>
    </MainButton>

}
