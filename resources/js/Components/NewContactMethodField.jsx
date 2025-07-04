import React, { createRef } from 'react'
import Select from '@/Components/Form/Select'
import TextInput from '@/Components/Form/TextInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faGlobe, faMultiply, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'

export const contactIcons = {
    'FACEBOOK': faFacebook,
    'EMAIL': faEnvelope,
    'PHONE': faPhone,
    'WHATSAPP': faWhatsapp,
    'INSTAGRAM': faInstagram,
    'TIKTOK': faTiktok,
    'WEBSITE': faGlobe,
    'OTHER': faCircleQuestion,
}

export default function NewContactMethodField ({
    index, selectedMethod,
    selectedValue,
    allowedContactMethods = [],
    setSelectedMethods,
}) {

    const ref = createRef()

    /**
     * Guess the Method from the input field
     * a http://instagram.com/------
     * will auto select Instagram as the method type
     * @param url
     * @param index
     */
    const guessMethodFromUrl = (url, index) => {

    }

    return <>
        <div className={'flex gap-x-2 items-center contents-stretch'} ref={ref}>
            <Select
                clearable={false}
                defaultValue={selectedMethod}
                className={'w-2/6 text-xs select-none'}
                leftIcon={contactIcons[selectedMethod]}
                handleOnChange={(e) => {
                    setSelectedMethods(prevState => {
                        prevState[index].method = e.value
                        return [...prevState]
                    })
                }}
                options={allowedContactMethods.map(a => {
                    return { label: a, value: a }
                })}/>
            <TextInput
                className={'w-3/6 text-xs'}
                value={selectedValue}
                handleChange={(e) => {
                    setSelectedMethods(prevState => {
                        prevState[index].value = e.target.value
                        return [...prevState]
                    })
                }}/>

            <span className={'h-12 w-12 cursor-pointer transition-all ' +
                'hover:bg-white/10 hover:text-orange-500 dark:hover:text-white rounded flex justify-center items-center'}
                  onClick={() =>
                      setSelectedMethods(prevState => {
                          delete prevState[index]
                          return [...prevState]
                      })
                  }>
                <FontAwesomeIcon
                    icon={faMultiply}
                />
            </span>
        </div>
    </>
}
