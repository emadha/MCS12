import React, { useContext } from 'react'
import AdminWrapper from '@/Layouts/AdminWrapper'
import Field from '@/Components/Form/Field'
import PrimaryButton from '@/Components/Form/Buttons/PrimaryButton'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Hr from '@/Components/Hr'
import { AdminContext } from '@/AdminContext'

export default function Index ({ title, roles, permissions }) {
    const { lang } = useContext(AdminContext)
    return <>
        <Field className={'w-full p-5 rounded bg-grad-secondary shadow'}>
            <div className={'flex items-center gap-x-2 px-5 justify-between'}>
                <h4 className={'m-0'}>{lang('Roles')}</h4>
                <PrimaryButton className={''} size={'xs'} icon={faPlus}>Create a new Role</PrimaryButton>
            </div>
            <Hr/>
            <table className={'w-full'}>
                <thead className={''}>
                <tr className={'text-left rtl:text-right'}>
                    <th className={'px-5 w-20 text-left py-7'}>ID</th>
                    <th>Name</th>
                    <th>Created</th>
                </tr>
                </thead>
                <tbody>
                {roles?.map(role => <tr>
                    <td className={'px-5 py-2'}>{role.id}</td>
                    <td>{role.name}</td>
                    <td>{role.created_at}</td>
                </tr>)}
                </tbody>
            </table>
        </Field>

        <Field className={'w-full p-5 rounded bg-grad-secondary shadow'}>
            <div className={'flex items-center gap-x-2 px-5 justify-between'}>
                <h4 className={'m-0'}>{lang('Permissions')}</h4>
                <PrimaryButton className={''} size={'xs'} icon={faPlus}>Create a new Role</PrimaryButton>
            </div>
            <Hr/>
            <table className={'w-full'}>
                <thead className={''}>
                <tr className={'text-left rtl:text-right'}>
                    <th className={'px-5 w-20 text-left py-7'}>ID</th>
                    <th>Name</th>
                    <th>Created</th>
                </tr>
                </thead>
                <tbody>
                {permissions?.map(permission => <tr>
                    <td className={'px-5 py-2'}>{permission.id}</td>
                    <td>{permission.name}</td>
                    <td>{permission.created_at}</td>
                </tr>)}
                </tbody>
            </table>
        </Field>

    </>
}
