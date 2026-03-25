export default function PostCard({ post }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const authorName = post.author_name || post.author?.username || 'Anonymous';

  return (
    <article className="glass-card animate-fade-in" id={`post-${post.id}`}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {post.author_image || post.author?.profile_image ? (
            <img
              src={post.author_image || post.author.profile_image}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-primary-500/30">
              {getInitials(authorName)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-dark-100 text-sm truncate">{authorName}</h3>
            {post.author_department && (
              <span className="chip text-[10px] py-0.5 px-2">{post.author_department}</span>
            )}
            <span className="text-dark-500 text-xs ml-auto flex-shrink-0">
              {timeAgo(post.created_at)}
            </span>
          </div>

          <p className="text-dark-200 text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {post.image && (
            <div className="mt-3 rounded-xl overflow-hidden">
              <img
                src={post.image}
                alt="Post"
                className="w-full max-h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
