import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function AddBook() {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: "",
    author: "",
    isbn: "",
    published_year: "",
    copies: "",
    image_path: null, // for file uploads
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setData(name, files ? files[0] : value); // handles text & file
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("books.store"), {
      forceFormData: true, // 👈 tells Inertia to send FormData (needed for files)
      onSuccess: () => reset(),
    });
  };

  const inputClass =
    "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 " +
    "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";

  const buttonClass =
    "px-10 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500";

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-10">
        <div className="w-full max-w-5xl rounded-lg p-6 sm:p-8">
          <button
            onClick={() => history.back()}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={24} />
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            Add New Book
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Fill out the form to add a new book to your library
          </p>

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={data.author}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={data.isbn}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter ISBN number"
              />
              {errors.isbn && (
                <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
              )}
            </div>

            {/* Published Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Published Year
              </label>
              <input
                type="number"
                name="published_year"
                value={data.published_year}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter year"
              />
              {errors.published_year && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.published_year}
                </p>
              )}
            </div>

            {/* Copies */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Copies
              </label>
              <input
                type="number"
                name="copies"
                value={data.copies}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter number of copies"
              />
              {errors.copies && (
                <p className="mt-1 text-sm text-red-600">{errors.copies}</p>
              )}
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Book Cover (optional)
              </label>
              <input
                type="file"
                name="image_path"
                accept="image/*"
                onChange={handleChange}
                className={inputClass + " py-2"}
              />
              {errors.image_path && (
                <p className="mt-1 text-sm text-red-600">{errors.image_path}</p>
              )}
            </div>

            {/* Submit */}
            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                disabled={processing}
                className={buttonClass}
              >
                {processing ? "Adding..." : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
