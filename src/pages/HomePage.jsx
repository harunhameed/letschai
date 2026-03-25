import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../api';

const features = [
  {
    icon: '🎯',
    title: 'Spin & Discover',
    desc: 'Randomly match with campus peers. Break the ice effortlessly with our unique spin wheel.',
  },
  {
    icon: '💬',
    title: 'Campus Feed',
    desc: 'Share memories, discover clubs, and stay updated on what\'s happening around you.',
  },
  {
    icon: '🔍',
    title: 'Find Anyone',
    desc: 'Search by name, department, or interests. Connect with people who matter.',
  },
  {
    icon: '🏛️',
    title: 'Clubs & Communities',
    desc: 'Join vibrant campus clubs and be part of conversations that excite you.',
  },
];

export default function HomePage() {
  const isLoggedIn = !!localStorage.getItem('token');
  const [dynamicStats, setDynamicStats] = useState({
    students: '500+',
    clubs: '50+',
    connections: '1K+',
    active: '24/7'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setDynamicStats({
          students: `${res.data.students}+`,
          clubs: `${res.data.clubs}+`,
          connections: `${res.data.connections}+`,
          active: '24/7'
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { value: dynamicStats.students, label: 'Students' },
    { value: dynamicStats.clubs, label: 'Clubs' },
    { value: dynamicStats.connections, label: 'Connections' },
    { value: dynamicStats.active, label: 'Active' },
  ];

  return (
    <div className="min-h-screen">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            Let's <span className="text-accent-400">Chai</span>
            <span className="ml-1 text-lg">☕</span>
          </Link>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link to="/feed" className="btn-primary py-2 px-5 text-sm">
                Go to Feed →
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-dark-300 hover:text-white font-medium text-sm transition-colors px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 gradient-bg-animated opacity-40" />
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-accent-500/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-dark-300 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Your campus networking platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 animate-slide-up">
            Meet Your Campus.<br />
            <span className="gradient-text">One Spin at a Time.</span>
          </h1>

          <p className="text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Let's Chai helps you discover peers, break conversation barriers, and stay connected with everything happening on campus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to={isLoggedIn ? '/feed' : '/register'} className="btn-primary text-lg px-10 py-4 shadow-glow hover:shadow-glass-lg">
              {isLoggedIn ? 'Open Feed' : 'Join Now — It\'s Free'}
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-10 py-4">
              Learn More ↓
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-500 animate-pulse">
          <span className="text-xs">Scroll</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ───── Stats Bar ───── */}
      <section className="relative z-10 -mt-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-dark-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section className="py-24 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              From random discoveries to meaningful connections — Let's Chai has it all.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card p-6 text-center group hover:-translate-y-2 transition-all duration-500"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-lg font-bold text-dark-100 mb-2">{f.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Meet Your Campus?
              </h2>
              <p className="text-dark-300 mb-8 max-w-lg mx-auto">
                Join hundreds of students already connecting, sharing, and discovering on Let's Chai.
              </p>
              <Link to={isLoggedIn ? '/feed' : '/register'} className="btn-accent text-lg px-10 py-4 inline-block">
                {isLoggedIn ? 'Open Feed ☕' : 'Get Started for Free ☕'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-dark-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-dark-500 text-sm">
            © 2026 Let's Chai. Built for campus communities.
          </div>
          <div className="text-2xl font-bold">
            Let's <span className="text-accent-400">Chai</span> ☕
          </div>
        </div>
      </footer>
    </div>
  );
}
