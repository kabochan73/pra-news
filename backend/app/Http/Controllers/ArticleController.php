<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    public function index(): JsonResponse
    {
        $articles = Article::orderBy('published_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json($articles);
    }
}
