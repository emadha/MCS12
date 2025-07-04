import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, users }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                        {auth.user.can.create_users && (
                            <Link
                                href={route('admin.users.create')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Add New User
                            </Link>
                        )}
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.length > 0 ? (
                                            users.data.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {user.roles.map(role => (
                                                            <span key={role.id} className={
                                                                `px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-1
                                                                ${role.name === 'super-admin' ? 'bg-red-100 text-red-800' :
                                                                  role.name === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                                  'bg-green-100 text-green-800'}`
                                                            }>
                                                                {role.name.charAt(0).toUpperCase() + role.name.slice(1).replace('-', ' ')}
                                                            </span>
                                                        ))}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link href={route('admin.users.show', user.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">View</Link>
                                                        {auth.user.can.edit_users && (
                                                            <Link href={route('admin.users.edit', user.id)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</Link>
                                                        )}
                                                        {auth.user.can.delete_users && user.id !== auth.user.id && (
                                                            <Link href={route('admin.users.destroy', user.id)} method="delete" as="button" className="text-red-600 hover:text-red-900" preserveScroll>
                                                                Delete
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6">
                                {/* Pagination would go here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
