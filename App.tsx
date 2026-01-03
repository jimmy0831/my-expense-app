
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Category, Expense, JoinedExpense, PublicUser } from './types';
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
    const [user, setUser] = useState<PublicUser | null>(null);
    const [appName, setAppName] = useState('MyExpenseApp');
    const [categories, setCategories] = useState<Category[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [modalDate, setModalDate] = useState<string | null>(null);
    const [editingExpense, setEditingExpense] = useState<JoinedExpense | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('records');

    const fetchData = useCallback(async (currentUser: PublicUser) => {
        if (!currentUser) return;
        setLoading(true);
        setError(null);
        try {
            // Fetch profile for app name
            const { data: profileData, error: profileError } = await supabase.from('profiles').select('app_name').eq('id', currentUser.id).single();
            if (profileError) console.error("Could not fetch profile", profileError);
            else if (profileData?.app_name) setAppName(profileData.app_name);

            // Fetch categories
            const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*').eq('user_id', currentUser.id).order('created_at');
            if (categoriesError) throw categoriesError;

            // Fetch expenses
            const { data: expensesData, error: expensesError } = await supabase.from('expenses').select('*').eq('user_id', currentUser.id).order('date', { ascending: false });
            if (expensesError) throw expensesError;
            
            setCategories(categoriesData || []);
            setExpenses(expensesData || []);
        } catch (err: any) {
            setError('資料讀取失敗。請檢查您的網路連線。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);
    
    // Fetch data whenever the user changes
    useEffect(() => {
        if (user) {
            fetchData(user);
        } else {
            // Clear data on logout
            setCategories([]);
            setExpenses([]);
            setAppName('MyExpenseApp');
            setError(null);
        }
    }, [user, fetchData]);
    
    const handleSignOut = () => {
        setUser(null);
    }

    const handleAccountDelete = useCallback(async () => {
        if (!user) {
            alert("錯誤：無法識別使用者身份，請重新登入。");
            return;
        }

        if (!window.confirm("您確定要永久刪除您的帳號及所有資料嗎？此操作無法復原。")) {
            return;
        }

        try {
            setLoading(true);
            
            // Explicitly call delete and check the response
            const { data, error: userDeleteError } = await supabase
                .from('custom_users')
                .delete()
                .eq('id', user.id);

            if (userDeleteError) {
                // If there is any error, we throw it to be caught and displayed below.
                console.error('Supabase delete error:', userDeleteError);
                throw userDeleteError;
            }

            console.log('Supabase delete success response:', data);
            alert("帳號已成功刪除。您現在將被登出。");
            setUser(null); // Sign out
        } catch (err: any) {
            // This will now catch the thrown error and provide a detailed message.
            const errorMessage = `刪除帳號失敗，資料庫回傳錯誤：\n\n${err.message}\n\n這通常是資料庫權限問題。請確認您已在 Supabase SQL Editor 中執行了允許刪除的指令。`;
            alert(errorMessage);
            console.error("Full error object:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const handleAppNameUpdate = useCallback(async (newName: string) => {
        if (!user) return;
        setAppName(newName); // Optimistic update
        const { error } = await supabase.from('profiles').update({ app_name: newName }).eq('id', user.id);
        if (error) {
            console.error('Failed to update app name:', error);
            // You could add logic here to revert the name if the update fails
        }
    }, [user]);

    const handleAddCategory = useCallback(async (name: string, color: string) => {
        if (!user) return;
        const { error } = await supabase.from('categories').insert({ name, color, user_id: user.id });
        if (error) alert(`新增類別失敗: ${error.message}`);
        else fetchData(user);
    }, [user, fetchData]);

    const handleUpdateCategory = useCallback(async (id: string, name: string, color: string) => {
        if (!user) return;
        const { error } = await supabase.from('categories').update({ name, color }).eq('id', id);
        if (error) alert(`更新類別失敗: ${error.message}`);
        else fetchData(user);
    }, [user, fetchData]);

    const handleDeleteCategory = useCallback(async (id: string) => {
        if (!user) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) alert(`刪除類別失敗: ${error.message}`);
        else fetchData(user);
    }, [user, fetchData]);

    const handleAddExpense = useCallback(async (expense: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) return;
        const { error } = await supabase.from('expenses').insert({ ...expense, user_id: user.id });
        if (error) alert(`新增花費失敗: ${error.message}`);
        else fetchData(user);
    }, [user, fetchData]);
    
    const handleUpdateExpense = useCallback(async (expenseId: string, updatedData: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) return;
        const { error } = await supabase.from('expenses').update({ ...updatedData, user_id: user.id }).eq('id', expenseId);
        if (error) alert(`更新花費失敗: ${error.message}`);
        else fetchData(user);
    }, [user, fetchData]);

    const handleDeleteExpense = useCallback(async (expenseId: string) => {
        if (!user) return;
        const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
        if (error) alert(`刪除花費失敗: ${error.message}`);
        else fetchData(user);
    }, [user, fetchData]);

    const openModalForDate = useCallback((date: string) => setModalDate(date), []);
    const closeModal = useCallback(() => setModalDate(null), []);

    const joinedExpenses = useMemo<JoinedExpense[]>(() => {
        const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
        return expenses
            .map(exp => {
                if (!exp.category_id) return null;
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

    const handleLoginSuccess = (loggedInUser: PublicUser) => {
        setUser(loggedInUser);
    };

    if (!user) {
        return <Auth onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen">
            <Header appName={appName} onAppNameChange={handleAppNameUpdate} onSignOut={handleSignOut} userEmail={user.email} />
            <main className="p-4 sm:p-6 lg:p-8 pb-24">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">發生錯誤</p>
                        <p>{error}</p>
                    </div>
                )}
                {(loading && expenses.length === 0) ? (
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
                                <CategoryManager categories={categories} onAddCategory={handleAddCategory} onUpdateCategory={handleUpdateCategory} onDeleteCategory={handleDeleteCategory} />
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