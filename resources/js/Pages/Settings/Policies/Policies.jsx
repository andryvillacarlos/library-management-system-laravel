import DashboardLayout from "@/Layouts/DashboardLayout";
import { usePage, useForm } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PolicySettings() {
  const { policies = [], types = [] } = usePage().props;

  // useForm
  const { data, setData, put, errors, processing, reset } = useForm({
    id: null,
    type_id: "",
    borrow_limit: "2",
    due_days: "1",
  });

  const [showForm, setShowForm] = useState(false);

  // ✅ Only Edit handler
  const handleEdit = (policy) => {
    setData({
      id: policy.id,
      type_id: String(policy.type_id),
      borrow_limit: String(policy.borrow_limit),
      due_days: String(policy.due_days),
    });
    setShowForm(true);
  };

  // ✅ Handle submit (always update, no create)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.id) {
      put(route("policies.update", data.id), {
        onSuccess: () => {
          setShowForm(false);
          reset();
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Policies</h1>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal (only for edit) */}
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
                <h2 className="text-lg font-bold mb-4">Edit Policy</h2>

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
                
                  {/* Member Type */}
                  <label className="block mb-1 font-medium">Member Type</label>
                  <input
                    type="text"
                    value={types.find((t) => String(t.id) === String(data.type_id))?.name || ""}
                    readOnly
                    className="w-full border rounded p-2 mb-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />


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
                      onClick={() => {
                        setShowForm(false);
                        reset();
                      }}
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
