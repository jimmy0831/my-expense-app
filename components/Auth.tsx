
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('註冊成功！請檢查您的電子郵件以進行驗證。');
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const commonInputClass = "mt-1 block w-full rounded-lg border-slate-300 bg-white dark:bg-slate-700/80 dark:border-slate-600 px-3 py-2 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";
  const commonButtonClass = "w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-6">開始記帳囉 !</h1>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">登入或註冊以開始追蹤您的花費。</p>
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">電子郵件</label>
              <input
                id="email"
                className={commonInputClass}
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">密碼</label>
              <input
                id="password"
                className={commonInputClass}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button type="button" onClick={handleLogin} className={`${commonButtonClass} bg-indigo-600 hover:bg-indigo-700`} disabled={loading}>
                {loading ? '登入中...' : '登入'}
              </button>
              <button type="button" onClick={handleSignup} className={`${commonButtonClass} bg-slate-600 hover:bg-slate-700`} disabled={loading}>
                {loading ? '...' : '註冊'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}