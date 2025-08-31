
import { Link } from "@inertiajs/react";
export default function NotFound() {
    return (
        <div className="min-h-screen flex">
            {/* Left Section */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-7xl font-bold text-indigo-600">404</h1>
                <p className="mt-4 text-xl text-gray-700">
                    Oops! Page not found.
                </p>
  
                <Link href={'/'}  className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
