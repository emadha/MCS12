import { useForm } from '@inertiajs/react'
import TextArea from '@/Components/Form/TextArea'
import { useContext, useEffect, useRef } from 'react'
import UserSearchBox from '@/Components/UserSearchBox'
import Field from '@/Components/Form/Field'
import { AppContext } from '@/AppContext'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

export default function ConversationMessageForm ({ className, flash,rows = 7, conversation, containerRef, showSearchBox = false }) {
  const { lang } = useContext(AppContext)
  const { post, data, setData, reset, processing, errors, clearErrors } = useForm({
    'user': null,
    'message': '',
  })
  const { setModalShow } = useContext(AppContext)
  const ref = useRef()
  const checkUser = (e) => {
    setData('user', e.value)
  }

  useEffect(() => {
    clearErrors()
    reset('message', 'user')
  }, [])
  const submit = () => {
    let url = route('messages.send.post', conversation.data.uuid)

    if (!conversation.data.uuid) {
      url = route('messages.new.post')
    }

    post(url, {
      onSuccess: (e) => {
        if (conversation.data.uuid)
          setModalShow(false)

        setData('message', '')
        setTimeout(() => ref.current?.focus(), 500)
        //srouter.visit()
      }, preserveScroll: true, preserveState: false, onBefore: () => clearErrors(),
    })
  }
  return <>
    <form onSubmit={(e) => e.preventDefault() || submit()} className={'relative'}>
      {showSearchBox ? <Field>
        <UserSearchBox placeholder={'Search users here...'} onChange={checkUser}/></Field> : <></>
      }

      <input type={'hidden'} value={data.user}/>

      <TextArea textRef={ref} autofocus={true} disabled={processing} name={'message'} value={data.message}
                handleChange={(e) => setData('message', e.target.value) || clearErrors()}
                inputClassName={'h-full'}
                rows={rows}
                className={'h-full'}
                onEnter={e => submit()}
                placeholder={lang('Message', '...')}/>
      <PrimaryButton
      icon={faCoins}
        type={'submit'} className={'absolute rtl:left-2 rtl:right-auto right-2 bottom-2'} disabled={!data.message || processing}>
        {lang('Send')}
      </PrimaryButton>
    </form>

    <small className={'px-3 select-none opacity-20'}>
      1 credit will be deducted from your balance on every message.
    </small>
  </>
}
