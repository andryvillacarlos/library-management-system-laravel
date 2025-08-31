import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AddMember() {
  const { types } = usePage().props;

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    type_id: "",
  });

  const handleChange = (name, value) => setData(name, value);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("members.store"), {
      onSuccess: () => reset(),
    });
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
            Add New Member
          </h2>
          <p className="text-gray-600 text-center mb-6 md:mb-8 text-sm md:text-base">
            Fill out the form to register a new member
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
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Member Type (shadcn Select) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Member Type
              </label>
              <Select
                value={data.type_id.toString()}
                onValueChange={(val) => handleChange("type_id", val)}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="-- Select Type --" />
                </SelectTrigger>
                <SelectContent className="max-h-40 overflow-y-auto">
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                onChange={(e) => handleChange("email", e.target.value)}
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
                onChange={(e) => handleChange("phone", e.target.value)}
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
                onChange={(e) => handleChange("address", e.target.value)}
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
                {processing ? "Saving..." : "Add Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
