import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faUser } from '@fortawesome/free-solid-svg-icons'
import PageContainer from '@/Layouts/PageContainer'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'

export default function Single ({ className, user, title, shops, listings = [] }) {

    const { lang, settings } = useContext(AppContext)

    return <PageContainer>
        <div className={'container'}>

            <div className={'flex items-center space-x-10 rounded ' +
                ''}>
                {user.data.profile_picture ?
                    <img className={'rounded-full'} src={user.data.profile_picture}/>
                    : <FontAwesomeIcon icon={faUser} className={'text-5xl'}></FontAwesomeIcon>}

                <div>
                    <h1 className={'mb-0'}>{user.data.name}</h1>
                    <div className={'flex items-center gap-x-2'}>
            <span
                className={'flex gap-x-2 items-center text-xs'}
                title={user.data.email_verified_at ? 'Verified E-mail' : 'E-mail not verified.'}>
              <FontAwesomeIcon icon={faAt} className={'' +
                  (user.data.email_verified_at ? ' text-green-500 ' : ' text-neutral-200')
              }/>
              <span>{user.data.email_verified_at ? 'Verified E-mail' : 'E-mail not verified.'}</span>
            </span>
                        - <span className={'text-xs inline-block'}>Joined <strong>{user.data.created_at_formatted}</strong></span>
                    </div>
                </div>
            </div>
        </div>
    </PageContainer>
}
