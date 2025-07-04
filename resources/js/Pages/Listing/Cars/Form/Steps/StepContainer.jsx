import { Transition } from '@headlessui/react'
import React, { useContext, useEffect, useState } from 'react'
import OutlineButton from '@/Components/Form/Buttons/OutlineButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '@/AppContext'

export default function StepContainer ({
  title, className, children,
  step, numberOfStep = 1,
}) {
  const [isShowing, setIsShowing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const { lang, rtl } = useContext(AppContext)

  useEffect(e => {setTimeout(e => setIsShowing(true), 40)}, [])

  const nextStep = (to) => {
    setTimeout(e => setIsShowing(false), 0)
    setTimeout(e => to != null ? setCurrentStep(e => to) : setCurrentStep(e => e > 3 ? e : e + 1), 200)
    setTimeout(e => setIsShowing(true), 200)
  }

  const prevStep = (to) => {
    setTimeout(e => setIsShowing(false), 0)
    setTimeout(e => to != null ? setCurrentStep(to) : setCurrentStep(e => e <= -1 ? -1 : e - 1), 200)
    setTimeout(e => setIsShowing(true), 200)
  }
  return <div className={'w-full'}>
    {currentStep}
    <Transition show={isShowing}
                enter="transform transition duration-[400ms]"
                enterFrom="opacity-0 scale-50"
                enterTo="opacity-100 scale-100"
                leave="transform duration-200 transition ease-in-out"
                leaveFrom="opacity-1000 scale-100 "
                leaveTo="opacity-0 scale-95">

      <div className={'text-center'}>
        <h2>{title}</h2>
        <div className={'flex items-center justify-center min-h-[400px] container mx-auto'}>
          {children}
        </div>
      </div>

    </Transition>
    <div className={'w-full my-10 text-center flex flex-wrap items-center justify-center'}>

      {currentStep > 0 &&
        <OutlineButton hideTextOnSmallScreen={false}
                       className={'cursor-pointer select-none text-neutral-400 !ring-0 hover:font-black transition-all' +
                         ' space-x-2 hover:text-neutral-800'}
                       onClick={e => prevStep()}>
          <FontAwesomeIcon icon={rtl ? faChevronRight : faChevronLeft} className={'text-xs align-baseline ml-2'}/>
          {lang('Previous')}
        </OutlineButton>}

      {currentStep < numberOfStep &&
        <OutlineButton hideTextOnSmallScreen={false}
                       className={'cursor-pointer bg-lime-400/20 shadow-lime-100/30 animate-pulse shadow-2xl select-none !ring-0 hover:font-black transition-all' +
                         ' space-x-2 hover:text-neutral-800'}
                       onClick={e => nextStep()}>
          {lang('Next')}
          <FontAwesomeIcon icon={rtl ? faChevronLeft : faChevronRight} className={'text-xs align-baseline mr-2 '}/>
        </OutlineButton>}
    </div>

  </div>
}