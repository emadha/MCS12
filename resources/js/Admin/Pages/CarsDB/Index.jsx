import React, { useContext, useEffect } from 'react'
import AdminWrapper from '@/Layouts/AdminWrapper'
import TextInput from '@/Components/Form/TextInput'
import Field from '@/Components/Form/Field'
import { faPlus, faSearch, faSortAsc, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AdminContext } from '@/AdminContext'
import { Link, router } from '@inertiajs/react'

export default function Index ({ cars = [] }) {

    const { titleOptions, setTitleOptions } = useContext(AdminContext)

    useEffect(() => {
        setTitleOptions([{ title: 'Add New Entry', icon: faPlus, onClick: () => router.visit(route('admin.cars_db.new')) }])
    }, [])

    const ThField = ({ name, label }) => <th>
        <div className={'flex items-center group select-none transition-all cursor-pointer hover:opacity-100 opacity-50 py-10 '}>
            <span className={'w-full'}>{label}</span>
            <span className={'mt-2 '}><FontAwesomeIcon icon={faSortUp}/></span>
        </div>
    </th>

    return <>

        <Field>
            <div>
                <TextInput placeholder={'Search here...'} icon={faSearch} clearable={true}/>
            </div>
        </Field>

        <table className={'mcs-tables'}>
            <thead>
            <tr>
                <ThField name={'id'} label={'ID'}/>
                <ThField name={'id'} label={'Make'}/>
                <ThField name={'id'} label={'Model'}/>
                <ThField name={'id'} label={'Trim'}/>
                <ThField name={'id'} label={'Used'}/>
                <ThField name={'id'} label={'Last Updated'}/>
            </tr>
            </thead>
            <tbody>
            {cars.data.length && cars.data.map(car =>
                <Link as={'tr'} href={car.link}>
                    <td>{car.id_trim}</td>
                    <td>{car.make}</td>
                    <td>{car.model}</td>
                    <td>{car.trim}</td>
                    <td>{car.series}</td>
                    <td>{car.updated_at}</td>
                </Link>)}
            </tbody>
        </table>
    </>
}
