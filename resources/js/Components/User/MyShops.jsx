import { useState } from 'react'
import { Skeleton } from 'antd'
import { random } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function MyShops ({ className, children }) {
  const [shops, setShops] = useState([])
  const [loaded, setLoaded] = useState(0)


  return loaded ? <div className={'flex space-x-2'}>
      {shops.map(shop => <div key={shop.id} className={'w-3/12'}>
        <img className={'rounded'} src={'https://picsum.photos/200?r' + random(0, 1000)}/>
      </div>)}
      <div
        className={'w-3/12 aspect-square dark:bg-neutral-900 cursor-pointer dark:hover:bg-neutral-600 transition rounded flex items-center justify-center'}>
        <small>
          <>View All</>
          <FontAwesomeIcon icon={faChevronRight} className={'w-1 ml-2'}/>
        </small>
      </div>
    </div>
    : <Skeleton active/>
}
