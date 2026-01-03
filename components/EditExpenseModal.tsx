
import React, { useState, useEffect } from 'react';
import { Category, JoinedExpense, Expense } from '../types';
import Modal from './Modal';

interface EditExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expenseToEdit: JoinedExpense | null;
    categories: Category[];
    onUpdateExpense: (expenseId: string, updatedData: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => void;
    onDeleteExpense: (expenseId: string) => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ isOpen, onClose, expenseToEdit, categories, onUpdateExpense, onDeleteExpense }) => {
    const [date, setDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [item, setItem] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (expenseToEdit) {
            setDate(expenseToEdit.date);
            setCategoryId(expenseToEdit.category_id);
            setAmount(String(expenseToEdit.amount));
            setMerchant(expenseToEdit.merchant || '');
            setItem(expenseToEdit.item || '');
            setNote(expenseToEdit.note || '');
        }
    }, [expenseToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!expenseToEdit) return;

        const updatedData = {
            date,
            category_id: categoryId || null,
            amount: parseFloat(amount) || 0,
            merchant,
            item,
            note: note || null,
        };
        onUpdateExpense(expenseToEdit.id, updatedData);
        onClose();
    };

    const handleDelete = () => {
        if (expenseToEdit) {
            onDeleteExpense(expenseToEdit.id);
            onClose();
        }
    };
    
    const commonInputClass = "mt-1 block w-full rounded-lg border-slate-300 bg-white dark:bg-slate-700/80 dark:border-slate-600 px-3 py-2 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="編輯花費紀錄">
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                     <div>
                        <label htmlFor="edit-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">日期</label>
                        <input type="date" id="edit-date" value={date} onChange={e => setDate(e.target.value)} className={commonInputClass} />
                    </div>
                    <div>
                        <label htmlFor="edit-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">類別</label>
                        <select id="edit-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className={commonInputClass}>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="edit-amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">金額</label>
                        <input type="number" id="edit-amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" step="0.01" className={commonInputClass} />
                    </div>
                    <div>
                        <label htmlFor="edit-merchant" className="block text-sm font-medium text-slate-700 dark:text-slate-300">商家 (可選)</label>
                        <input type="text" id="edit-merchant" value={merchant} onChange={e => setMerchant(e.target.value)} className={commonInputClass} />
                    </div>
                    <div>
                        <label htmlFor="edit-item" className="block text-sm font-medium text-slate-700 dark:text-slate-300">項目 (可選)</label>
                        <input type="text" id="edit-item" value={item} onChange={e => setItem(e.target.value)} className={commonInputClass} />
                    </div>
                    <div>
                        <label htmlFor="edit-note" className="block text-sm font-medium text-slate-700 dark:text-slate-300">備註 (可選)</label>
                        <textarea id="edit-note" value={note} onChange={e => setNote(e.target.value)} rows={2} className={commonInputClass}></textarea>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <button type="button" onClick={handleDelete} className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/75 transition-colors">
                            刪除紀錄
                        </button>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={onClose} className="py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                                取消
                            </button>
                            <button type="submit" className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                                儲存變更
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditExpenseModal;