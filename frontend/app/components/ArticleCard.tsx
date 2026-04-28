import type { Article } from "@/app/types/article";

export default function ArticleCard({ article }: { article: Article }) {
  const publishedDate = new Date(article.published_at).toLocaleDateString(
    "ja-JP",
    { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tokyo" }
  );

  return (
    <article className="p-5 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors leading-snug">
          {article.title}
        </h2>
      </a>

      <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
        <span>{article.author}</span>
        <span>·</span>
        <time dateTime={article.published_at}>{publishedDate}</time>
      </div>

      {article.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-zinc-100 text-zinc-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
        {article.summary}
      </p>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-blue-500 hover:underline"
      >
        元記事を読む →
      </a>
    </article>
  );
}
