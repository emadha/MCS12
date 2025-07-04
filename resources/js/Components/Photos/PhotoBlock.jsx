export default function PhotoBlock ({ className, src, size = 'square_sm' }) {
  return <img className={'rounded'} src={src.path[size]} alt=""/>
}