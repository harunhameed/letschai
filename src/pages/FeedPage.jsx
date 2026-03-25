import { useState, useEffect } from 'react';
import { getPosts, createPost, getClubs, getClubPosts, getPendingRequests } from '../api';
import PostCard from '../components/PostCard';

const TABS = ['Memories', 'Clubs', 'Opportunities'];

export default function FeedPage({ onPendingCount }) {
  const [activeTab, setActiveTab] = useState('Memories');
  const [posts, setPosts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [clubPosts, setClubPosts] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadFeed();
    loadPendingCount();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const [postsRes, clubsRes] = await Promise.all([getPosts(), getClubs()]);
      setPosts(postsRes.data);
      setClubs(clubsRes.data);
    } catch (err) {
      console.error('Feed load error:', err);
    }
    setLoading(false);
  };

  const loadPendingCount = async () => {
    try {
      const res = await getPendingRequests();
      onPendingCount?.(res.data.length);
    } catch {}
  };

  const loadClubPosts = async (club) => {
    setSelectedClub(club);
    try {
      const res = await getClubPosts(club.id);
      setClubPosts(res.data);
    } catch (err) {
      console.error('Club posts error:', err);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || posting) return;
    setPosting(true);
    try {
      const res = await createPost({ content: newPost });
      setPosts([res.data, ...posts]);
      setNewPost('');
      setShowModal(false);
    } catch (err) {
      console.error('Create post error:', err);
    }
    setPosting(false);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-header mb-1">Your Feed</h1>
          <p className="text-dark-400 text-sm">Stay updated with your campus community</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1.5 rounded-2xl glass-light mb-8 max-w-md">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedClub(null); }}
            className={`flex-1 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab
                ? 'bg-primary-500 text-white shadow-glow'
                : 'text-dark-400 hover:text-dark-200 hover:bg-white/5'
            }`}
            id={`tab-${tab.toLowerCase()}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-36 w-full" />
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'Memories' && (
            <div className="grid gap-5 lg:grid-cols-2">
              {posts.length === 0 ? (
                <div className="lg:col-span-2 text-center py-20">
                  <div className="text-6xl mb-5">📝</div>
                  <p className="text-dark-300 text-xl font-semibold">No posts yet</p>
                  <p className="text-dark-500 mt-2">Be the first to share a memory!</p>
                  <button onClick={() => setShowModal(true)} className="btn-primary mt-6">
                    Create Your First Post
                  </button>
                </div>
              ) : (
                posts.map(post => <PostCard key={post.id} post={post} />)
              )}
            </div>
          )}

          {activeTab === 'Clubs' && (
            <div>
              {selectedClub ? (
                <div>
                  <button
                    onClick={() => setSelectedClub(null)}
                    className="flex items-center gap-2 text-primary-400 mb-6 hover:text-primary-300 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to clubs
                  </button>
                  <h2 className="text-2xl font-bold mb-6">{selectedClub.name}</h2>
                  <div className="grid gap-5 lg:grid-cols-2">
                    {clubPosts.length === 0 ? (
                      <p className="text-dark-400 text-center py-12 lg:col-span-2">No posts in this club yet</p>
                    ) : (
                      clubPosts.map(post => <PostCard key={post.id} post={post} />)
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs.length === 0 ? (
                    <div className="sm:col-span-2 lg:col-span-3 text-center py-20">
                      <div className="text-6xl mb-5">🏛️</div>
                      <p className="text-dark-300 text-xl font-semibold">No clubs yet</p>
                      <p className="text-dark-500 mt-2">Clubs will appear here once created</p>
                    </div>
                  ) : (
                    clubs.map(club => (
                      <button
                        key={club.id}
                        onClick={() => loadClubPosts(club)}
                        className="glass-card text-left hover:border-primary-500/20 group"
                        id={`club-${club.id}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-lg">
                            🏛️
                          </div>
                          <h3 className="font-semibold text-dark-100 group-hover:text-primary-300 transition-colors">{club.name}</h3>
                        </div>
                        {club.description && (
                          <p className="text-dark-400 text-sm line-clamp-2">{club.description}</p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Opportunities' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-5">🚀</div>
              <p className="text-dark-300 text-xl font-semibold">Coming Soon</p>
              <p className="text-dark-500 mt-2">Internships, hackathons & events — stay tuned!</p>
            </div>
          )}
        </>
      )}

      {/* FAB — Create Post */}
      {activeTab === 'Memories' && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-24 md:bottom-8 right-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow flex items-center justify-center text-2xl hover:scale-110 hover:shadow-glass-lg transition-all duration-300 z-40"
          id="create-post-fab"
        >
          +
        </button>
      )}

      {/* Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="glass rounded-3xl p-8 w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Share a Memory</h2>
              <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-dark-200 transition-colors p-1 rounded-lg hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <textarea
              className="input-field min-h-[140px] resize-none"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              autoFocus
              id="new-post-content"
            />
            <button
              onClick={handleCreatePost}
              disabled={!newPost.trim() || posting}
              className="btn-primary w-full mt-5"
              id="submit-post"
            >
              {posting ? 'Posting...' : 'Post Memory'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
