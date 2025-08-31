import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function EditMember() {
  const { member, types } = usePage().props;

  const { data, setData, put, processing, errors } = useForm({
    name: member.name || "",
    email: member.email || "",
    phone: member.phone || "",
    address: member.address || "",
    type_id: member.type_id || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("members.update", member.slug));
  };

  const inputClass =
    "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500";
  const buttonClass =
    "px-10 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500";

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-lg md:max-w-4xl rounded-lg p-6 md:p-8 bg-white">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
            Edit Member
          </h2>
          <p className="text-gray-600 text-center mb-6 md:mb-8 text-sm md:text-base">
            Update the details of this member
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Member Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Member Type
              </label>
              <select
                name="type_id"
                value={data.type_id}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">-- Select Type --</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type_id && (
                <p className="mt-1 text-sm text-red-600">{errors.type_id}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                value={data.address}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter address"
                rows="3"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Submit */}
            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                disabled={processing}
                className={`${buttonClass} w-full md:w-auto`}
              >
                {processing ? "Updating..." : "Update Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
