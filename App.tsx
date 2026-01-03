
import React, { useState, useMemo, useCallback, useEffect } from 'react';
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

export default function App() {
    const [appName, setAppName] = useState('MyExpenseApp');
    const [categories, setCategories] = useState<Category[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [modalDate, setModalDate] = useState<string | null>(null);
    const [editingExpense, setEditingExpense] = useState<JoinedExpense | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('records');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
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
    }, []);

    useEffect(() => {
        fetchData();
        const storedAppName = localStorage.getItem('appName');
        if (storedAppName) {
            setAppName(storedAppName);
        }
    }, [fetchData]);

    const handleAppNameChange = (newName: string) => {
        setAppName(newName);
        localStorage.setItem('appName', newName);
    };

    const handleAddCategory = useCallback(async (name: string, color: string) => {
        const { data, error } = await supabase.from('categories').insert([{ name, color }]).select();
        if (error) {
            setError(error.message);
        } else if (data) {
           setCategories(prev => [...prev, data[0]]);
        }
    }, []);

    const handleDeleteCategory = useCallback(async (id: string) => {
         const { error: expensesError } = await supabase.from('expenses').delete().eq('category_id', id);
        if (expensesError) {
            setError(expensesError.message);
            return;
        }

        const { error: categoryError } = await supabase.from('categories').delete().eq('id', id);

        if (categoryError) {
             setError(categoryError.message);
        } else {
            setExpenses(prev => prev.filter(exp => exp.category_id !== id));
            setCategories(prev => prev.filter(cat => cat.id !== id));
        }
    }, []);

    const handleAddExpense = useCallback(async (expense: Omit<Expense, 'id' | 'created_at'>) => {
        const { data, error } = await supabase.from('expenses').insert([expense]).select();
        if (error) {
             setError(error.message);
        } else if (data) {
            setExpenses(prev => [data[0], ...prev]);
        }
    }, []);
    
    const handleUpdateExpense = useCallback(async (expenseId: string, updatedData: Omit<Expense, 'id' | 'created_at'>) => {
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

    return (
        <div className="min-h-screen">
            <Header appName={appName} onAppNameChange={handleAppNameChange} />
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
                            <div className="max-w-md mx-auto">
                                <CategoryManager categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />
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
