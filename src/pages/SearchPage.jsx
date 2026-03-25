import { useState, useEffect, useCallback } from 'react';
import { searchUsers, sendConnectionRequest } from '../api';
import UserCard from '../components/UserCard';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    q: '',
    branch_name: '',
    batch_year: '',
    is_authorized: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sentIds, setSentIds] = useState(new Set());

  useEffect(() => {
    const hasFilter = Object.values(filters).some(val => val !== '');
    
    if (!hasFilter) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await searchUsers(filters);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [filters]);

  const handleConnect = useCallback(async (userId) => {
    await sendConnectionRequest({ receiver: userId });
    setSentIds(prev => new Set(prev).add(userId));
  }, []);

  const updateFilter = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-header mb-1">
          <span className="gradient-text">Search People</span>
        </h1>
        <p className="text-dark-400 text-sm">Find and connect with students across campus seamlessly.</p>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="input-field pl-12"
            placeholder="Name or username..."
            value={filters.q}
            onChange={(e) => updateFilter('q', e.target.value)}
          />
        </div>
        
        <select
          className="input-field appearance-none cursor-pointer"
          value={filters.branch_name}
          onChange={(e) => updateFilter('branch_name', e.target.value)}
        >
          <option value="">All Branches</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Electronics">Electronics</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Business">Business</option>
          <option value="Arts">Arts</option>
        </select>

        <select
          className="input-field appearance-none cursor-pointer"
          value={filters.batch_year}
          onChange={(e) => updateFilter('batch_year', e.target.value)}
        >
          <option value="">All Batches</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>

        <select
          className="input-field appearance-none cursor-pointer"
          value={filters.is_authorized}
          onChange={(e) => updateFilter('is_authorized', e.target.value)}
        >
          <option value="">Authorization Status</option>
          <option value="true">Authorized Only</option>
          <option value="false">Unauthorized</option>
        </select>
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
          <p className="text-dark-500 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-5">👥</div>
          <p className="text-dark-300 text-xl font-semibold">Find Your Campus Mates</p>
          <p className="text-dark-500 mt-2">Use the filters above to discover people</p>
        </div>
      )}
    </div>
  );
}
