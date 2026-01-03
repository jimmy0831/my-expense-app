
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { MailIcon, LockClosedIcon } from './icons';
import { PublicUser } from '../types';

type ViewType = 'signIn' | 'signUp';

interface AuthProps {
  onLoginSuccess: (user: PublicUser) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<ViewType>('signIn');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
        if (view === 'signIn') {
            const { data, error } = await supabase
                .from('custom_users')
                .select('id, email, created_at')
                .eq('email', email)
                .eq('password', password)
                .single();
            
            if (error || !data) {
                throw new Error('帳號或密碼錯誤，請重新輸入。');
            }
            onLoginSuccess(data);

        } else if (view === 'signUp') {
            if (!email || !password) {
              throw new Error('帳號和密碼不能為空。');
            }
            // 1. Check if user already exists (CORRECTED LOGIC)
            const { data: existingUser, error: selectError } = await supabase
                .from('custom_users')
                .select('id')
                .eq('email', email); // REMOVED .single()
            
            if (selectError) {
                throw selectError; // Throw if there's a real database error
            }
            
            if (existingUser && existingUser.length > 0) {
                throw new Error('此帳號已被註冊，請嘗試登入或使用其他帳號。');
            }

            // 2. Insert new user into custom_users
            const { data: newUser, error: insertError } = await supabase
                .from('custom_users')
                .insert({ email, password })
                .select('id')
                .single();
            
            if (insertError) throw insertError;
            if (!newUser) throw new Error('註冊失敗，無法取得新使用者資訊。');

            // 3. Insert new profile for the user
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({ id: newUser.id, user_id: newUser.id, app_name: 'MyExpenseApp' });

            if (profileError) {
                // Attempt to clean up if profile creation fails
                await supabase.from('custom_users').delete().eq('id', newUser.id);
                throw profileError;
            }
            
            // 4. Insert default categories for the new user
            const defaultCategories = [
                { name: '飲食', color: '#f87171' },
                { name: '交通', color: '#60a5fa' },
                { name: '娛樂', color: '#fbbf24' },
                { name: '生活', color: '#34d399' },
                { name: '購物', color: '#818cf8' },
                { name: '收入', color: '#94a3b8' },
            ];
            
            const categoriesToInsert = defaultCategories.map(cat => ({
                ...cat,
                user_id: newUser.id,
            }));

            const { error: categoryError } = await supabase
                .from('categories')
                .insert(categoriesToInsert);
            
            if (categoryError) {
                // This is not a critical error that should stop the user.
                // Log it and let the user proceed.
                console.error("Failed to add default categories:", categoryError.message);
            }

            setView('signIn');
            setPassword(''); // Clear password for security
            setMessage('註冊成功！請使用您剛剛建立的帳號登入。');
        }
    } catch (err: any) {
        setError(err.message || '發生未知錯誤');
    } finally {
        setLoading(false);
    }
  };
  
  const commonInputClass = "peer block w-full rounded-lg border border-slate-300 bg-transparent py-2.5 pl-10 pr-3 text-sm placeholder:text-transparent focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:focus:border-indigo-500";
  const commonLabelClass = "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-5 scale-75 transform px-2 text-sm text-slate-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-indigo-600 dark:text-slate-400 dark:peer-focus:text-indigo-400 bg-white dark:bg-slate-800";
  const commonButtonClass = "w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors";
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">開始記帳嚕 !</h1>
            
            {error && <p className="mt-4 text-center text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg mb-6">{error}</p>}
            {message && <p className="mt-4 text-center text-sm text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mb-6">{message}</p>}

            <div>
                <form onSubmit={handleAuthAction} className="space-y-6">
                  <div>
                    <div className="relative">
                      <input id="email" type="text" placeholder=" " autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={commonInputClass} />
                      <label htmlFor="email" className={commonLabelClass}>帳號</label>
                      <MailIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      {/* FIX: Corrected typo 'targe' to 'target' */}
                      <input id="password" type="password" placeholder=" " autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={commonInputClass} />
                      <label htmlFor="password" className={commonLabelClass}>密碼</label>
                      <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className={`${commonButtonClass} ${view === 'signIn' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'}`}>
                    {loading ? '處理中...' : (view === 'signIn' ? '登入' : '註冊')}
                  </button>
                  <p className="text-center text-sm">
                    {view === 'signIn' ? '還沒有帳號嗎？' : '已經有帳號了嗎？'}
                    <button type="button" onClick={() => { setView(view === 'signIn' ? 'signUp' : 'signIn'); setError(null); setMessage(null); }} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
                      {view === 'signIn' ? '立即註冊' : '立即登入'}
                    </button>
                  </p>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}
