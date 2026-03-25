import { useState } from 'react';

export default function UserCard({ user, onConnect, showConnect = true, connected = false, pending = false }) {
  const [loading, setLoading] = useState(false);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleConnect = async () => {
    if (loading || connected || pending) return;
    setLoading(true);
    try {
      await onConnect(user.id);
    } catch (e) {
      // handled by parent
    }
    setLoading(false);
  };

  const displayName = user.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user.username;

  return (
    <div className="glass-card flex items-center gap-3 animate-slide-up" id={`user-${user.id}`}>
      {/* Avatar */}
      {user.profile_image ? (
        <img
          src={user.profile_image}
          alt={displayName}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/30 flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold ring-2 ring-primary-500/30 flex-shrink-0">
          {getInitials(displayName)}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-dark-100 truncate">{displayName}</h3>
        <div className="flex items-center gap-2 mt-0.5">
          {user.department && (
            <span className="text-dark-400 text-xs">{user.department}</span>
          )}
          {user.year && (
            <span className="text-dark-500 text-xs">• Year {user.year}</span>
          )}
        </div>
        {user.bio && (
          <p className="text-dark-400 text-xs mt-1 line-clamp-1">{user.bio}</p>
        )}
      </div>

      {/* Action */}
      {showConnect && (
        <button
          onClick={handleConnect}
          disabled={loading || connected || pending}
          className={`flex-shrink-0 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95 ${
            connected
              ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default'
              : pending
              ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20 cursor-default'
              : 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-glow'
          }`}
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : connected ? (
            'Connected'
          ) : pending ? (
            'Pending'
          ) : (
            'Connect'
          )}
        </button>
      )}
    </div>
  );
}
