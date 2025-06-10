import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import ProfileSummary from './Partials/ProfileSummary';

export default function Edit({
    mustVerifyEmail,
    status,
    auth,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const handleUpdateImage = (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        router.post(route('profile.image.update'), formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleRemoveImage = () => {
        router.delete(route('profile.image.remove'), {
            preserveScroll: true,
        });
    };

    return (
        <div className='bg-gray-200 min-h-screen'>
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Profile
                    </h2>
                }
            >
                <Head title="Profile" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <ProfileSummary 
                                user={auth.user}
                                onUpdateImage={handleUpdateImage}
                                onRemoveImage={handleRemoveImage}
                            />
                        </div>
  
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
