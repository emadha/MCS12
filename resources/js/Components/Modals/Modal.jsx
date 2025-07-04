import { Fragment, useContext, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AppContext } from '@/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import Hr from '@/Components/Hr'

export default function Modal({
                                  className, data, children, show = false, maxWidth = '2xl', closeable = true, onClose = () => {
    },
                              }) {
    let [isOpen, setIsOpen] = useState(true)
    const { lang, setModalShow } = useContext(AppContext)
    const close = () => {

        if (closeable) {
            setModalShow(e => false)
        }

    }

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl md:max-w-3xl lg:max-w-4xl',
    }[maxWidth]

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 flex overflow-y-auto px-4 overflow-visible sm:px-0 items-center z-50 transform transition-all"
                onClose={close}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-white/75 dark:bg-neutral-900/70 backdrop-blur-sm"/>
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-100"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel className={`mb-6 border border-purple-900/30 bg-grad-primary
              dark:text-white
             dark:backdrop-blur-3xl rounded-lg
             dark:shadow-xl shadow-lg transform transition-all w-full mx-auto ${maxWidthClass}`}

                    >


                        {data.title ? <Dialog.Title as={'div'} className={'m-0'}>
                            <div className={'flex flex-wrap-reverse items-start px-10 py-5 pb-3 empty:hidden justify-center xs2:justify-between'}>
                                <h3 className={'m-0 text-center p-0'}>{lang(data.title)}</h3>
                                {closeable
                                    ? <FontAwesomeIcon
                                        className={'transition-all cursor-pointer aspect-square bg-violet-100 p-3 rounded text-sm xs:mxs-0 mx-austo ' +
                                            ' dark:bg-neutral-800 dark:hover:bg-neutral-400'}
                                        icon={faClose}
                                        onClick={e => setModalShow(false)}>Close</FontAwesomeIcon>
                                    : <></>}
                            </div>
                        </Dialog.Title> : <></>}
                        <Dialog.Description as={'div'} className={'!max-h-screen'}>
                            {children}
                        </Dialog.Description>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    )
}
