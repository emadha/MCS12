import { Tab } from '@headlessui/react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle as faCheckCircleSolid, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'

export default function StepButton ({ className, children, disabled = false, step}) {
  return <Tab key={step} data-index={step} disabled={disabled}
              className={'p-2 py-0 transition-all whitespace-nowrap  ' +
                'disabled:opacity-20 ui-selected:hidden flex items-center justify-start ' +
                'focus:outline-none inline-block focus:outline-0' +
                (disabled ? ' !scale-50 opacity-20 overflow-hidden ' : ' scale-100 ') +
                (step?.isActive || false ? ' scale-125  font-black ' : 'scale-90 opacity-60')
              }>
    <FontAwesomeIcon
      className={'animate-pop-in mx-1.5 ' + (
        !step?.isValid && !step?.errors.length
          ? 'text-neutral-300'
          : (step.errors.length === 0
            ? ' text-lime-600 '
            : ' text-orange-300')
      )}
      icon={(
        !step?.isValid && !step?.errors.length
          ? faCheckCircle
          : (step.errors.length < 1
            ? faCheckCircleSolid
            : faExclamationTriangle)
      )}/>
    {children}
  </Tab>
}