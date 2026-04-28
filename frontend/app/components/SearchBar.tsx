type Props = {
  query: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ query, onChange }: Props) {
  return (
    <div className="sticky top-6">
      <h2 className="text-sm font-semibold text-zinc-700 mb-2">記事を検索</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="タイトル・著者・タグで検索..."
        className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-zinc-400"
      />
      {query && (
        <button
          onClick={() => onChange("")}
          className="mt-2 text-xs text-zinc-400 hover:text-zinc-600"
        >
          クリア
        </button>
      )}
    </div>
  );
}
