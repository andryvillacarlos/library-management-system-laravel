import DashboardLayout from "@/Layouts/DashboardLayout";
import { usePage, router, Link } from "@inertiajs/react";
import MemberTopBar from "./partial/MemberNav";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function MemberList() {
  const { members } = usePage().props;

  const handleDelete = (slug) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This member will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route("members.destroy", slug)
        );
      }
    });
  };

  return (
    <DashboardLayout>
      <MemberTopBar routeName="members.index" />

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Members</h1>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Phone</th>
                <th className="p-3 border-b">Address</th>
                <th className="p-3 border-b">Type</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.data.length > 0 ? (
                members.data.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 text-sm">
                    <td className="p-3 border-b">{member.id}</td>
                    <td className="p-3 border-b">{member.name}</td>
                    <td className="p-3 border-b">{member.email}</td>
                    <td className="p-3 border-b">{member.phone}</td>
                    <td className="p-3 border-b whitespace-pre-line">{member.address}</td>
                    <td className="p-3 border-b">{member.type?.name || "—"}</td>
                    <td className="p-3 border-b text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={route('members.edit', member.slug)}
                          className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(member.slug)}
                          className="p-2 rounded bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500 text-sm">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination styled like BookList */}
        {members.meta.total > members.meta.per_page && (
          <div className="flex justify-center space-x-2 mt-6">
            {members.meta.links.map((link, index) => (
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
