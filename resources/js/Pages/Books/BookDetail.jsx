import DashboardLayout from "@/Layouts/DashboardLayout";
import { router } from "@inertiajs/react";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

export default function BookDetail({ book }) {
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `This book "${book.title}" will be permanently deleted!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route("books.destroy", book.slug), {
          onSuccess: () => {
            Swal.fire("Deleted!", "The book has been removed.", "success");
            router.visit(route("books.index"));
          },
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.get(route("books.index"))}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Books
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Book Image */}
          <div className="md:w-1/2 h-80 md:h-auto">
            <img
              src={`/storage/book_covers/${book.image_path}`}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book Info */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-lg text-gray-500 mb-4">by {book.author}</p>

              {/* Status */}
              <span
                className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full shadow-sm ${
                  book.status === "available"
                    ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                    : "bg-gradient-to-r from-red-400 to-red-600 text-white"
                }`}
              >
                {book.status}
              </span>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
                  <p className="text-sm text-gray-500">ISBN</p>
                  <p className="font-semibold">{book.isbn}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center shadow-sm">
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-semibold">{book.published_year}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center shadow-sm">
                  <p className="text-sm text-blue-600">Total Copies</p>
                  <p className="text-lg font-bold text-blue-700">{book.copies.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center shadow-sm">
                  <p className="text-sm text-green-600">Available</p>
                  <p className="text-lg font-bold text-green-700">{book.available}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl text-center shadow-sm">
                  <p className="text-sm text-yellow-600">Borrowed</p>
                  <p className="text-lg font-bold text-yellow-700">{book.borrowed}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl text-center shadow-sm">
                  <p className="text-sm text-red-600">Overdue</p>
                  <p className="text-lg font-bold text-red-700">{book.overdue}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => router.get(route("books.edit", book.slug))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                <Pencil size={18} /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                <Trash2 size={18} /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
