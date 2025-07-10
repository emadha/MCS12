import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react'
import {Transition} from '@headlessui/react'
import {clsx} from "clsx";

export default function Field({
                                  key,
                                  className,
                                  childrenClassName,
                                  legendClassName,
                                  children,
                                  title,
                                  collapsable = false
                              }) {
    const [isOpen, setIsOpen] = useState(true)
    const collapse = () => {
        if (!collapsable) {
            return
        }

        setIsOpen(!isOpen)
    }

    return <div className={clsx('p-5 my-2 ', className)}>

        {title ?
            <fieldset className={'relative '}>
                <legend className={
                    clsx('w-full uppercase text-xs font-light select-none',
                        legendClassName,
                        collapsable ? 'hover:font-bold cursor-pointer' : '',
                        isOpen ? 'font-bold' : '')
                } onClick={collapse}>
                    <span className={'flex items-center'}>
                        {collapsable ? <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown}
                                                        className={'mt-1 pr-2 block'}/> : <></>}
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
            <div className={clsx('mt-2', childrenClassName)}>{children}</div>
        </Transition>
    </div>
}
