<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
             "id" => $this->id,
             "title" => $this->title,
             "author" => $this->author,
             "isbn" => $this->isbn,
             "published_year" =>  $this->published_year,
             "copies" => $this->copies,
             "status" => $this->status,
             "image_path" => $this->image_path,
             "slug" => $this->slug,
          ];
    }
}
