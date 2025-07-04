import { useContext, useEffect, useState } from 'react'
import Select from '@/Components/Form/Select'
import { faShop, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '@/AppContext'
import { Link } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MyShowroomSelect ({
    className, children, onChange, clearable, name,
    defaultValue, hasError,
}) {
    const [showrooms, setShowrooms] = useState([])
    const [loading, setLoading] = useState(false)
    const { lang } = useContext(AppContext)

    useEffect(e => {

        setLoading(true)

        axios.get('/api/my/showrooms').then(r => {
            setShowrooms(Object.values(r.data.showrooms ?? []).map((s, i) => {
                return { label: s.title, value: s.id }
            }))
        }).finally(() =>
            setLoading(false),
        )

    }, [])

    return loading
        ? <div className={'text-center flex items-center justify-center w-full'}><FontAwesomeIcon icon={faSpinner} spin={true}>Loading</FontAwesomeIcon></div>
        : showrooms.length
            ? <Select name={name}
                      clearable={true}
                      className={'w-full'}
                      leftIcon={faShop}
                      handleOnChange={onChange}
                      options={showrooms}
                      hasError={hasError}
                      defaultValue={defaultValue}
                      placeholder={'Select Showroom'}/>
            : <>
                <p className={'max-w-lg text-sm'}>
                    {lang('You don\'t have any showroom')} <Link
                    className={'link'}
                    href={route('shop.create')}>{lang('create one', ' ', 'here')}.</Link> {lang('Or unselect this option and add the car to it later')}.
                </p>
            </>
}
