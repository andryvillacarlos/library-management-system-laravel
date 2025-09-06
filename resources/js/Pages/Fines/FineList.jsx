import DashboardLayout from "@/Layouts/DashboardLayout";
import { usePage, Link } from "@inertiajs/react";
import FineTopBar from "./partial/FinesTopBar";

export default function FineList() {
  const { fines } = usePage().props;

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
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Status</th>
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
