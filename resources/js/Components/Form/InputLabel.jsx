export default function InputLabel ({ forInput, value, className, children }) {
  return <label htmlFor={forInput}
                className={'font-bold ' +
                  (className ? ' ' + className : '')}>
    {value ? value : children}
  </label>
}
