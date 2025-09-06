import DashboardLayout from "@/Layouts/DashboardLayout";
import { usePage, router } from "@inertiajs/react";
import HistoryTopBar from "./partial/HistoryTopBar";

export default function HistoryList() {
  const { transactionHistory } = usePage().props;
  const { data, links, total, per_page } = transactionHistory;

  return (
    <DashboardLayout>
     <HistoryTopBar/>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Transaction History</h1>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Member</th>
                <th className="p-3 border-b">Book</th>
                <th className="p-3 border-b">Borrow Date</th>
                <th className="p-3 border-b">Return Date</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 text-sm">
                    <td className="p-3 border-b">{t.id}</td>
                    <td className="p-3 border-b">{t.member?.name}</td>
                    <td className="p-3 border-b">{t.book?.title}</td>
                    <td className="p-3 border-b">{t.borrow_date}</td>
                    <td className="p-3 border-b">{t.return_date}</td>
                    <td className="p-3 border-b">{t.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500 text-sm"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination styled like BookList/MemberList */}
        {total > per_page && (
          <div className="flex justify-center space-x-2 mt-6">
            {links.map((link, index) => (
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
