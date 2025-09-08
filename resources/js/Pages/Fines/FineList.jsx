import DashboardLayout from "@/Layouts/DashboardLayout";
import { usePage, Link, router } from "@inertiajs/react";
import FineTopBar from "./partial/FinesTopBar";
import Swal from "sweetalert2";
export default function FineList() {
  const { fines } = usePage().props;

const handleMarkAsPaid = (fineId) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to mark this fine as paid?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#34D399",
    cancelButtonColor: "#F87171",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      router.post(route("fines.paid", fineId), {}, {
        onSuccess: () => {
          Swal.fire("Paid", "The fine has been paid successfully", "success");
          // Optimistically update the table row in memory
          const finesCopy = [...fines.data];
          const index = finesCopy.findIndex(f => f.id === fineId);
          if (index !== -1) finesCopy[index].is_paid = true;
          setFines({ ...fines, data: finesCopy });
        },
        onError: () => {
          Swal.fire("Error!", "Something went wrong. Please try again.", "error");
        },
      });
    }
  });
};




  if (!fines) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Fines List</h1>
          <p className="text-gray-500">No fines found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <FineTopBar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Fines List</h1>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Member</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {fines.data?.length > 0 ? (
                fines.data.map((fine, index) => (
                  <tr key={fine.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">
                      {(fines.meta.current_page - 1) * fines.meta.per_page +
                        (index + 1)}
                    </td>
                    <td className="px-4 py-2 border font-medium">
                      {fine.member?.name}
                    </td>
                    <td className="px-4 py-2 border">{fine.member?.email}</td>
                    <td className="px-4 py-2 border">{fine.member?.phone}</td>
                    <td className="px-4 py-2 border">{fine.member?.address}</td>
                    <td className="px-4 py-2 border">{fine.member?.type?.name}</td>
                    <td className="px-4 py-2 border text-right">
                      ₱ {fine.amount}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {fine.is_paid ? (
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 border text-center">
                     <button
                      onClick={() => handleMarkAsPaid(fine.id)}
                      disabled={fine.is_paid}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 
                        ${fine.is_paid 
                          ? "text-white cursor-not-allowed" 
                          : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                      {fine.is_paid ? "✔" : "Mark as Paid"}
                    </button>

                      </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No fines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (only show if results equal per_page, e.g. 10) */}
        {fines.data?.length === fines.meta.per_page && (
          <div className="flex justify-center mt-4 space-x-2">
            {fines.meta?.links?.map((link, index) => (
              <Link
                key={index}
                href={link.url || "#"}
                className={`px-3 py-1 rounded ${
                  link.active
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${!link.url ? "pointer-events-none opacity-50" : ""}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
