import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useEffect, useRef, useState } from 'react'
import Conversation from '@/Pages/Messages/Conversation'
import { AppContext } from '@/AppContext'
import { Link } from '@inertiajs/react'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import ContextMenu from '@/Components/ContextMenu'
import ReportForm from '@/Components/Forms/ReportForm'
import NewMessageForm from '@/Components/Forms/NewMessageForm'

export default function Index({ title, conversations = [], conversation }) {
    const [loadingConversation, setLoadingConversation] = useState(false)
    const [composeDialog, setComposeDialog] = useState(false)
    const messageRef = useRef(null)
    const { setModalShow, setModalData } = useContext(AppContext)
    const contextOnClick = (action) => {
        switch (action) {
            case 'leave': {
                break
            }

            case 'report': {
                setModalShow(false)
                setModalShow(true)

                setModalData({
                    title: lang('Report'), content: <ReportForm h={conversation.data.h}/>,
                })
            }
        }
    }
    useEffect(() => {
        messageRef.current?.scrollIntoView()
    }, [])

    useEffect(() => {
        setModalData({ title: lang('NEW_CONVERSATION_BTN'), content: <NewMessageForm/> })
        setModalShow(composeDialog)
    }, [composeDialog])

    const { lang } = useContext(AppContext)

    return <div className={'container mx-auto my-20'}>
        {conversations.data?.length ?
            <div className={'w-full flex flex-wrap items-stretch '}>

                <div className={'w-full lg:w-4/12 max-h-[65vh] rounded sticky top-16 z-20 overflow-auto'}>

                    <div className={'py-3 text-neutral-500 bg-white dark:bg-neutral-900 z-20 px-7 pt-6 pb-3 sticky top-0 flex justify-between items-center flex-wrap '}>
                        <div className={'w-full flex-wrap flex justify-between items-center text-xs gap-x-2'}>
                            <h1 className={'text-xl m-0'}>{lang('Boards')}</h1>
                            <PrimaryButton icon={faEdit} className={'z-20'} href={''} onClick={() => setComposeDialog(false)}>
                                Start a new Conversation
                            </PrimaryButton>
                        </div>
                    </div>

                    <div>
                        {conversations.data.map(conversationBrief =>
                            <div className={'flex px-3 flex-wrap w-full bg-white dark:bg-neutral-900 shadow'}>
                                <Link href={conversationBrief.link + '?page=1'}
                                      disabled={loadingConversation}
                                      as={'div'}
                                      onBefore={(e) => setLoadingConversation(true)}
                                      onFinish={() => setLoadingConversation(false)}

                                      preserveScroll={true}
                                      className={'w-full flex mb-1 relative items-center p-2 !px-5 cursor-pointer rounded transition-all '
                                          + (conversationBrief.link === conversation?.data.link ? ' bg-slate-200 dark:bg-blue-900 opacity-100 text-neutral-800 dark:text-white ' : ' ')
                                          + (loadingConversation
                                              ? ' !text-neutral-700 grayscale !opacity-50 !dark:hover:!bg-neutral-900 !dark:bg-neutral-800'
                                              : ' hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white dark:text-neutral-500 text-neutral-700 ')}>

                                    <div className={'flex'}>
                                        {conversationBrief.last_sender.profile_picture
                                            ? <img src={conversationBrief.last_sender.profile_picture}

                                                   className={'w-14 aspect-square bg-neutral-700 rounded '}/>
                                            : <div className={'w-14 bg-white dark:bg-neutral-900 text-center aspect-square flex items-center justify-center rounded'}>
                                                <FontAwesomeIcon icon={faUser}/>
                                            </div>}
                                    </div>

                                    <div className={'w-11/12'}>
                                        <div className={'px-2 flex justify-between'}>
                                            <strong>{conversationBrief.last_sender.name}</strong>
                                            <p>{conversationBrief.created_at}</p>
                                        </div>

                                        <p className={'px-2 break-all text-xs'}>{conversationBrief.last_message}</p>
                                    </div>
                                    <ContextMenu onClick={contextOnClick} h={conversationBrief.h} type={'messages'}/>
                                </Link>
                            </div>,
                        )}</div>
                </div>
                <div className={'w-full lg:w-8/12'}>
                    <div className={'mb-3'}>
                        {conversation?.data ? <Conversation messageRef={messageRef} loadedConversation={conversation} isLoading={loadingConversation}/> : <></>}
                    </div>

                </div>
            </div>
            : <div className={'flex w-full items-center justify-center min-h-[50vh]'}>
                <div className={'dark:text-neutral-500'}>
                    <div className={'text-center space-y-2'}>
                        <p>{lang('No Conversations found')}</p>
                        <PrimaryButton size={'lg'}
                                       onClick={e => setModalShow(true) || setComposeDialog(true)} className={'dark:text-neutral-200'}>
                            {lang('NEW_CONVERSATION_BTN')}</PrimaryButton>
                    </div>
                </div>

            </div>}
    </div>
}
