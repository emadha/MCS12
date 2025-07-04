import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, vehicles }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Vehicles</h2>}
        >
            <Head title="Vehicles" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Vehicle Inventory</h1>
                        <Link
                            href={route('vehicles.create')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Add New Vehicle
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make/Model</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {vehicles.data.length > 0 ? (
                                            vehicles.data.map((vehicle) => (
                                                <tr key={vehicle.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{vehicle.make} {vehicle.model}</div>
                                                        <div className="text-sm text-gray-500">VIN: {vehicle.vin}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.year}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vehicle.price.toLocaleString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={
                                                            `px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                                                              vehicle.status === 'sold' ? 'bg-red-100 text-red-800' :
                                                              'bg-yellow-100 text-yellow-800'}`
                                                        }>
                                                            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link href={route('vehicles.show', vehicle.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">View</Link>
                                                        <Link href={route('vehicles.edit', vehicle.id)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</Link>
                                                        <Link href={route('vehicles.destroy', vehicle.id)} method="delete" as="button" className="text-red-600 hover:text-red-900" preserveScroll>
                                                            Delete
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No vehicles found. Add a new vehicle to get started.
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
