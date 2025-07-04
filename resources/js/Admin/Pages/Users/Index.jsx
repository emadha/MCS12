import React, { useContext } from 'react'
import { Link } from '@inertiajs/react'
import { AdminContext } from '@/AdminContext'
import Hr from '@/Components/Hr'

export default function Index ({ title, users = [] }) {
    const { lang } = useContext(AdminContext)

    return <>
        <table className={'mcs-table table'}>
            <thead>
            <tr className={'text-left'}>
                <th>#</th>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Last Activity</th>
                <th>Last Login</th>
                <th>Updated At</th>
                <th>Creatd At</th>
                <th>E-mail Verified At</th>
            </tr>
            </thead>
            <tbody>
            {Object.values(users).length ? users.data.map(user =>
                <tr className={''}>
                    <td className={'py-2'}>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.created_at_formatted}</td>
                    <td>{user.updated_at_formatted}</td>
                    <td>{user.login_at_formatted}</td>
                    <td>{user.activity_at_formatted}</td>
                </tr>,
            ) : <></>}
            </tbody>
        </table>

        <Hr/>

        <div className={'flex gap-x-2 justify-center'}>

        </div>

    </>
}
