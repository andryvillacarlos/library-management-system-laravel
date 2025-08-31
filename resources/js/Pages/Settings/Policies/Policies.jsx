import DashboardLayout from "@/Layouts/DashboardLayout";
import { usePage, useForm, router } from "@inertiajs/react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function PolicySettings() {
  const { policies = [], types = [] } = usePage().props;

  // useForm
  const { data, setData, post, put, errors, processing, reset } = useForm({
    id: null,
    type_id: "",
    borrow_limit: "2", // keep as string for typing
    due_days: "1", // keep as string
  });

  const [showForm, setShowForm] = useState(false);

  const handleEdit = (policy) => {
    setData({
      id: policy.id,
      type_id: String(policy.type_id),
      borrow_limit: String(policy.borrow_limit),
      due_days: String(policy.due_days),
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cast only when submitting
    const payload = {
      ...data,
      borrow_limit: parseInt(data.borrow_limit) || 0,
      due_days: parseInt(data.due_days) || 0,
    };

    if (data.id) {
      put(route("policies.update", data.id), {
        data: payload,
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
      });
    } else {
      post(route("policies.store"), {
        data: payload,
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This policy will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route("policies.destroy", id), {
          onSuccess: () => {
            Swal.fire("Deleted!", "The policy has been removed.", "success");
          },
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Policies</h1>
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded"
            onClick={() => {
              reset();
              setShowForm(true);
            }}
          >
            <Plus className="inline-block mr-2 h-4 w-4" /> Add Policy
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Member Type</th>
              <th className="p-3 border">Borrow Limit</th>
              <th className="p-3 border">Due Days</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id} className="hover:bg-gray-50">
                <td className="p-3 border">{policy.id}</td>
                <td className="p-3 border">{policy.type?.name}</td>
                <td className="p-3 border">{policy.borrow_limit}</td>
                <td className="p-3 border">{policy.due_days}</td>
                <td className="p-3 border flex gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleEdit(policy)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(policy.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-xl w-96 shadow-xl"
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <h2 className="text-lg font-bold mb-4">
                  {data.id ? "Edit Policy" : "Add Policy"}
                </h2>

                {/* Global error block */}
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                    <ul className="list-disc list-inside">
                      {Object.values(errors).map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Type Dropdown */}
                  <label className="block mb-1 font-medium">Member Type</label>
                  <select
                    value={data.type_id}
                    onChange={(e) => setData("type_id", e.target.value)}
                    className={`w-full border rounded p-2 mb-3 ${
                      errors.type_id ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">-- Select Type --</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>

                  {/* Borrow Limit */}
                  <label className="block mb-1 font-medium">Borrow Limit</label>
                  <input
                    type="number"
                    value={data.borrow_limit}
                    onChange={(e) => setData("borrow_limit", e.target.value)}
                    className={`w-full border rounded p-2 mb-3 ${
                      errors.borrow_limit
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />

                  {/* Due Days */}
                  <label className="block mb-1 font-medium">Due Days</label>
                  <input
                    type="number"
                    value={data.due_days}
                    onChange={(e) => setData("due_days", e.target.value)}
                    className={`w-full border rounded p-2 mb-3 ${
                      errors.due_days ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  {/* Buttons */}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border rounded"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                      {processing ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
