import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faUser } from '@fortawesome/free-solid-svg-icons'
import ConversationMessage from '@/Pages/Messages/Components/ConversationMessage'
import { Link } from '@inertiajs/react'
import ConversationMessageForm from '@/Pages/Messages/Components/ConversationMessageForm'
import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '@/AppContext'

export default function Conversation ({ messageRef, isLoading, loadedConversation = [] }) {

  const containerRef = useRef()
  const [messages, setMessages] = useState(loadedConversation.data.messages)
  const { setModalShow, setModalData } = useContext(AppContext)
  useEffect(() => {
    window.scrollTo({ top: containerRef.current?.offsetHeight - 450, behavior: 'smooth' })
  })
  const openPerticipantsDialoge = () => {
    setModalShow(true)
    setModalData({
      title: <>
        {loadedConversation.data.participants.length} participant
        {loadedConversation.data.participants.length > 1 ? 's' : ''} found</>, content: <>
        <div className={'text-sm max-h-[300px] overflow-auto'}>
          {loadedConversation.data.participants.map(participant =>
            <Link href={participant.link} className={'block w-full dark:hover:bg-black transition-all cursor-pointer p-2'}>{participant.name}</Link>)}
        </div>
      </>,
    })
  }

  return loadedConversation && loadedConversation?.data ? <div className={'dark:bg-transparent backdrop-blur-2xl rounded-xl flex flex-col justify-between'}>
      <div>

        <div className={'flex justify-around items-center sticky top-16 pt-9 z-10 px-5 bg-grad-primary backdrop-blur-xl shadow  py-5'}>

          <div className={'w-full flex justify-around'}>
            {messages?.links?.map(link =>
              <Link href={link.url}
                    preserveScroll={true}
                    className={'dark:disabled:text-neutral-600 disabled:text-neutral-200'}
                    disabled={!link.url}
                    as={'button'}
                    dangerouslySetInnerHTML={{ __html: link.label }}/>)}
          </div>

          <div className={'flex w-4/12 gap-x-5 items-center justify-end px-5'}>
            <div className={'w-2/3 flex gap-0.5 justify-start'}>
              {loadedConversation.data?.participants?.slice(0, 4).map(participant => <Link
                href={route('user.single', participant.id)}
                className={'w-full flex opacity-50 hover:opacity-100 transition-all items-center justify-center' +
                  ' cursor-pointer'}>
                <div className={'w-8 aspect-square'} title={participant.name}>
                  {participant.profile_picture
                    ? <img src={participant.profile_picture}
                           title={participant.name}
                           className={'w-full h-full dark:bg-neutral-700 rounded '}/>
                    : <div className={'px-2'}><FontAwesomeIcon className={'w-full text-3xl block'} icon={faUser}/></div>
                  }
                </div>
              </Link>)}
            </div>
            <div
              onClick={openPerticipantsDialoge}
              className={'w-1/3 text-xs rounded hover:text-white cursor-pointer shadow select-none whitespace-nowrap text-neutral-500 text-center'}>
              {loadedConversation.data.participants_count} User(s)
            </div>

          </div>

        </div>
        <div ref={containerRef} className={'flex flex-wrap-reverse'}>{messages?.data?.length
          ? messages.data.map(message => <ConversationMessage setMessages={setMessages} message={message}/>)
          : <></>}</div>
      </div>
      <div className={'sticky bottom-0'}>
        <div className={'px-5 py-5 h-full'}>
          <ConversationMessageForm rows={1} conversation={loadedConversation}/>
        </div>
      </div>
    </div>
    : <div className={'w-full h-full flex items-center justify-center h-[70vh]'}><FontAwesomeIcon icon={faSpinner} spin={true}/></div>
}