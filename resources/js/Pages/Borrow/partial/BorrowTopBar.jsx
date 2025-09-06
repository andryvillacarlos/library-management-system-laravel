import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Search, PlusCircle, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BorrowTopBar({ routeName = "transaction.borrow.list" }) {
  const { filters, types } = usePage().props;
  const [search, setSearch] = useState(filters?.search || "");
  const [searched, setSearched] = useState(!!filters?.search);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") return;
    router.get(
      route(routeName),
      { ...filters, search, type_id: filters?.type_id || "all" },
      { preserveState: true, replace: true }
    );
    setSearched(true);
  };

  const handleTypeChange = (value) => {
    router.get(
      route(routeName),
      { ...filters, type_id: value, search },
      { preserveState: true, replace: true }
    );
  };

  const clearSearch = () => {
    setSearch("");
    router.get(route(routeName), { type_id: filters?.type_id || "all" });
    setSearched(false);
  };

  const goBack = () => {
    setSearch("");
    router.get(route(routeName), { type_id: filters?.type_id || "all" });
    setSearched(false);
  };

  return (
    <div className="w-full p-4 bg-white shadow rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
      {/* Left: Search */}
      <form onSubmit={handleSearch} className="flex items-center w-full sm:w-1/2">
        <div className="relative w-full">
          {!searched ? (
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          ) : (
            <button
              type="button"
              onClick={goBack}
              className="absolute left-2 top-2.5 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search borrows..."
            className="w-full pl-10 pr-8 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Right: Filter + New Borrow */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        {/* Type Filter Dropdown */}
        <Select
          defaultValue={filters?.type_id || "all"}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-full sm:w-[150px] rounded-2xl">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type.id} value={String(type.id)}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Add Borrow Button */}
        <Button
          variant="info"
          onClick={() => router.visit(route("transaction.borrow.form"))}
          className="flex items-center gap-2 rounded-2xl shadow-md w-full sm:w-auto justify-center"
        >
          <PlusCircle size={18} />
          New Borrow
        </Button>
      </div>
    </div>
  );
}
