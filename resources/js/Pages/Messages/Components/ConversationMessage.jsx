import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExclamationTriangle, faUser} from '@fortawesome/free-solid-svg-icons'
import Alert from '@/Components/Alerts/Alert'
import ContextMenu from '@/Components/ContextMenu'
import ConfirmForm from '@/Components/Forms/ConfirmForm'
import ReportForm from '@/Components/Forms/ReportForm'
import {useContext} from 'react'
import {AppContext} from '@/AppContext'

export default function ConversationMessage({className, message, setMessages}) {
  const {setModalShow, setModalData, lang} = useContext(AppContext)
  const contextOnClick = (action) => {
    switch (action) {
      case 'unsend': {
        setModalData({
          content: <ConfirmForm action={'unsend'} item={message}/>,
        })
        setModalShow(true)
        break
      }

      case 'report': {

        setModalShow(false)
        setModalShow(true)

        setModalData({
          title: lang('Report'), content: <ReportForm h={message.h}/>,
        })
      }
    }
  }

  return message ? <div
      key={message.id}
      tabIndex={1}
      className={'w-full p-2 px-10 group even:bg-blue-700/5 dark:even:bg-neutral-900/30 dark:odd:bg-neutral-800/20 rounded flex items-center space-x-2 space-y-2'}>
    <div className={'flex items-center justify-center content-start pt-5 flex-wrap h-full'}>
      <div className={'w-12 aspect-square rounded overflow-hidden h-max'}>
        {message.user.profile_picture
            ? <img src={message.user.profile_picture}
                   className={'w-full rounded h-full'}
                   alt={message.first_name}/>

            : <div className={'bg-neutral-200 dark:bg-neutral-900 p-4 text-neutral-400 dark:text-neutral-600 flex items-center justify-center'}><FontAwesomeIcon
                className={'h-full w-full rounded'} icon={faUser}/></div>
        }
      </div>
      <div className={'text-xs w-full text-center dark:text-neutral-500'}>{message.user.name}</div>
    </div>

    <div className={'w-full h-full relative flex items-start flex-wrap'}>

      <div className={'flex w-full justify-between items-end pb-2'}>
        <div className={'w-9/12'}></div>
        <div className={'flex items-center px-5 select-none'}>
          <strong className={'text-xs dark:text-neutral-500 dark:group-odd:text-neutral-500 group-odd:text-neutral-500 dark:group-even:text-neutral-600 group-even:text-neutral-500'}>
            {message.created_at}
          </strong>
        </div>
      </div>

      <p className={'text-sm w-full px-5 pb-5'} dangerouslySetInnerHTML={{__html: message.content}}/>
    </div>
    <ContextMenu className={'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'} h={message.h} onClick={contextOnClick}/>
  </div> : <Alert type={'danger'}><FontAwesomeIcon icon={faExclamationTriangle}/> Could not fetch message</Alert>

}
