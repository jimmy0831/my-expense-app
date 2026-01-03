
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Category, Expense, JoinedExpense } from './types';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import AddExpenseForm from './components/AddExpenseForm';
import Charts from './components/Charts';
import CategoryManager from './components/CategoryManager';
import ExpenseList from './components/ExpenseList';
import { supabase } from './supabaseClient';
import Tabs from './components/Tabs';
import Modal from './components/Modal';
import EditExpenseModal from './components/EditExpenseModal';
import Auth from './components/Auth';
import AccountManager from './components/AccountManager';

export default function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [appName, setAppName] = useState('MyExpenseApp');
    const [categories, setCategories] = useState<Category[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [modalDate, setModalDate] = useState<string | null>(null);
    const [editingExpense, setEditingExpense] = useState<JoinedExpense | null>(null);
    const [loading, setLoading] = useState(false); // Only for data fetching, not auth
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('records');

    const fetchData = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        setError(null);
        try {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('app_name')
                .single();
            if (profileError) throw profileError;
            if (profileData) {
                setAppName(profileData.app_name);
            }

            const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*').order('created_at');
            if (categoriesError) throw categoriesError;

            const { data: expensesData, error: expensesError } = await supabase.from('expenses').select('*').order('date', { ascending: false });
            if (expensesError) throw expensesError;

            setCategories(categoriesData || []);
            setExpenses(expensesData || []);
        } catch (err: any) {
            setError(err.message || '無法讀取資料');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        setAuthLoading(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setAuthLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                setCategories([]);
                setExpenses([]);
                setAppName('MyExpenseApp');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session, fetchData]);

    const handleAppNameChange = async (newName: string) => {
        if (!session) return;
        setAppName(newName);
        const { error } = await supabase
            .from('profiles')
            .update({ app_name: newName })
            .eq('id', session.user.id);
        
        if (error) {
            setError(error.message);
        }
    };
    
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            setError(error.message);
        }
    }

    const handleAccountDelete = useCallback(async () => {
        const confirmation = window.confirm(
          '您確定要刪除您的帳號嗎？所有相關資料，包含花費和類別，都將被永久刪除，且此操作無法復原。'
        );
        if (!confirmation) return;
    
        const finalConfirmation = window.prompt(
          '此為最後確認。請輸入「DELETE」以永久刪除您的帳號。'
        );
        if (finalConfirmation !== 'DELETE') {
          alert('輸入錯誤，操作已取消。');
          return;
        }
    
        const { error } = await supabase.rpc('delete_user_account');
    
        if (error) {
          setError(`刪除帳號失敗: ${error.message}`);
          alert(`刪除帳號失敗: ${error.message}\n\n請確認您已在 Supabase 後台設定 'delete_user_account' 函式。`);
        } else {
          // The onAuthStateChange listener will handle session state update automatically.
          alert('您的帳號已成功刪除。');
        }
    }, []);

    const handleAddCategory = useCallback(async (name: string, color: string) => {
        const { data, error } = await supabase.from('categories').insert([{ name, color }]).select();
        if (error) {
            setError(error.message);
        } else if (data) {
           setCategories(prev => [...prev, data[0]]);
        }
    }, []);

    const handleDeleteCategory = useCallback(async (id: string) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);

        if (error) {
             setError(error.message);
        } else {
            setExpenses(prev => prev.map(exp => exp.category_id === id ? { ...exp, category_id: null } : exp));
            setCategories(prev => prev.filter(cat => cat.id !== id));
        }
    }, []);

    const handleAddExpense = useCallback(async (expense: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => {
        const { data, error } = await supabase.from('expenses').insert([expense]).select();
        if (error) {
             setError(error.message);
        } else if (data) {
            setExpenses(prev => [data[0], ...prev]);
        }
    }, []);
    
    const handleUpdateExpense = useCallback(async (expenseId: string, updatedData: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => {
        const { data, error } = await supabase
            .from('expenses')
            .update(updatedData)
            .eq('id', expenseId)
            .select()
            .single();

        if (error) {
            setError(error.message);
        } else if (data) {
            setExpenses(prevExpenses =>
                prevExpenses.map(exp => (exp.id === expenseId ? data : exp))
            );
        }
    }, []);

    const handleDeleteExpense = useCallback(async (expenseId: string) => {
        if (!window.confirm('確定要刪除這筆紀錄嗎？此操作無法復原。')) {
            return;
        }
        
        const { error } = await supabase.from('expenses').delete().eq('id', expenseId);

        if (error) {
            setError(error.message);
        } else {
            setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
        }
    }, []);

    const openModalForDate = useCallback((date: string) => {
        setModalDate(date);
    }, []);

    const closeModal = useCallback(() => {
        setModalDate(null);
    }, []);

    const joinedExpenses = useMemo<JoinedExpense[]>(() => {
        const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
        return expenses
            .map(exp => {
                if (!exp.category_id) return null; // Handle expenses with no category
                const category = categoryMap.get(exp.category_id);
                return category ? { ...exp, category } : null;
            })
            .filter((exp): exp is JoinedExpense => exp !== null)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [expenses, categories]);

    const modalExpenses = useMemo(() => {
        if (!modalDate) return [];
        return joinedExpenses.filter(exp => exp.date === modalDate);
    }, [joinedExpenses, modalDate]);

    const AuthSpinner = () => (
        <div className="min-h-screen flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (authLoading) {
        return <AuthSpinner />;
    }

    if (!session) {
        return <Auth />;
    }

    return (
        <div className="min-h-screen">
            <Header appName={appName} onAppNameChange={handleAppNameChange} onSignOut={handleSignOut} userEmail={session.user.email} />
            <main className="p-4 sm:p-6 lg:p-8 pb-24">
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">發生錯誤: {error}</div>}
                {loading ? (
                     <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                     </div>
                ) : (
                    <>
                        <div className={activeTab === 'records' ? 'block' : 'hidden'}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                <div className="lg:col-span-1 xl:col-span-1 space-y-8">
                                    <AddExpenseForm categories={categories} onAddExpense={handleAddExpense} />
                                    <CalendarView expenses={joinedExpenses} onDateSelect={openModalForDate} selectedDate={modalDate}/>
                                </div>
                                <div className="lg:col-span-2 xl:col-span-3">
                                    <ExpenseList expenses={joinedExpenses} onEdit={setEditingExpense} onDelete={handleDeleteExpense} />
                                </div>
                            </div>
                        </div>
                         <div className={activeTab === 'charts' ? 'block' : 'hidden'}>
                            <Charts expenses={joinedExpenses} />
                        </div>
                         <div className={activeTab === 'settings' ? 'block' : 'hidden'}>
                            <div className="max-w-md mx-auto space-y-8">
                                <CategoryManager categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />
                                <AccountManager onAccountDelete={handleAccountDelete} />
                            </div>
                         </div>
                    </>
                )}
            </main>
            <Tabs activeTab={activeTab} onTabClick={setActiveTab} />
            <Modal isOpen={!!modalDate} onClose={closeModal} title={`${modalDate} 花費明細`}>
                <ExpenseList expenses={modalExpenses} isModal={true} onEdit={setEditingExpense} onDelete={handleDeleteExpense} />
            </Modal>
            <EditExpenseModal 
                isOpen={!!editingExpense}
                onClose={() => setEditingExpense(null)}
                expenseToEdit={editingExpense}
                categories={categories}
                onUpdateExpense={handleUpdateExpense}
                onDeleteExpense={handleDeleteExpense}
            />
        </div>
    );
}
