import UserSearchBox from '@/Components/UserSearchBox'
import TextArea from '@/Components/Form/TextArea'
import { useContext, useState } from 'react'
import { AppContext } from '@/AppContext'
import Field from '@/Components/Form/Field'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { useForm } from '@inertiajs/react'
import Alert from '@/Components/Alerts/Alert'

export default function New () {
  const { lang } = useContext(AppContext)
  const {
    data, setData, post, processing, errors, reset,
    setError, clearErrors,
  } = useForm({ toUser: null, message: '' })

  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState('')

  const submit = () => {
    post(route('messages.new.post', data.toUser))
  }

  return <div className={'container p-10'}>

    <div className={'max-w-3xl mx-auto'}>
      <h3>Start a new Conversation</h3>
      {Object.values(errors).length ? Object.values(errors).length && <Alert type={'danger'}>
        {Object.values(errors).map(err => <div>{err}</div>)}
      </Alert> : <></>}
      <Field>
        <UserSearchBox onChange={(e) => {
          setData('toUser', e.value)
        }} placeholder={lang('Select a User to send them a message')}/>
      </Field>

      <Field>
        <TextArea placeholder={lang('Enter message body here...')}
                  handleChange={e => setData('message', e.target.value)}/>
      </Field>

      <Field>
        <PrimaryButton disabled={!data.toUser || processing} onClick={submit}>{lang('Send')}</PrimaryButton>
      </Field>
    </div>
  </div>
}
