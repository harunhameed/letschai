import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';

const departments = [
  'Computer Science', 'Electronics', 'Mechanical', 'Civil',
  'Electrical', 'Chemical', 'Biotechnology', 'Information Technology',
  'Mathematics', 'Physics', 'Other',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', first_name: '', last_name: '',
    department: '', year: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msg = typeof data === 'string' ? data : Object.values(data).flat().join(', ');
        setError(msg);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg-animated relative overflow-hidden">
      {/* Go Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/70 hover:text-white transition-colors glass px-4 py-2 rounded-xl group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Go Back</span>
      </button>

      <div className="absolute top-10 right-20 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md animate-scale-in relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white mb-1 tracking-tight">
            Join Let's<span className="text-accent-400">Chai</span> ☕
          </h1>
          <p className="text-white/70">Connect with your campus community</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-4" id="register-form">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">First Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="First"
                value={form.first_name}
                onChange={updateField('first_name')}
                required
                id="register-first-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Last Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Last"
                value={form.last_name}
                onChange={updateField('last_name')}
                id="register-last-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="Choose a username"
              value={form.username}
              onChange={updateField('username')}
              required
              id="register-username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Create a password"
              value={form.password}
              onChange={updateField('password')}
              required
              minLength={6}
              id="register-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Department</label>
            <select
              className="input-field appearance-none cursor-pointer"
              value={form.department}
              onChange={updateField('department')}
              required
              id="register-department"
            >
              <option value="" disabled>Select department</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Year</label>
            <select
              className="input-field appearance-none cursor-pointer"
              value={form.year}
              onChange={updateField('year')}
              required
              id="register-year"
            >
              <option value="" disabled>Select year</option>
              {[1, 2, 3, 4, 5].map(y => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg"
            id="register-submit"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-dark-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
