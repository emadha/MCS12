import ListingBlockBase from '@/Pages/Listing/Components/ListingBlockBase'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Hr from '@/Components/Hr'

function FontAwesome () {
  return null
}

const getRelatedCars = () => {
  let relatedCars = []
  for (let i = 0; i < 10; i++) {
    relatedCars.push(<div key={i}
      className={'rounded aspect-square overflow-hidden cursor-pointer grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all'}>
      <img className={'w-96 aspect-square inline-block'}
           src={'https://picsum.photos/100?q=' + Math.random()}/></div>)
  }
  return relatedCars
}

export default function ShopBlock ({ className, shop }) {
  return <ListingBlockBase className={className} title={shop.title}
                           title_link={shop.link}>

    <div className={'items-center'}>
      <div className={'my-5 flex items-center'}>
        <div className={'w-2/12 text-center'}>
          <img src="https://picsum.photos/140"
               className={'w-full aspect-square shadow rounded-full'}
               alt=""/>
        </div>
        <div className={'w-11/12'}>
          <p className={'px-5 text-justify'}>{shop.description}</p>
        </div>
      </div>
      <ul className={'mb-10 block'}>
        {shop.types.map(type =>
          <li key={type.title}
              className={'inline-block mr-7 select-none text-xs '}>
            <div>
              <FontAwesomeIcon className={'mr-2 text-blue-300'}
                               icon={faCheckDouble}/>
              {type.title}
            </div>
          </li>,
        )}
      </ul>
      <Hr className={'mt-10 mb-11'}/>
      <div className={'my-5'}>
        <h4>More Cars from this Dealer</h4>
        <div className={'flex space-x-5'}>
          {getRelatedCars()}
        </div>
      </div>
    </div>

  </ListingBlockBase>
}
