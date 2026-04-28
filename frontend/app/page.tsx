import { cacheLife } from "next/cache";
import type { Article } from "@/app/types/article";
import ArticleList from "@/app/components/ArticleList";

async function getArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("days");

  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/articles`);
  if (!res.ok) return [];
  return res.json();
}

export default async function Page() {
  const articles = await getArticles();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 mb-8">
        Zenn Laravel 最新記事
      </h1>
      <ArticleList articles={articles} />
    </main>
  );
}
