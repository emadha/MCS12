import React from 'react'
import AdminWrapper from '@/Layouts/AdminWrapper'
import TextInput from '@/Components/Form/TextInput'
import { useForm } from '@inertiajs/react'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import Field from '@/Components/Form/Field'
import Hr from '@/Components/Hr'
import Alert from '@/Components/Alerts/Alert'

export default function Single ({ car }) {
    const {
        patch, data, setData,
        processing, wasSuccessful, recentlySuccessful,
    } = useForm(car.data)
    const submit = (e) => {
        e.preventDefault()
        patch(route('admin.cars_db.single.patch', data.id_trim))
    }

    return <form onSubmit={submit}>
        {recentlySuccessful ? <Alert type={'success'}>Updated successfully</Alert> : <></>}
        <table className={'mcs-tables'}>
            <thead>
            <tr>
                <th>Attribute</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {Object.keys(data).map(key => <tr>
                <td>{key}</td>
                <td>
                    <TextInput isLoading={processing}
                               handleChange={e => setData(key, e.target.value)}
                               inputClassName={'bg-transparent ring-0'}
                               value={data[key]}/>
                </td>
            </tr>)}
            </tbody>

            <Hr/>
            <Field>
                <PrimaryButton type={'submit'} processing={processing}>Save</PrimaryButton>
            </Field>
        </table>
    </form>
}
