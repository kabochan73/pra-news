<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class FetchZennArticles extends Command
{
    protected $signature = 'zenn:fetch';
    protected $description = 'Fetch latest Laravel articles from Zenn and summarize with Claude';

    private const MAX_ARTICLES = 50;
    private const FETCH_COUNT = 10;

    public function handle(): void
    {
        $this->info('Fetching Zenn articles...');

        $response = Http::get('https://zenn.dev/api/articles', [
            'topicname' => 'laravel',
            'order' => 'latest',
            'count' => self::FETCH_COUNT,
        ]);

        if (!$response->successful()) {
            $this->error('Failed to fetch articles from Zenn.');
            return;
        }

        $articles = $response->json('articles', []);
        $newCount = 0;

        foreach ($articles as $article) {
            $url = 'https://zenn.dev' . $article['path'];

            if (Article::where('url', $url)->exists()) {
                $this->line("Skip (already exists): {$article['title']}");
                continue;
            }

            $body = $this->fetchArticleBody($article['slug']);
            $summary = $this->summarize($article['title'], $body);

            if ($summary === null) {
                $this->warn("Failed to summarize: {$article['title']}");
                continue;
            }

            Article::create([
                'title' => $article['title'],
                'url' => $url,
                'author' => $article['user']['username'] ?? 'unknown',
                'published_at' => $article['published_at'],
                'tags' => array_map(fn($t) => $t['name'], $article['topics'] ?? []),
                'summary' => $summary,
            ]);

            $this->info("Saved: {$article['title']}");
            $newCount++;
        }

        $this->pruneOldArticles();

        $this->info("Done. {$newCount} new articles saved.");
    }

    private function fetchArticleBody(string $slug): string
    {
        $response = Http::get("https://zenn.dev/api/articles/{$slug}");

        if (!$response->successful()) {
            return '';
        }

        $html = $response->json('article.body_html', '');
        $text = strip_tags($html);
        $text = preg_replace('/\s+/', ' ', $text);

        return mb_substr(trim($text), 0, 3000);
    }

    private function summarize(string $title, string $body): ?string
    {
        $content = "以下のZenn記事を日本語で5文以内で要約してください。\n\nタイトル: {$title}\n\n本文:\n{$body}";

        $response = Http::withHeaders([
            'x-api-key' => config('services.anthropic.api_key'),
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->post('https://api.anthropic.com/v1/messages', [
            'model' => 'claude-haiku-4-5',
            'max_tokens' => 300,
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $content,
                ],
            ],
        ]);

        if (!$response->successful()) {
            return null;
        }

        return $response->json('content.0.text');
    }

    private function pruneOldArticles(): void
    {
        $count = Article::count();

        if ($count <= self::MAX_ARTICLES) {
            return;
        }

        $deleteCount = $count - self::MAX_ARTICLES;
        $oldest = Article::orderBy('published_at')->limit($deleteCount)->pluck('id');
        Article::whereIn('id', $oldest)->delete();

        $this->info("Deleted {$deleteCount} old articles.");
    }
}
