import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AdminDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Administration Panel</h1>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {auth.user.can.manage_users && (
                                    <div className="bg-blue-50 rounded-lg p-6 shadow-md">
                                        <h3 className="text-lg font-semibold mb-3">User Management</h3>
                                        <p className="text-gray-600 mb-4">Manage users, roles and permissions</p>
                                        <Link
                                            href={route('admin.users.index')}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Manage Users
                                        </Link>
                                    </div>
                                )}

                                <div className="bg-green-50 rounded-lg p-6 shadow-md">
                                    <h3 className="text-lg font-semibold mb-3">Vehicle Management</h3>
                                    <p className="text-gray-600 mb-4">Manage the vehicle inventory</p>
                                    <Link
                                        href={route('vehicles.index')}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Manage Vehicles
                                    </Link>
                                </div>

                                {auth.user.can.manage_system && (
                                    <div className="bg-purple-50 rounded-lg p-6 shadow-md">
                                        <h3 className="text-lg font-semibold mb-3">System Settings</h3>
                                        <p className="text-gray-600 mb-4">Configure system-wide settings</p>
                                        <Link
                                            href="#"
                                            className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            System Settings
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
