import React, { useContext, useState } from 'react'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { AppContext } from '@/AppContext'
import { faCircleQuestion, faGlobe, faPhone, faPlus } from '@fortawesome/free-solid-svg-icons'
import SecondaryButton from '@/Components/Form/Buttons/SecondaryButton'
import TextInput from '@/Components/Form/TextInput'
import { faFacebook, faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'

export default function ContactSelect ({
    className,
    methods = [], show = false,
    rootSelectedContactMethods = [],
    rootSetSelectedContactMethods,
}) {

    const { lang } = useContext(AppContext)
    const [showingForm, setShowingForm] = useState(show)
    const [openMethod, setOpenMethod] = useState(null)

    const contactIcons = {
        'FACEBOOK': faFacebook,
        'EMAIL': faEnvelope,
        'PHONE': faPhone,
        'WHATSAPP': faWhatsapp,
        'INSTAGRAM': faInstagram,
        'TIKTOK': faTiktok,
        'WEBSITE': faGlobe,
        'OTHER': faCircleQuestion,
    }

    const contactPlaceholders = {
        'FACEBOOK': 'Enter Facebook Link here',
        'EMAIL': 'Enter E-mail address here',
        'PHONE': 'Enter Phone number Link here',
        'WHATSAPP': 'Enter Whatsapp number here',
        'INSTAGRAM': 'Enter Instagram account here',
        'TIKTOK': 'Enter TikTok number here',
        'WEBSITE': 'Enter Website url here',
        'OTHER': 'Enter anything you want here...',
    }

    const contactType = {
        'FACEBOOK': 'url',
        'EMAIL': 'email',
        'PHONE': 'text',
        'WHATSAPP': 'text',
        'INSTAGRAM': 'text',
        'TIKTOK': 'text',
        'WEBSITE': 'url',
        'OTHER': 'url',
    }

    return <div className={'p-5 dark:bg-neutral-800 rounded ' + (className ? ' ' + className : '')}>
        {showingForm || rootSelectedContactMethods?.length

            ? <div className={''}>
                <div className={'flex flex-wrap my-5 justify-center items-center flexwrap gap-2'}>
                    {methods.map(method =>
                        <div className={'contact-container content-center select-none dark:shadow transition-all cursor-pointer w-32 ' +
                            'flex items-center justify-center dark:text-white hover:bg-lime-500/10 ' +
                            'bg-neutral-50 text-black dark:bg-neutral-700 rounded p-2 dark:hover:bg-neutral-600 '
                            + (openMethod === method
                            || rootSelectedContactMethods.filter(e => e.method === method && e.value?.replace(/\s/g, '') !== undefined).length
                                ? ' w-full !bg-lime-600 shadow-md '
                                : ' sm:w-1/6 w-full sm:flex-nowrap ')
                        }
                             onClick={(e) => {
                                 // Focus input on click
                                 setTimeout(() => {
                                     if (e.target?.classList.contains('contact-container')) {
                                         e.target?.getElementsByTagName('input')[0]?.focus()
                                     } else if (e.target?.classList.contains('contact-sub-container')) {
                                         e.target?.parentNode.getElementsByTagName('input')[0]?.focus()
                                     } else {
                                         e.target?.parentNode?.parentNode?.parentNode?.getElementsByTagName('input')[0]?.focus()

                                     }
                                 }, 10)

                                 setOpenMethod(null)

                                 setOpenMethod(openMethod === method ? null : method)
                             }}>

                            <div className={'contact-sub-container w-full flex items-center justify-center'}>
                                <div className={'w-16'}>
                                    <FontAwesomeIcon className={' my-2 w-16 text-2xl'} icon={contactIcons[method]}/>
                                </div>
                                <TextInput className={'mx-2 w-full my-5 dark:hover:bg-black hover:rounded ' +
                                    ((openMethod === method
                                        || rootSelectedContactMethods.filter(e => e.method === method && e.value?.replace(/\s/g, '') !== undefined).length) ? '' : ' hidden ')
                                }
                                           type={contactType[method]}
                                           inputClassName={'rounded-lg'}
                                           placeholder={contactPlaceholders[method]}
                                           value={rootSelectedContactMethods.filter(e => e.method == method)[0]?.value}
                                           onClick={(e) => e.stopPropagation()}
                                           handleChange={(e) => rootSetSelectedContactMethods(prevState => {
                                               let updatedContactMethods = rootSelectedContactMethods.filter(f => f.method !== method)

                                               if (e.target.value?.replace(/\s/g, '') !== '') {
                                                   updatedContactMethods.push({ method: method, value: e.target.value })
                                               } else {
                                                   delete rootSelectedContactMethods[
                                                       updatedContactMethods.indexOf(rootSelectedContactMethods.filter(f => f.method === method))
                                                       ]
                                               }

                                               return updatedContactMethods

                                           })}
                                />
                            </div>
                        </div>)}
                    {/*<a className={'text-xs'}>Suggest more contact methods...</a>*/}
                </div>


                <div className={'flex justify-center w-full'}>
                    <SecondaryButton
                        className={''}
                        onClick={() => setShowingForm(false)}>Cancel</SecondaryButton>
                </div>
            </div>

            : <div className={'flex justify-center w-full my-10'}>
                <PrimaryButton
                    icon={faPlus}
                    onClick={() => setShowingForm(true)}>
                    Add A new Contact Method</PrimaryButton>
            </div>
        }
    </div>
}
