import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

// Social Media Icons Components
const FacebookIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const GoogleIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

// Wrapper Komponen Tombol Sosial
type SocialButtonProps = {
    icon: JSX.Element;
    onClick: () => void;
    className?: string;
};

const SocialButton = ({ icon, onClick, className = "" }: SocialButtonProps) => (
    <div 
        className={`w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-md ${className}`}
        onClick={onClick}
    >
        {icon}
    </div>
);


export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Ganti: Redirect ke halaman eksternal
    const handleSocialRedirect = (url: string) => {
        window.open(url, "_blank");
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="min-h-screen bg-gradient-to-br from-slate-200 via-blue-100 to-slate-300 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl">
                    <div className="bg-white backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
                        <div className="flex flex-col lg:flex-row min-h-[600px]">

                            {/* Left Panel */}
                            <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex flex-col justify-center">
                                <div className="max-w-md mx-auto w-full">
                                    <div className="text-center mb-8">
                                        <h1 className="text-3xl lg:text-3xl font-bold text-gray-700 mb-6">
                                            SIGN IN TO
                                        </h1>
                                        <p className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-wide drop-shadow-sm uppercase mb-6">
                                            TIMSAR
                                        </p>

                                        {/* Tombol Sosial */}
                                        <div className="flex justify-center space-x-4 mb-6">
                                            <SocialButton 
                                                icon={<FacebookIcon />}
                                                onClick={() => handleSocialRedirect("https://www.facebook.com")}
                                            />
                                            <SocialButton 
                                                icon={<GoogleIcon />}
                                                onClick={() => handleSocialRedirect("https://www.google.com")}
                                            />
                                            <SocialButton 
                                                icon={<LinkedInIcon />}
                                                onClick={() => handleSocialRedirect("https://www.linkedin.com")}
                                            />
                                        </div>

                                        <p className="text-gray-600 text-sm mb-8">
                                            or use your email account:
                                        </p>
                                    </div>

                                    {/* Status Message */}
                                    {status && (
                                        <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                            {status}
                                        </div>
                                    )}

                                    {/* Form Login */}
                                    <form onSubmit={submit} className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="username" value="Username" />
                                            <TextInput
                                                id="username"
                                                type="text"
                                                name="username"
                                                value={data.username}
                                                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white shadow-sm"
                                                autoComplete="username"
                                                isFocused={true}
                                                onChange={(e) => setData("username", e.target.value)}
                                            />
                                            <InputError message={errors.username} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="password" value="Password" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white shadow-sm"
                                                autoComplete="current-password"
                                                onChange={(e) => setData("password", e.target.value)}
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div className="mt-4 block">
                                            <label className="flex items-center">
                                                <Checkbox
                                                    name="remember"
                                                    checked={data.remember}
                                                    onChange={(e) => setData("remember", e.target.checked)}
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    Remember me
                                                </span>
                                            </label>
                                        </div>

                                        <div className="mt-4 flex flex-col items-center text-center gap-2">
                                            <div>
                                                {canResetPassword && (
                                                    <Link
                                                        href={route("password.request")}
                                                        className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                                                    >
                                                        Forgot your password?
                                                    </Link>
                                                )}
                                            </div>

                                            <PrimaryButton
                                                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full transition-colors duration-200"
                                                disabled={processing}
                                            >
                                                {processing ? 'Processing...' : 'Log in'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Right Panel */}
                            <div className="lg:w-1/2 bg-gradient-to-br from-slate-500 to-[#1C3B47] p-8 lg:p-12 flex flex-col justify-center text-white">
                                <div className="max-w-md mx-auto w-full text-center">
                                    <h2 className="text-5xl lg:text-6xl font-extrabold tracking-wider drop-shadow-md uppercase mb-6">
                                        Hallo Ges!
                                    </h2>
                                    <div className="space-y-1 mb-3">
                                        <p className="text-lg text-white/90">
                                            Enter Your Personal Details
                                        </p>
                                        <p className="text-lg text-white/90">
                                            and Start Journey With us
                                        </p>
                                    </div>

                                    <Link
                                        href={route("register")}
                                        className="bg-[#B0CAD4] text-gray-900 font-semibold px-10 py-3 rounded-full shadow hover:opacity-90 transition"
                                    >
                                        SIGN UP
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
