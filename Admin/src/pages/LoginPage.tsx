import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      success('Logged in successfully!');
      navigate('/');
    } catch (err: any) {
      error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] light:bg-[#EAE0D0] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-[#121212] light:bg-[#DFD4C2] border border-[#262626] light:border-[#C6B7A0] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#e91010]" />

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#e91010]/10 border border-[#e91010]/30 flex items-center justify-center text-[#e91010] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white light:text-black">Portfolio Administration</h1>
          <p className="text-xs text-neutral-400 light:text-neutral-600 mt-1">Sign in with your administrator credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ayushwork@gmail.com"
              required
              className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] focus:border-[#e91010] rounded-lg px-3.5 py-2.5 text-sm text-white light:text-black placeholder-neutral-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 light:text-neutral-700 uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#181818] light:bg-[#D5C8B4] border border-[#262626] light:border-[#C6B7A0] focus:border-[#e91010] rounded-lg px-3.5 py-2.5 text-sm text-white light:text-black placeholder-neutral-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#e91010] hover:bg-[#c80c0c] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-[#e91010]/20 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[#262626] light:border-[#C6B7A0] text-center">
          <p className="text-[11px] text-neutral-500 light:text-neutral-600">
            Protected by bcrypt hash, rate-limiting, and hardened HTTP-only cookies.
          </p>
        </div>
      </div>
    </div>
  );
};
