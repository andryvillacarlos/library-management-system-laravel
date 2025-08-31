import DashboardLayout from "@/Layouts/DashboardLayout";
import { usePage, useForm, router } from "@inertiajs/react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function TypeSettings() {
  const { types } = usePage().props;

  // useForm instead of manual state
  const { data, setData, post, put, errors, processing, reset } = useForm({
    id: null,
    name: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleEdit = (type) => {
    setData({ id: type.id, name: type.name });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.id) {
      put(route("types.update", data.id), {
        onSuccess: () => {
          reset("id", "name");
          setShowForm(false);
        },
      });
    } else {
      post(route("types.store"), {
        onSuccess: () => {
          reset("id", "name");
          setShowForm(false);
        },
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route("types.destroy", id));
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Member Types</h1>
          <button
            className="bg-blue-500 text-white px-3 py-2 rounded"
            onClick={() => {
              reset("id", "name");
              setShowForm(true);
            }}
          >
            <Plus className="inline-block mr-2 h-4 w-4" /> Add Type
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="p-3 border">{type.id}</td>
                <td className="p-3 border">{type.name}</td>
                <td className="p-3 border flex gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleEdit(type)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(type.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal with animation */}
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
                  {data.id ? "Edit Type" : "Add Type"}
                </h2>
                <form onSubmit={handleSubmit}>
                  <label className="block mb-2">Type Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className={`w-full border rounded p-2 mb-1 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {/* Error Message */}
                  {errors.name && (
                    <p className="text-red-500 text-sm mb-3">{errors.name}</p>
                  )}

                  <div className="flex justify-end gap-2 mt-3">
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
