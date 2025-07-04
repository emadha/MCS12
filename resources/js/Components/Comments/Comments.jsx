import SkeletonImage from 'antd/es/skeleton/Image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import React, { useContext, useEffect, useState } from 'react'
import TextArea from '@/Components/Form/TextArea'
import { AppContext } from '@/AppContext'
import { useForm } from '@inertiajs/react'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function Comments ({ h }) {
    const { lang } = useContext(AppContext)

    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSendingComment, setIsSendingComment] = useState(false)
    const { data, setData, errors, setError, clearErrors } = useForm({
        body: null,
        h: h,
    })

    useEffect(() => {
        setIsLoading(true)
        axios.get(route('comments.for', { h: h })).then(res => setComments(res.data)).finally(() => setIsLoading(false))
    }, [])

    const submit = (e) => {

        setIsSendingComment(true)
        axios.post(route('comments.submit'), data).finally(() => {
            setData('body', '')
            setIsSendingComment(false)
        })
        e.preventDefault()
    }

    const SingleCommentBlock = ({ comment }) =>
        <div key={comment.id} className={'w-full my-5 p-5'}>
            <div className={'flex'}>

                <div className={'mr-5'}>
                    <SkeletonImage/>
                </div>

                <div className={'flex flex-wrap content-between'}>

                    <div className={'w-full'}>
                        <p>{comment.body}</p>
                    </div>

                    <div className={'w-full text-xs flex space-x-5'}>

                        <div className={'space-x-1'}>
                            <span>Like</span>
                            <FontAwesomeIcon icon={faThumbsUp} className={'-mt-4 align-baseline '}/>
                        </div>
                        {comment.user && comment.user.name ? <div className={'font-bold'}>
                            {comment.user.name}
                        </div> : console.log('Comment User not loaded.')}

                        <div>
                            {comment.created_at}
                        </div>

                    </div>
                </div>
            </div>
        </div>

    return <>
        <div className={'w-full'}>
            <form onSubmit={submit}>
                <TextArea
                    name={'body'}
                    value={data.body}
                    handleChange={(e) => setData('body', e.target.value)}
                    placeholder={lang('Write your comment here...')}/>
                <PrimaryButton
                    type={'submit'}
                    processing={isSendingComment}
                    disabled={!data.body || isSendingComment}>
                    Comment
                </PrimaryButton>
            </form>
        </div>

        {isLoading
            ? <div><FontAwesomeIcon icon={faSpinner} spin={true}/></div>
            : comments && comments.data?.map(comment =>
            <SingleCommentBlock key={comment.id} comment={comment}/>)
        }

    </>
}
