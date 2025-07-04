import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, vehicle }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Vehicle Details</h2>}
        >
            <Head title={`${vehicle.make} ${vehicle.model}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">{vehicle.make} {vehicle.model} ({vehicle.year})</h1>
                        <div className="flex space-x-2">
                            <Link
                                href={route('vehicles.edit', vehicle.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Edit Vehicle
                            </Link>
                            <Link
                                href={route('vehicles.index')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                            >
                                Back to List
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>
                                        <div className="mt-4 space-y-4">
                                            <div className="grid grid-cols-2">
                                                <span className="text-sm text-gray-500">Make:</span>
                                                <span className="text-sm font-medium">{vehicle.make}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="text-sm text-gray-500">Model:</span>
                                                <span className="text-sm font-medium">{vehicle.model}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="text-sm text-gray-500">Year:</span>
                                                <span className="text-sm font-medium">{vehicle.year}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="text-sm text-gray-500">VIN:</span>
                                                <span className="text-sm font-medium">{vehicle.vin}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Price & Status</h3>
                                        <div className="mt-4 space-y-4">
                                            <div className="grid grid-cols-2">
                                                <span className="text-sm text-gray-500">Price:</span>
                                                <span className="text-sm font-medium">${vehicle.price.toLocaleString()}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="text-sm text-gray-500">Status:</span>
                                                <span className="text-sm font-medium">
                                                    <span className={
                                                        `px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                                                          vehicle.status === 'sold' ? 'bg-red-100 text-red-800' :
                                                          'bg-yellow-100 text-yellow-800'}`
                                                    }>
                                                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Technical Details</h3>
                                        <div className="mt-4 space-y-4">
                                            <div className="grid grid-cols-2">
                                                <span className="text-sm text-gray-500">Color:</span>
                                                <span className="text-sm font-medium">{vehicle.color}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="text-sm text-gray-500">Transmission:</span>
                                                <span className="text-sm font-medium">
                                                    {vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="text-sm text-gray-500">Mileage:</span>
                                                <span className="text-sm font-medium">{vehicle.mileage.toLocaleString()} miles</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                    <p className="text-sm text-gray-600">
                                        {vehicle.description || 'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-gray-200 pt-6 flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Added on: {new Date(vehicle.created_at).toLocaleDateString()}</p>
                                    {vehicle.updated_at !== vehicle.created_at && (
                                        <p className="text-sm text-gray-500">Last updated: {new Date(vehicle.updated_at).toLocaleDateString()}</p>
                                    )}
                                </div>
                                <Link
                                    href={route('vehicles.destroy', vehicle.id)}
                                    method="delete"
                                    as="button"
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                    preserveScroll
                                >
                                    Delete Vehicle
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
