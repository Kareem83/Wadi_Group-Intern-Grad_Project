<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\HomeContent;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $defaults = [
            'hero' => [
                'established' => 'Est. 1984',
                'title_line_1' => 'Transforming Desert',
                'title_line_2' => 'Into Prosperity',
                'tagline' => 'To Achieve. To Lead.',
            ],
            'stats' => [],
            'about' => [],
            'sectors' => [],
            'values' => [],
            'leaders' => [],
            'footer' => [],
        ];

        $content = HomeContent::query()
            ->get(['section', 'payload'])
            ->mapWithKeys(fn (HomeContent $item) => [$item->section => $item->payload])
            ->all();

        return response()->json(array_merge($defaults, $content));
    }
}
