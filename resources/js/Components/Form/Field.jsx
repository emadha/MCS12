import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { Transition } from '@headlessui/react'

export default function Field ({ key, className, legendClassName, children, title, collapsable = false }) {
    const [isOpen, setIsOpen] = useState(true)
    const collapse = () => {
        if (!collapsable) {
            return
        }

        setIsOpen(!isOpen)
    }

    return <div className={'my-2 ' + (className ? ' ' + className : '')}>

        {title ?
            <fieldset className={'relative '}>
                <legend className={'w-full italic cursor-pointer px-3 py-2 '
                    + (collapsable ? ' hover:bg-green-500/10 transition-all rounded ' : '')
                    + (isOpen ? ' font-bold' : '')
                    + (legendClassName ? ' ' + legendClassName : '')}
                        onClick={collapse}>
                    <span className={'flex items-center'}>
                        {collapsable ? <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} className={'mt-1 pr-2 block'}/> : <></>}
                        {title}
                    </span>
                </legend>
            </fieldset>
            : <></>
        }

        <Transition show={isOpen}
                    enter={'duration-100'}
                    enterFrom={'opacity-0'}
                    enterTo={'h-max opacity-100'}
                    leave={'h-max duration-100'}
                    leaveFrom={'h-max'}
                    leaveTo={'opacity-0'}
        >
            <div className={'mt-2'}>{children}</div>
        </Transition>
    </div>
}
