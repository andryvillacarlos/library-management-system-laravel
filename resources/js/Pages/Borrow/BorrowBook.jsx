import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function BorrowBookForm() {
  const { members, books } = usePage().props;

  const { data, setData, post, processing, errors, reset } = useForm({
    member_id: "",
    book_id: "",
    borrow_date: null,
  });

  const [openMember, setOpenMember] = useState(false);
  const [openBook, setOpenBook] = useState(false);
  const [memberQuery, setMemberQuery] = useState("");
  const [bookQuery, setBookQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("transaction.borrow.store"), { onSuccess: () => reset() });
  };

  const filteredMembers = members.data.filter((m) =>
    m.name.toLowerCase().includes(memberQuery.toLowerCase())
  );

  const filteredBooks = books
    .filter((b) => b.copies > 0)
    .filter((b) => b.title.toLowerCase().includes(bookQuery.toLowerCase()));

  // Get selected member info
  const selectedMember = members.data.find(
    (m) => m.id.toString() === data.member_id
  );
  const currentBorrowed = selectedMember?.current_borrowed ?? 0;
 const borrowLimit = selectedMember?.type?.borrow_limit ?? 0;

  const borrowLimitReached =
    selectedMember && currentBorrowed >= borrowLimit;

  const datePickerProps = {
    fullWidth: true,
    variant: "outlined",
    size: "medium",
    sx: { height: 50 },
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-10">
        <div className="w-full max-w-2xl rounded-lg p-6 sm:p-8 shadow">
          <button
            onClick={() => history.back()}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={24} />
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            Borrow Book
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Fill out the form to record a new borrow transaction
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {/* Member Select */}
            <div className="w-full relative">
              <label className="block text-sm font-medium text-gray-700">
                Member
              </label>
              <Button
                type="button"
                variant="outline"
                className="w-full text-left h-12"
                onClick={() => setOpenMember(!openMember)}
              >
                {data.member_id
                  ? selectedMember?.name
                  : "-- Select Member --"}
              </Button>
              {openMember && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                  <Command>
                    <CommandInput
                      placeholder="Search member..."
                      value={memberQuery}
                      onValueChange={setMemberQuery}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <CommandList>
                      <CommandEmpty>No member found.</CommandEmpty>
                      <CommandGroup>
                       {filteredMembers.map((m) => (
                          <CommandItem
                            key={m.id}
                            onSelect={() => {
                              setData("member_id", m.id.toString());
                              setOpenMember(false);
                              setMemberQuery("");
                            }}
                          >
                          {m.name} ({m.type?.name}) - Limit: {m.type?.borrow_limit ?? 0}

                          </CommandItem>
                        ))}

                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
              {errors.member_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.member_id}
                </p>
              )}
              {/* Borrow limit info */}
              {selectedMember && (
                <>
                  <p className="mt-1 text-sm text-gray-700">
                    Borrowed: {currentBorrowed} / {borrowLimit}
                  </p>
                  {borrowLimitReached && (
                    <p className="mt-1 text-sm text-red-600">
                      Borrow limit reached!
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Book Select */}
            <div className="w-full relative">
              <label className="block text-sm font-medium text-gray-700">
                Book
              </label>
              <Button
                type="button"
                variant="outline"
                className="w-full text-left h-12"
                onClick={() => setOpenBook(!openBook)}
              >
                {data.book_id
                  ? books.find((b) => b.id.toString() === data.book_id)?.title
                  : "-- Select Book --"}
              </Button>
              {openBook && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                  <Command>
                    <CommandInput
                      placeholder="Search book..."
                      value={bookQuery}
                      onValueChange={setBookQuery}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    <CommandList>
                      <CommandEmpty>No book available.</CommandEmpty>
                      <CommandGroup>
                        {filteredBooks.map((b) => (
                          <CommandItem
                            key={b.id}
                            onSelect={() => {
                              setData("book_id", b.id.toString());
                              setOpenBook(false);
                              setBookQuery("");
                            }}
                          >
                            {b.title} ({b.copies} copies)
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
              {errors.book_id && (
                <p className="mt-1 text-sm text-red-600">{errors.book_id}</p>
              )}
            </div>

            {/* Borrow Date */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Borrow Date
              </label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={data.borrow_date}
                  onChange={(newValue) => setData("borrow_date", newValue)}
                  slotProps={{ textField: datePickerProps }}
                />
              </LocalizationProvider>
              {errors.borrow_date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.borrow_date}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="md:col-span-2 text-center pt-4">
              <Button
                type="submit"
                disabled={
                  processing || (selectedMember && borrowLimitReached)
                }
                className="w-full"
              >
                {processing ? "Saving..." : "Save Transaction"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
