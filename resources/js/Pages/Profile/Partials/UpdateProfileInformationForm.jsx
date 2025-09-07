import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        profile_picture: null, // store File object for upload
    });

    const fileInputRef = useRef(null);

    // Preview: stored image or default
    const [preview, setPreview] = useState(
        user?.profile_pic ? `/storage/profile_pics/${user.profile_pic}` : '/default-avatar.png'
    );

    // Handle file selection
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('profile_picture', file);
            setPreview(URL.createObjectURL(file)); // temporary preview
        }
    };

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);

        if (data.profile_picture instanceof File) {
            formData.append('profile_picture', data.profile_picture);
        }

        // Send FormData via Inertia
        post(route('profile.update'), formData, { forceFormData: true });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your name, email, and profile picture.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Profile Picture */}
                <div>
                    <InputLabel value="Profile Picture" />
                    <div
                        className="mt-3 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition"
                        onClick={openFilePicker}
                    >
                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="h-24 w-24 rounded-full object-cover border border-gray-200 shadow mb-3"
                        />

                        <div className="flex items-center gap-2 text-gray-600">
                            <Upload className="w-5 h-5" />
                            <span className="text-sm">Click to upload a new picture</span>
                        </div>

                        <input
                            type="file"
                            name="profile_picture"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <InputError className="mt-2" message={errors.profile_picture} />
                </div>

                {/* Name */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Email Verification */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-blue-600 underline hover:text-blue-800"
                            >
                                Resend verification email
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent!
                            </div>
                        )}
                    </div>
                )}

                {/* Save Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">Saved successfully!</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
