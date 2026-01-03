
import React, { useState, useEffect } from 'react';
import { Category, Expense } from '../types';
import { PlusIcon } from './icons';

interface AddExpenseFormProps {
    categories: Category[];
    onAddExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ categories, onAddExpense }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [item, setItem] = useState('');
    const [note, setNote] = useState('');
    
    useEffect(() => {
        // When categories load, if no category is selected, select the first one.
        if (categories.length > 0 && !categoryId) {
            setCategoryId(categories[0].id);
        }
    }, [categories, categoryId]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !categoryId || !amount) {
            alert('請填寫日期、類別和金額。');
            return;
        }
        onAddExpense({
            date,
            category_id: categoryId,
            amount: parseFloat(amount),
            merchant,
            item,
            note: note || null,
        });
        // Reset form
        setAmount('');
        setMerchant('');
        setItem('');
        setNote('');
    };
    
    const commonInputClass = "mt-1 block w-full rounded-md bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">新增花費</h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">日期</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={commonInputClass} required />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">類別</label>
                    <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className={commonInputClass} required disabled={categories.length === 0}>
                         {categories.length === 0 ? <option>請先新增一個類別</option> : categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">金額</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" step="0.01" className={commonInputClass} required />
                </div>
                 <div>
                    <label htmlFor="merchant" className="block text-sm font-medium text-slate-700 dark:text-slate-300">商家 (可選)</label>
                    <input type="text" id="merchant" value={merchant} onChange={e => setMerchant(e.target.value)} className={commonInputClass} />
                </div>
                 <div>
                    <label htmlFor="item" className="block text-sm font-medium text-slate-700 dark:text-slate-300">項目 (可選)</label>
                    <input type="text" id="item" value={item} onChange={e => setItem(e.target.value)} className={commonInputClass} />
                </div>
                <div>
                    <label htmlFor="note" className="block text-sm font-medium text-slate-700 dark:text-slate-300">備註 (可選)</label>
                    <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={2} className={commonInputClass}></textarea>
                </div>
                <button type="submit" className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={categories.length === 0}>
                    <PlusIcon /> 新增花費
                </button>
            </form>
        </div>
    );
};

export default AddExpenseForm;
