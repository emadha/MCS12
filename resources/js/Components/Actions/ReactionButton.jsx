import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from 'react'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { AppContext } from '@/AppContext'
import MainButton from '@/Components/Form/Buttons/MainButton'
import toast from 'react-hot-toast'
import { usePage } from '@inertiajs/react'

export default function ReactionButton ({
    className, item,
    iconClassName,
    showCount = true, showText = false,
}) {

    const [inFavorites, setInFavorites] = useState(item.favorites?.inFavorites)
    const [favoritesCount, setFavoritesCount] = useState(item.favorites?.favoritesCount)
    const [buttonsDisabled, setButtonDisabled] = useState(false)
    const { lang, api, rtl } = useContext(AppContext)
    const { pageRTL } = usePage().props

    function addToFavorite (e) {
        e.preventDefault()
        e.stopPropagation()

        setButtonDisabled(1)
        api.post(route('actions.item.reaction'), { h: item.h }).then(res => {
            if (res.data) {
                setFavoritesCount(res.data.favoritesCount ?? 0)
                setInFavorites(res.data.inFavorites)
                toast.success(
                    (lang(!res.data.inFavorites ? 'Item removed from favorites' : 'Item added to favorites')),
                    { position: 'bottom-right' },
                )
            } else {
                toast.error(lang('Error'))
            }
        }).finally(r => {
            setButtonDisabled(false)
        })
    }

    return <MainButton icon={inFavorites ? faHeartSolid : faHeart}
                       className={'' +
                           (className ? ' ' + className : '') +
                           (inFavorites ? ' text-red-500 opacity-100 ' : ' opacity-20 hover:opacity-80')
                       }
                       disabled={buttonsDisabled}
                       processing={buttonsDisabled}
                       iconClassName={iconClassName}
                       onClick={e => addToFavorite(e)}>
        {showCount ? <strong className={className}>{favoritesCount}</strong> : <></>}
        {showText
            ? <span className={'mx-2'}>{inFavorites ? 'Unlike' : 'Like'}</span>
            : <></>}
    </MainButton>
}
