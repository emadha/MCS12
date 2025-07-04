import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Skeleton } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function MyCars ({ className, children }) {
  const [loaded, setIsLoaded] = useState(0)
  const [cars, setCars] = useState([])

  useEffect(e => {
    axios.get('/api/my/cars').then(r => {
      setCars(e => r.data)
    }).finally(e => setIsLoaded(1))
  }, [setCars])
  return loaded
    ? <div
      className={'dark:bg-neutral-800/60 shadow-sm bg-white w-full rounded p-5'}>
      <h4>Listed Cars</h4>
      <div className={'flex flex-wrap justify-start'}>
      <div className={'lg:w-10/12 w-full flex flex-wrap justify-start items-start'}>
        {cars.data?.map(car =>
          <Link href={car.link} key={car.id} className={'w-full lg:w-1/2 relative flex items-center p-2 hover:bg-neutral-100 ' +
            'dark:hover:bg-neutral-800 transition-all'}>
            <img className={'ssabsolute rounded left-0 top-0 lg:aspect-auto w-16'} src={car.primary_photo?.path?.square_sm}/>
            <div className={'abssolute left-0d right-0 bottom-0 drop-shadow w-full p-2'}>{car.title}</div>
          </Link>)
        }
      </div>
      <div
        className={'lg:w-2/12 w-full aspect-square dark:bg-neutral-900 cursor-pointer dark:hover:bg-neutral-600 transition rounded flex items-center justify-center'}>
        <small>
          <>View All</>
          <FontAwesomeIcon icon={faChevronRight} className={'w-1 ml-2'}/>
        </small>
      </div>
      </div></div>
    : <Skeleton rootClassName={'py-10'} active/>
}
