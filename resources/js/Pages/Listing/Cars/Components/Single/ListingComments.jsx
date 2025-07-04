import ListingBlockBase from '@/Pages/Listing/Components/ListingBlockBase'
import Comments from '@/Components/Comments/Comments'
import TextArea from '@/Components/Form/TextArea'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { AppContext } from '@/AppContext'

export default function ListingComments ({ className, comments }) {
  const { lang } = useContext(AppContext)

  return <>
    {comments ?
      <ListingBlockBase className={'' + (className ? ' ' + className : '')}
                        title={lang('Comments') + ' (' + comments.length + ')'}>
        <Comments comments={comments}/>

        <div className={'my-5'}>
          <TextArea className={'my-5 block'} name={'comment_body'}></TextArea>
          <PrimaryButton icon={faSave}>Submit Comment</PrimaryButton>
        </div>

      </ListingBlockBase>
      : console.error('Item Comments not set.')}
  </>
}