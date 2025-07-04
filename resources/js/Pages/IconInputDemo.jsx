import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import IconInputExample from '@/Examples/IconInputExample';

export default function IconInputDemo({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Icon Input Demo</h2>}
        >
            <Head title="Icon Input Demo" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <IconInputExample />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
