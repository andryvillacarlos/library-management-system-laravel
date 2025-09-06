import DashboardLayout from "@/Layouts/DashboardLayout";
import { usePage, router } from "@inertiajs/react";
import BorrowTopBar from "./partial/BorrowTopBar";
import { Check } from "lucide-react";
import Swal from "sweetalert2";

export default function ListBorrow() {
  const { borrows } = usePage().props;

  const markAsReturned = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this book as returned?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34D399",
      cancelButtonColor: "#F87171",
      confirmButtonText: "Yes, return it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(
          route("transaction.return", id),
          {},
          {
            onSuccess: () => {
              Swal.fire("Returned!", "The book has been marked as returned.", "success");
            },
            onError: () => {
              Swal.fire("Error!", "Something went wrong. Please try again.", "error");
            },
          }
        );
      }
    });
  };

  return (
    <DashboardLayout>
      <BorrowTopBar />

      {/* Borrow List Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm border rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Member</th>
              <th className="px-4 py-2 border">Book</th>
              <th className="px-4 py-2 border">Borrow Date</th>
              <th className="px-4 py-2 border">Return Date</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {borrows.data.length > 0 ? (
              borrows.data.map((borrow) => (
                <tr key={borrow.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{borrow.id}</td>
                  <td className="px-4 py-2 border">{borrow.member.name}</td>
                  <td className="px-4 py-2 border">{borrow.book.title}</td>
                  <td className="px-4 py-2 border">{borrow.borrow_date}</td>
                  <td className="px-4 py-2 border">{borrow.return_date || "-"}</td>
                  <td className="px-4 py-2 border">{borrow.member.type.name}</td>
                  <td className="px-4 py-2 border">
                    {borrow.status === "borrowed" ? (
                      <button
                        onClick={() => markAsReturned(borrow.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition"
                      >
                        <Check size={16} />
                        Return
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
                        <Check size={16} />
                        Returned
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center px-4 py-6 text-gray-500 italic">
                  No borrow records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (only show if this page has max results, e.g. 10) */}
      {borrows.data.length === borrows.meta.per_page && (
        <div className="flex justify-center space-x-2 mt-6">
          {borrows.meta.links.map((link, index) => (
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
    </DashboardLayout>
  );
}
