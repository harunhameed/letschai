import { useState, useEffect, useCallback } from 'react';
import { searchUsers, sendConnectionRequest } from '../api';
import UserCard from '../components/UserCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sentIds, setSentIds] = useState(new Set());

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await searchUsers(query);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleConnect = useCallback(async (userId) => {
    await sendConnectionRequest({ receiver: userId });
    setSentIds(prev => new Set(prev).add(userId));
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-header mb-1">
          <span className="gradient-text">Search People</span>
        </h1>
        <p className="text-dark-400 text-sm">Find and connect with students across campus</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8 max-w-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="input-field pl-12 pr-12 py-4 text-base"
          placeholder="Search by name, username, or department..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="search-input"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-200 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton h-24 w-full" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-dark-500 text-sm mb-4">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onConnect={handleConnect}
                pending={sentIds.has(user.id)}
              />
            ))}
          </div>
        </div>
      ) : searched ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-5">🔍</div>
          <p className="text-dark-300 text-xl font-semibold">No users found</p>
          <p className="text-dark-500 mt-2">Try a different search term</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-5">👥</div>
          <p className="text-dark-300 text-xl font-semibold">Find Your Campus Mates</p>
          <p className="text-dark-500 mt-2">Start typing to discover people around you</p>
        </div>
      )}
    </div>
  );
}
