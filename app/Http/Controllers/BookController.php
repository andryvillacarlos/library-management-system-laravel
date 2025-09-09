<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use Illuminate\Support\Facades\Storage;


class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index() {
    
        $search = request()->input('search');
        $status = request()->input('status', 'all'); // default to 'all'
        $query = Book::query();

        // 🔍 Search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                ->orWhere('author', 'like', "%{$search}%")
                ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        // 📌 Filter by books.status
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $books = $query
            ->orderBy('title')
            ->paginate(8)
            ->onEachSide(1)
            ->appends(request()->only(['search', 'status']));

        return inertia('Books/BookList', [
            'books'   => BookResource::collection($books),
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
}

/**
* Show the form for creating a new resource.
*/
public function create() {
  return inertia('Books/BookAdd');
}

/**
* Store a newly created resource in storage.
*/
public function store(StoreBookRequest $request){
        
        $data = $request->validated();

            // Handle optional book cover
        if ($request->hasFile('image_path')) {
            $image = $request->file('image_path');
            $imageName = time() . '_' . $image->getClientOriginalName();

            // Store on 'public' disk explicitly
            $image->storeAs('book_covers', $imageName, 'public');

            $data['image_path'] = $imageName;
        }

        // Do NOT unset image_path here

        // Create book
        Book::create($data);

        // Redirect with success
        return redirect()->route('books.index');
}


/**
 * Display the specified resource.
*/
public function show(Book $book) {
            //
}

/**
* Show the form for editing the specified resource.
*/
public function edit(Book $book) {
        return inertia('Books/EditBook',[
            "book" => $book,
        ]);
}

        /**
         * Update the specified resource in storage.
         */
public function update(UpdateBookRequest $request, Book $book) {
        
        $data = $request->validated();

        // 📸 If a new image is uploaded
        if ($request->hasFile('image_path')) {
            $image = $request->file('image_path');
            $imageName = time() . '_' . $image->getClientOriginalName();

            // Delete old image if it exists
            if ($book->image_path && Storage::disk('public')->exists("book_covers/{$book->image_path}")) {
                Storage::disk('public')->delete("book_covers/{$book->image_path}");
            }

            // Save new image
            $image->storeAs('book_covers', $imageName, 'public');
            $data['image_path'] = $imageName;
        } else {
            // 🚨 Important: keep old image if none uploaded
            unset($data['image_path']);
        }

        // 📝 Update book
        $book->update($data);

        return redirect()
            ->route('books.index')
            ->with('success', 'Book updated successfully.');
}


    /**
     * Remove the specified resource from storage.
     */
   public function destroy(Book $book)
{
    // If the book has a cover image, delete it from storage
    if ($book->image_path && Storage::disk('public')->exists("book_covers/{$book->image_path}")) {
        Storage::disk('public')->delete("book_covers/{$book->image_path}");
    }

    // Delete the book itself
    $book->delete();

    // Redirect back with a success message
    return redirect()
        ->route('books.index')
        ->with('success', 'Book deleted successfully.');
  }
}
