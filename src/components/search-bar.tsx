'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  tumorGroupSlug: string;
  tumorGroupName: string;
  treatmentType: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function select(r: SearchResult) {
    router.push(`/${r.tumorGroupSlug}/${r.slug}`);
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 border-2 border-gray-200 focus-within:border-medical-blue rounded-xl px-4 py-3 bg-white transition-colors">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Søk etter kur, virkestoff eller behandlingstype..."
          className="flex-1 outline-none text-gray-900 placeholder-gray-400 bg-transparent"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }}>
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {open && (query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {loading && <p className="p-4 text-sm text-gray-500">Søker...</p>}
          {!loading && results.length === 0 && (
            <p className="p-4 text-sm text-gray-500">Ingen treff på &quot;{query}&quot;</p>
          )}
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => select(r)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
            >
              <p className="font-medium text-sm text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-500">{r.tumorGroupName} · {r.treatmentType}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
