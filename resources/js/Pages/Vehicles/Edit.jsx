import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, vehicle }) {
    const { data, setData, patch, processing, errors } = useForm({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        price: vehicle.price || '',
        vin: vehicle.vin || '',
        color: vehicle.color || '',
        transmission: vehicle.transmission || 'automatic',
        mileage: vehicle.mileage || '',
        description: vehicle.description || '',
        status: vehicle.status || 'available',
    });

    const transmissionOptions = [
        { value: 'automatic', label: 'Automatic' },
        { value: 'manual', label: 'Manual' },
        { value: 'cvt', label: 'CVT' },
        { value: 'semi-automatic', label: 'Semi-Automatic' },
    ];

    const statusOptions = [
        { value: 'available', label: 'Available' },
        { value: 'reserved', label: 'Reserved' },
        { value: 'sold', label: 'Sold' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('vehicles.update', vehicle.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Vehicle</h2>}
        >
            <Head title="Edit Vehicle" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="make" value="Make" />
                                        <TextInput
                                            id="make"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.make}
                                            onChange={(e) => setData('make', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.make} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="model" value="Model" />
                                        <TextInput
                                            id="model"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.model} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="year" value="Year" />
                                        <TextInput
                                            id="year"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.year}
                                            onChange={(e) => setData('year', e.target.value)}
                                            required
                                            min="1900"
                                            max="2100"
                                        />
                                        <InputError message={errors.year} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="price" value="Price ($)" />
                                        <TextInput
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            required
                                            min="0"
                                        />
                                        <InputError message={errors.price} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="vin" value="VIN" />
                                        <TextInput
                                            id="vin"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.vin}
                                            onChange={(e) => setData('vin', e.target.value)}
                                            required
                                            maxLength="17"
                                        />
                                        <InputError message={errors.vin} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="color" value="Color" />
                                        <TextInput
                                            id="color"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.color} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="transmission" value="Transmission" />
                                        <select
                                            id="transmission"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.transmission}
                                            onChange={(e) => setData('transmission', e.target.value)}
                                            required
                                        >
                                            {transmissionOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.transmission} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="mileage" value="Mileage" />
                                        <TextInput
                                            id="mileage"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.mileage}
                                            onChange={(e) => setData('mileage', e.target.value)}
                                            required
                                            min="0"
                                        />
                                        <InputError message={errors.mileage} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select
                                            id="status"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            required
                                        >
                                            {statusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Update Vehicle
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
