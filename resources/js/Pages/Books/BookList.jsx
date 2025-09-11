import DashboardLayout from "@/Layouts/DashboardLayout";
import { router } from "@inertiajs/react";
import BookTopBar from "./partial/BookTopBar";

// Reusable Book Card component
function BookCard({ book }) {
  return (
    <div
      onClick={() => router.get(route("books.show", book.slug))}
      className="bg-white shadow-lg rounded-2xl p-5 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition duration-300 cursor-pointer"
    >
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

        <div className="mt-3 w-full text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium text-gray-900">ISBN:</span>{" "}
            {book.isbn}
          </p>
          <p>
            <span className="font-medium text-gray-900">Year:</span>{" "}
            {book.published_year}
          </p>
          <p>
            <span className="font-medium text-gray-900">Total Copies:</span>{" "}
            {book.copies.toLocaleString()}
          </p>
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
    </div>
  );
}

export default function BookList({ books }) {
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
                <BookCard key={book.id} book={book} />
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
