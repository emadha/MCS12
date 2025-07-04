import Select from '@/Components/Form/Select'
import { useState } from 'react'

export default function UserSearchBox ({ placeholder, onChange = Function }) {

    const [options, setOptions] = useState([])
    const [target, setTarget] = useState(null)

    const searchForUsers = (e) => {
        axios.post(route('api.user.search'), { user: e.target.value }).then(res => {
            setOptions(res.data.data.map(user => {
                return { label: user.email, value: user.id, picture: user.profile_picture }
            }))
        })
    }

    return <Select
        autoComplete={false}
        multi={true}
        options={options}
        placeholder={placeholder}
        clearable={false}
        handleOnChange={e => {
            setTarget(e.value)
            onChange(e)
        }}
        onInputChange={searchForUsers}
    />
}
