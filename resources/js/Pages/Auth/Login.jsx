import { useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT SIDE - LOGIN FORM */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-gray-50">
                <div className="w-full max-w-md space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600">Log in to manage your library system</p>

                    {status && (
                        <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                autoComplete="username"
                                autoFocus
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData("remember", e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-between">
                            {canResetPassword && (
                                <a
                                    href={route("password.request")}
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    Forgot password?
                                </a>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                            >
                                {processing ? "Logging in..." : "Log in"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* RIGHT SIDE - LIBRARY CONTENT */}
            <div className="hidden md:flex w-1/2 bg-indigo-600 text-white items-center justify-center p-12">
                <div className="max-w-md text-center space-y-6">
                    <h1 className="text-4xl font-bold">📚 Library Management System</h1>
                    <p className="text-lg text-indigo-100">
                        Organize books, manage members, and track transactions all in one
                        place. Efficient and easy to use.
                    </p>
                </div>
            </div>
        </div>
    );
}
