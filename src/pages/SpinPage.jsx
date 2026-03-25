import { useState } from 'react';
import { spinWheel } from '../api';
import UserCard from '../components/UserCard';

export default function SpinPage() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState(0);

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setError('');

    const newRotation = rotation + 1800 + Math.random() * 360;
    setRotation(newRotation);

    try {
      const res = await spinWheel();
      setTimeout(() => {
        setResult(res.data);
        setSpinning(false);
      }, 2500);
    } catch (err) {
      setTimeout(() => {
        setError(err.response?.data?.error || 'No more users to discover!');
        setSpinning(false);
      }, 2500);
    }
  };

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">
            <span className="gradient-text">Discover People</span>
          </h1>
          <p className="text-dark-400 text-lg">Spin the wheel and connect with someone new on campus</p>
        </div>

        {/* Spin Wheel */}
        <div className="relative inline-block mb-12">
          {/* Outer ambient glow */}
          <div className={`absolute rounded-full transition-all duration-700 ${spinning ? 'opacity-80 scale-110' : 'opacity-30 scale-100'}`}
            style={{ inset: '-40px', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, rgba(251,191,36,0.1) 50%, transparent 70%)' }} />
          
          {/* Rotating ring */}
          <div className="absolute inset-[-8px] rounded-full border-2 border-dashed border-primary-500/20"
            style={{ transform: `rotate(${rotation * 0.3}deg)`, transition: spinning ? 'transform 3s ease-out' : 'none' }} />

          {/* Wheel */}
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="relative w-56 h-56 lg:w-72 lg:h-72 rounded-full glass border-2 border-primary-500/20 flex items-center justify-center cursor-pointer hover:border-primary-500/40 transition-all duration-500 group disabled:cursor-wait"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
            id="spin-button"
          >
            {/* Gradient segments */}
            <div className="absolute inset-3 rounded-full overflow-hidden">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="absolute w-full h-full"
                  style={{
                    background: `conic-gradient(from ${i * 45}deg, ${
                      i % 2 === 0 ? 'rgba(124, 58, 237, 0.12)' : 'rgba(251, 191, 36, 0.06)'
                    } 0deg, transparent 45deg)`,
                  }}
                />
              ))}
            </div>

            {/* Center */}
            <div className="relative z-10 w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow group-hover:shadow-glass-lg transition-all duration-500">
              <span className="text-white font-bold text-xl" style={{ transform: `rotate(-${rotation}deg)`, transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }}>
                {spinning ? '🌀' : 'SPIN'}
              </span>
            </div>
          </button>

          {/* Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-accent-400 drop-shadow-lg" />
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="max-w-md mx-auto animate-scale-in">
            <div className="glass rounded-3xl p-8 mb-4">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-accent-400 font-semibold text-lg mb-6">Match Found! Connection Request Sent!</p>
              <UserCard user={result.user || result} showConnect={false} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto animate-scale-in">
            <div className="glass-card text-center p-8">
              <div className="text-4xl mb-3">😔</div>
              <p className="text-dark-200 font-semibold">{error}</p>
              <p className="text-dark-500 text-sm mt-2">Try again later!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
