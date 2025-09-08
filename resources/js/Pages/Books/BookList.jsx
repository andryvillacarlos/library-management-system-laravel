import DashboardLayout from "@/Layouts/DashboardLayout";
import { router } from "@inertiajs/react";
import BookTopBar from "./partial/BookTopBar";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

// Reusable Book Card component
function BookCard({ book, onDelete }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col justify-between hover:shadow-2xl transition duration-300">
      {/* Book Image */}
      <div className="relative w-full h-52 mb-4 overflow-hidden rounded-xl">
        <img
          src={`/storage/book_covers/${book.image_path}`}
          alt={book.title}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
          loading="lazy"
        />
      </div>

      {/* Book Info */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {book.title}
        </h2>
        <p className="text-sm text-gray-500">by {book.author}</p>
        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p>ISBN: {book.isbn}</p>
          <p>Year: {book.published_year}</p>
          <p>Copies: {book.copies}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-4 flex justify-center">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
            book.status === "available"
              ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
              : "bg-gradient-to-r from-red-400 to-red-600 text-white"
          }`}
        >
          {book.status}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex justify-between">
        <button
          onClick={() => router.get(route("books.edit", book.slug))}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-blue-500 text-white rounded-sm shadow hover:bg-blue-600 transition"
        >
          <Pencil size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(book.slug)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-red-500 text-white rounded-sm shadow hover:bg-red-600 transition"
        >
          <Trash2 size={16} /> Remove
        </button>
      </div>
    </div>
  );
}

export default function BookList({ books }) {
  const handleDelete = (slug) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This book will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route("books.destroy", slug), {
          onSuccess: () => {
            Swal.fire("Deleted!", "The book has been removed.", "success");
          },
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <BookTopBar routeName="books.index" />

      <div className="p-6">
        {books.data.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-lg font-medium">
            📚 Books are empty
          </div>
        ) : (
          <>
            {/* Book grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.data.map((book) => (
                <BookCard key={book.id} book={book} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination */}
            {books.meta.total > books.meta.per_page && (
              <div className="flex justify-center space-x-2 mt-6">
                {books.meta.links.map((link, index) => (
                  <button
                    key={index}
                    disabled={!link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      link.active
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                    onClick={() => {
                      if (link.url) {
                        router.get(link.url, {}, { preserveState: true, replace: true });
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
