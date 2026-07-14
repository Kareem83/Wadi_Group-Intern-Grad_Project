<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactMessageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject' => ['required', 'string', 'max:190'],
            'message' => ['required', 'string', 'max:5000'],
            'status' => ['sometimes', 'string', Rule::in(['new', 'in_progress', 'closed'])],
        ]);

        $contactMessage = ContactMessage::query()->create([
            ...$validated,
            'status' => $validated['status'] ?? 'new',
        ]);

        return response()->json([
            'message' => 'Contact message submitted successfully.',
            'data' => $contactMessage,
        ], 201);
    }
}
