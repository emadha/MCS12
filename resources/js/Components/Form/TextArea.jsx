import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function TextArea ({
  id,
  label,
  textRef,
  className,
  inputClassName,
  defaultValue,
  name,
  placeholder,
  disabled,
  icon,
  rows,
  handleChange,
  onEnter = () => {},
  value,
  hasError,
  autofocus,
}) {

  return <div className={'flex flex-col items-start relative'
    + (className ? ' ' + className : '')}>
    {label && id && <label className={'input-label'} htmlFor={id}>{label}</label>}
    {icon && <FontAwesomeIcon icon={icon} className={'absolute left-3 top-3 dark:text-neutral-500'}/>}
    <textarea
      autoFocus={autofocus}
      className={
        (inputClassName ? inputClassName + ' ' : '') +
        (hasError ? ' ring-orange-600 dark:ring-orange-600 ' : ' ') +
        (icon ? ' !pl-9' : '')}
      id={id}
      ref={textRef}
      name={name}
      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? onEnter() : null}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      rows={rows}
      style={{ scrollbarWidth: 'thin' }}
      defaultValue={defaultValue}></textarea>
  </div>
}
