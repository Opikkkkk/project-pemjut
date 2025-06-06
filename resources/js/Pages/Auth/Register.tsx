import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
    
            <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-200 via-blue-100 to-slate-300">
                <div className="flex flex-col lg:flex-row bg-white text-gray-800 rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full mx-4">
                    {/* Kiri: Welcome */}
                    <div className="lg:w-1/2 bg-gradient-to-br from-slate-500 to-[#1C3B47] p-8 lg:p-12 flex flex-col justify-center items-center text-white">
                        <div className="text-center">
                            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-wider drop-shadow-md uppercase mb-6">WELCOME</h1>
                            <p className="mb-2 text-md">To keep connected with us please</p>
                            <p className="mb-6 text-md">login with your personal info</p>
                            <Link
                                href={route('login')}
                                className="bg-[#B0CAD4] text-gray-900 font-semibold px-10 py-3 rounded-full shadow hover:opacity-90 transition"
                            >
                                SIGN IN
                            </Link>
                        </div>
                    </div>
    
                    {/* Kanan: Form */}
                    <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                        <form onSubmit={submit} className="w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
    
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
    
                            <div className="mt-4">
                                <InputLabel htmlFor="username" value="Username" />
                                <TextInput
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                />
                                <InputError message={errors.username} className="mt-2" />
                            </div>
    
                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>
    
                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>
    
                            <div className="mt-4">
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>
    
                            <div className="mt-6 flex justify-center">
                        <PrimaryButton className="px-10 py-3" disabled={processing}>
                            SIGN UP
                        </PrimaryButton>
                    </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );    
}
