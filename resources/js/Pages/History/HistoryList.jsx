import DashboardLayout from "@/Layouts/DashboardLayout";
import { usePage, router } from "@inertiajs/react";
import HistoryTopBar from "./partial/HistoryTopBar";

export default function HistoryList() {
  const { transactionHistory } = usePage().props;
  const { data, meta } = transactionHistory;
  const paginationLinks = meta?.links ?? [];

  return (
    <DashboardLayout>
      <HistoryTopBar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Transaction History</h1>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="p-3 border-b">Member</th>
                <th className="p-3 border-b">Book</th>
                <th className="p-3 border-b">Action</th>
                <th className="p-3 border-b">Notes</th>
                <th className="p-3 border-b">Borrow Date</th>
                <th className="p-3 border-b">Action Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((t, index) => (
                  <tr key={index} className="hover:bg-gray-50 text-sm">
                    <td className="p-3 border-b">{t.member?.name}</td>
                    <td className="p-3 border-b">
                      {t.book?.title}{" "}
                      <span className="text-gray-500 text-xs">
                        by {t.book?.author}
                      </span>
                    </td>
                    <td className="p-3 border-b capitalize">{t.action}</td>
                    <td className="p-3 border-b">{t.notes}</td>
                    <td className="p-3 border-b">{t.borrow_date}</td>
                    <td className="p-3 border-b">{t.action_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-500 text-sm"
                  >
                    No transaction history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {((meta.current_page === 1 && meta.total > meta.per_page) ||
          meta.current_page !== 1) && (
          <div className="flex justify-center space-x-2 mt-6">
            {paginationLinks.map((link, index) => (
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
      </div>
    </DashboardLayout>
  );
}
