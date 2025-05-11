<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\ContactFormRequest;
use App\Models\ContactForm;
use Illuminate\Http\JsonResponse;

class ContactController extends APIController
{
    final public function store(ContactFormRequest $request): JsonResponse
    {
        if (ContactForm::query()->create($request->validated())) {
            return response()->json(['message' => 'Contact form submitted successfully']);
        }

        return response()->json(['message' => 'Failed to submit contact form']);
    }
}
