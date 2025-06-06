import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="min-h-screen bg-gradient-to-br from-slate-200 via-blue-100 to-slate-300 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">
                    <div className="bg-white backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
                        <div className="flex flex-col lg:flex-row min-h-[600px]">
                            {/* Kiri: Welcome Panel */}
                            <div className="lg:w-1/2 bg-gradient-to-br from-slate-500 to-[#1C3B47] p-8 lg:p-12 flex flex-col justify-center items-center text-white">
                                <div className="text-center">
                                    <h1 className="text-4xl font-bold mb-6 tracking-wide">Forgot Password?</h1>
                                    <p className="text-md mb-6">
                                        Don't worry! Enter your email and we'll send you a reset link.
                                    </p>
                                </div>
                            </div>

                            {/* Kanan: Form Panel */}
                            <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                                <form onSubmit={submit} className="w-full max-w-md">
                                    {status && (
                                        <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                            {status}
                                        </div>
                                    )}

                                    <div className="mb-4 text-sm text-gray-600 text-center">
                                        Forgot your password? No problem. Just let us know your email address and
                                        we’ll email you a password reset link that will allow you to choose a new one.
                                    </div>

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email"
                                    />

                                    <InputError message={errors.email} className="mt-2" />

                                    <div className="mt-6 flex justify-center">
                                        <PrimaryButton className="px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-full transition" disabled={processing}>
                                            {processing ? 'Sending...' : 'Send Reset Link'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
