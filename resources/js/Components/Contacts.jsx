import React, { useContext, useEffect, useState } from 'react'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { AppContext } from '@/AppContext'
import { faCircleQuestion, faGlobe, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import Hr from '@/Components/Hr'
import NewContactMethodField from '@/Components/NewContactMethodField'

export default function Contacts ({
    className,
    allowedContactMethods = [],
    show = false,
    rootSelectedContactMethods = [],
    rootSetSelectedContactMethods = () => {},
}) {

    const [selectedMethods, setSelectedMethods] = useState(rootSelectedContactMethods ?? [])
    const { lang } = useContext(AppContext)
    const [showingForm, setShowingForm] = useState(show)
    const [openMethods, setOpenMethods] = useState([])
    const [showNewContactMethod, setShowNewContactMethod] = useState(false)
    const [, set] = useState()

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
    useEffect(() => {

        let filteredMethods = selectedMethods.filter(f=>f)
        rootSetSelectedContactMethods(() => selectedMethods)
    }, [selectedMethods])

    return <div className={'my-3 flex justify-center flex-wrap rounded ' + (className ? ' ' + className : '')}>


        {selectedMethods.length && selectedMethods?.filter(f => f).length ? <div className={'w-full'}>
            {selectedMethods.map((selectedMethod, i) =>
                <> {selectedMethod ?
                    <div className={'flex gap-x-2'}>
                        <NewContactMethodField
                            index={i}
                            allowedContactMethods={allowedContactMethods}
                            setSelectedMethods={setSelectedMethods}
                            selectedMethod={selectedMethod?.method}
                            selectedValue={selectedMethod?.value}/>
                    </div> : <></>}
                </>,
            )}<Hr/></div> : <></>
        }

        {openMethods.map(openMethod => <>{openMethod}</>)}

        <PrimaryButton onClick={() => setSelectedMethods(prevState => [
            ...prevState,
            { method: allowedContactMethods[0], value: null },
        ])}>
            New Contact Method
        </PrimaryButton>

    </div>
}
