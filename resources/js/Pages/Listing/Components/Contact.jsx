import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'
import { contactIcons } from '@/Components/NewContactMethodField'

export default function Contact ({ className, contacts }) {
    const { lang } = useContext(AppContext)
    const ContactButton = ({ method, value }) =>
        <div
            className={'w-full m-1 dark:text-neutral-200 bg-grad-primary text-indigo-950 group flex p-4 ' +
                'items-center relative justify-center rounded select-none cursor-pointer transition-all ' +
                ' dark:active:scale-110'} tabIndex={1}>
            <FontAwesomeIcon icon={contactIcons[method]}
                             className={'h-8 p-5 absolute group-hover:opacity-10 transition-all'}/>
            <strong className={'flex justify-between w-full drop-shadow group-hover:opacity-100 transition-all opacity-0 whitespace-nowrap delay-100'}>
                <span>{method}</span>
                <span>{value}</span>
            </strong>
        </div>
    return <div>
        {contacts.map(contact =>
            <div key={contact.id}>
                <ContactButton method={contact.method} value={contact.value}/>
            </div>,
        )}
    </div>
}
