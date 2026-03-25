import { useState, useEffect } from 'react';
import { getPendingRequests, acceptConnection } from '../api';

export default function RequestsPage({ onPendingCount }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingIds, setAcceptingIds] = useState(new Set());

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await getPendingRequests();
      setRequests(res.data);
      onPendingCount?.(res.data.length);
    } catch (err) {
      console.error('Load requests error:', err);
    }
    setLoading(false);
  };

  const handleAccept = async (requestId) => {
    setAcceptingIds(prev => new Set(prev).add(requestId));
    try {
      await acceptConnection(requestId);
      setRequests(prev => prev.filter(r => r.id !== requestId));
      onPendingCount?.(requests.length - 1);
    } catch (err) {
      console.error('Accept error:', err);
    }
    setAcceptingIds(prev => {
      const next = new Set(prev);
      next.delete(requestId);
      return next;
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="section-header mb-1">
            <span className="gradient-text">Connection Requests</span>
          </h1>
          <p className="text-dark-400 text-sm">People who want to connect with you</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-24 w-full" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-5">📬</div>
            <p className="text-dark-300 text-xl font-semibold">No Pending Requests</p>
            <p className="text-dark-500 mt-2">When someone sends you a connection request, it&apos;ll appear here</p>
          </div>
        ) : (
          <div>
            <p className="text-dark-500 text-sm mb-4">
              {requests.length} pending request{requests.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-4">
              {requests.map((req) => {
                const sender = req.sender_info || req.sender_detail || req;
                const senderName = sender.first_name
                  ? `${sender.first_name} ${sender.last_name || ''}`.trim()
                  : sender.username || sender.sender_name || 'Unknown';

                return (
                  <div
                    key={req.id}
                    className="glass-card flex items-center gap-4 animate-slide-up"
                    id={`request-${req.id}`}
                  >
                    {sender.profile_image ? (
                      <img
                        src={sender.profile_image}
                        alt={senderName}
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-primary-500/20 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-lg font-bold ring-2 ring-primary-500/20 flex-shrink-0">
                        {getInitials(senderName)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-dark-100 truncate text-base">{senderName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {sender.department && (
                          <span className="text-dark-400 text-sm">{sender.department}</span>
                        )}
                        {sender.year && (
                          <span className="text-dark-500 text-sm">• Year {sender.year}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAccept(req.id)}
                      disabled={acceptingIds.has(req.id)}
                      className="flex-shrink-0 btn-accent py-2.5 px-6 text-sm"
                      id={`accept-${req.id}`}
                    >
                      {acceptingIds.has(req.id) ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        'Accept'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
