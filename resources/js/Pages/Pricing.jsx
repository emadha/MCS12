import PageContainer from '@/Layouts/PageContainer'
import { useContext, useState } from 'react'
import { AppContext } from '@/AppContext'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

export default function Pricing ({ title, plans = [] }) {

  const [selectedPlan, setSelectedPlan] = useState(
    plans[plans.filter(p => p.default == true)])
  const { lang } = useContext(AppContext)

  return <PageContainer title={lang(title)} className={'!bg-transparent'} bodyClass={'text-center'}>
    <p className={'p-10'}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tincidunt scelerisque consectetur. Suspendisse augue mauris, aliquam sed odio id, sollicitudin mollis ex. Duis lectus metus, hendrerit a blandit vitae, dapibus ut purus. In
      tincidunt ante eget convallis faucibus. Vivamus auctor nisl id dapibus lacinia. Maecenas in semper ipsum, nec condimentum augue. Proin dignissim ex ac erat dictum porttitor a sed justo. Integer sollicitudin libero nec tincidunt elementum. Duis
      nisi urna, eleifend ac tempus eu, placerat in arcu. Suspendisse eu dapibus nisi. Morbi diam est, feugiat in erat eu, mollis porttitor odio. Ut efficitur, nulla et aliquam porttitor, lorem sapien eleifend nunc, at facilisis massa lorem ut
      tellus.
    </p>
    <div className={'h-[500px] flex gap-x-5'}>
      {plans.length && plans.map(plan => <div
        className={'w-1/3 cursor-pointer hover:bg-neutral-700 duration-500 text-center p-5 rounded shadow h-full '
          + ' flex flex-wrap content-between'
          + (selectedPlan == plan ? ' dark:!bg-transparent backdrop-blur !bg-blue-50 ring ring-offset-2 ring-offset-neutral-900 ' : ' !bg-white dark:!bg-neutral-800')}
        onClick={() => setSelectedPlan(plan)}
      >
        <div className={'w-full'}>
          <h2 className={'font-extrabold'}>
            {plan.title}
          </h2>
          <p>{plan.cost}$/mo</p>
        </div>
        <div>
          {
            plan.benefits.map(benefit => <p><FontAwesomeIcon icon={faCheck} className={'mr-2'}/>
              {benefit}
            </p>)
          }
        </div>
        <div className={'w-full flex justify-center'}>
          <PrimaryButton size={'lg'}>Buy</PrimaryButton>
        </div>
      </div>)}
    </div>
  </PageContainer>
}