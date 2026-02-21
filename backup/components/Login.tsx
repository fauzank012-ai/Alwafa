
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password123') {
      onLogin(true);
    } else {
      setError('Username atau password salah.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-500 relative my-auto">
        
        {/* Decorative Arabesque Background in Login */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-20 p-2 hover:bg-white/10 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-emerald-900 p-10 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-10">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-arabic mb-2 text-amber-400">الوفاء</h1>
          <h2 className="text-xl font-bold tracking-tight">Otoritas Al Wafa</h2>
          <p className="text-emerald-300/80 text-xs mt-1 font-medium">Sistem Monitoring Tahfidz Terpadu</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6 relative z-10">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-semibold border border-red-100 flex items-center gap-3 animate-bounce">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Username Pengurus</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <input
                autoFocus
                type="text"
                required
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-emerald-700 text-white rounded-2xl font-bold shadow-xl shadow-emerald-900/10 hover:bg-emerald-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Masuk Ke Sistem
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
