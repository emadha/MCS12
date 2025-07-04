import ConversationMessageForm from '@/Pages/Messages/Components/ConversationMessageForm'
import UserSearchBox from '@/Components/UserSearchBox'
import Field from '@/Components/Form/Field'

export default function NewMessageForm ({ className, children }) {

  return <div className={'px-10 pt-5 pb-10'}>
    <ConversationMessageForm showSearchBox={true} conversation={{ data: { uuid: 'new' } }}/>
  </div>
}
