export default function ({ k, className }) {
  return <hr key={k} className={'block w-full border-neutral-200/80 dark:border-neutral-700/50 my-3' + (className ? ' ' + className : '')}/>
}
