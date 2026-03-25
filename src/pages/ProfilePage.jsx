import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, getPosts, getMyConnections } from '../api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', department: '', year: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, postsRes] = await Promise.all([
        getProfile(), getPosts(),
      ]);
      setUser(profileRes.data);
      setForm({
        bio: profileRes.data.bio || '',
        department: profileRes.data.department || '',
        year: profileRes.data.year || '',
      });
      const myPosts = postsRes.data.filter(p =>
        p.author === profileRes.data.id || p.author_name === profileRes.data.username
      );
      setPosts(myPosts);

      try {
        const connRes = await getMyConnections();
        setConnectionCount(connRes.data.length);
      } catch {}
    } catch (err) {
      console.error('Profile load error:', err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
    }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="skeleton w-28 h-28 rounded-full" />
              <div className="skeleton w-48 h-8" />
              <div className="skeleton w-32 h-5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username;

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        {/* Profile Hero */}
        <div className="glass rounded-3xl overflow-hidden mb-8">
          {/* Banner */}
          <div className="h-36 lg:h-48 gradient-bg relative">
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Profile info */}
          <div className="px-8 pb-8 -mt-14 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* Avatar */}
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={displayName}
                  className="w-28 h-28 rounded-2xl object-cover ring-4 ring-dark-950 shadow-glass-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-dark-950 shadow-glass-lg">
                  {getInitials(displayName)}
                </div>
              )}

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-dark-100">{displayName}</h1>
                <p className="text-dark-400 text-sm">@{user?.username}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
                  {user?.department && <span className="chip">{user.department}</span>}
                  {user?.year && <span className="chip">Year {user.year}</span>}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn-secondary py-2 px-5 text-sm"
                  id="edit-profile-btn"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-dark-400 hover:text-red-400 transition-colors text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-500/5 md:hidden"
                  id="logout-btn-mobile"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>

            {user?.bio && !editing && (
              <p className="text-dark-300 mt-4 max-w-2xl text-sm leading-relaxed">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card text-center">
            <div className="text-2xl lg:text-3xl font-bold gradient-text">{posts.length}</div>
            <div className="text-dark-400 text-sm mt-1">Posts</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl lg:text-3xl font-bold gradient-text">{connectionCount}</div>
            <div className="text-dark-400 text-sm mt-1">Connections</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl lg:text-3xl font-bold gradient-text">
              {user?.department ? '1' : '0'}
            </div>
            <div className="text-dark-400 text-sm mt-1">Department</div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="glass rounded-3xl p-8 mb-8 animate-slide-up">
            <h3 className="text-lg font-bold text-dark-100 mb-5">Edit Profile</h3>
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm text-dark-400 mb-1.5 font-medium">Bio</label>
                <textarea
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Tell us about yourself..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  id="edit-bio"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5 font-medium">Department</label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    id="edit-department"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5 font-medium">Year</label>
                  <input
                    type="number"
                    className="input-field"
                    min="1" max="5"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    id="edit-year"
                  />
                </div>
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary px-8" id="save-profile">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div>
          <h2 className="text-xl font-bold text-dark-200 mb-5">My Posts</h2>
          {posts.length === 0 ? (
            <div className="glass-card text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-dark-400">No posts yet. Share your first memory!</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {posts.map(post => (
                <div key={post.id} className="glass-card">
                  <p className="text-dark-200 text-sm leading-relaxed">{post.content}</p>
                  <p className="text-dark-500 text-xs mt-3">{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
