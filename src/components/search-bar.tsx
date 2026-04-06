'use client';

import { useState, useEffect, useRef, useId, useCallback } from 'react';
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
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const ref       = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const router    = useRouter();
  const listboxId = useId();
  const inputId   = useId();

  useEffect(() => {
    if (query.length < 2) { setResults([]); setActiveIdx(-1); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res  = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = useCallback((r: SearchResult) => {
    router.push(`/${r.tumorGroupSlug}/${r.slug}`);
    setQuery('');
    setOpen(false);
    setActiveIdx(-1);
  }, [router]);

  // Keyboard navigation (WCAG 2.1 — combobox pattern)
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      select(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
  }

  const isDropdownOpen = open && query.length >= 2;
  const statusText = loading
    ? 'Søker…'
    : isDropdownOpen && results.length === 0
    ? `Ingen treff på «${query}»`
    : isDropdownOpen
    ? `${results.length} resultat${results.length !== 1 ? 'er' : ''}`
    : '';

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      {/* Screen-reader live region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {statusText}
      </div>

      <div className="flex items-center gap-2 border-2 border-gray-200 focus-within:border-medical-blue rounded-xl px-4 py-3 bg-white transition-colors">
        <Search size={18} className="text-gray-400 shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-label="Søk etter kur, virkestoff eller behandlingstype"
          aria-expanded={isDropdownOpen}
          aria-controls={isDropdownOpen ? listboxId : undefined}
          aria-activedescendant={activeIdx >= 0 ? `search-item-${activeIdx}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Søk etter kur, virkestoff eller behandlingstype…"
          className="flex-1 outline-none text-gray-900 placeholder-gray-400 bg-transparent"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
            aria-label="Tøm søkefelt"
            className="text-gray-400 hover:text-gray-600 focus:ring-1 focus:ring-medical-blue rounded"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {isDropdownOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Søkeresultater"
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          {loading && (
            <li role="option" aria-selected="false" className="p-4 text-sm text-gray-500">
              Søker…
            </li>
          )}
          {!loading && results.length === 0 && (
            <li role="option" aria-selected="false" className="p-4 text-sm text-gray-500">
              Ingen treff på &quot;{query}&quot;
            </li>
          )}
          {results.map((r, i) => (
            <li
              key={r.id}
              id={`search-item-${i}`}
              role="option"
              aria-selected={i === activeIdx}
              className={`cursor-pointer px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${
                i === activeIdx ? 'bg-blue-50' : 'hover:bg-blue-50'
              }`}
              onClick={() => select(r)}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <p className="font-medium text-sm text-gray-900">{r.name}</p>
              <p className="text-xs text-gray-500">{r.tumorGroupName} · {r.treatmentType}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
