"use client";

import { useState } from "react";
import type { Article } from "@/app/types/article";
import ArticleCard from "./ArticleCard";
import SearchBar from "./SearchBar";

export default function ArticleList({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");

  const filtered = articles.filter((article) => {
    const q = query.toLowerCase();
    return (
      article.title.toLowerCase().includes(q) ||
      article.author.toLowerCase().includes(q) ||
      article.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex gap-8 items-start">
      <div className="flex-1 space-y-4">
        {filtered.length > 0 ? (
          filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="text-zinc-400 text-sm">該当する記事が見つかりませんでした。</p>
        )}
      </div>

      <div className="w-56 shrink-0">
        <SearchBar query={query} onChange={setQuery} />
      </div>
    </div>
  );
}
