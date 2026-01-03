
import React, { useState, useEffect } from 'react';
import { Category, JoinedExpense, Expense } from '../types';
import Modal from './Modal';

interface EditExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expenseToEdit: JoinedExpense | null;
    categories: Category[];
    onUpdateExpense: (expenseId: string, updatedData: Omit<Expense, 'id' | 'created_at'>) => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ isOpen, onClose, expenseToEdit, categories, onUpdateExpense }) => {
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
            setMerchant(expenseToEdit.merchant);
            setItem(expenseToEdit.item);
            setNote(expenseToEdit.note || '');
        }
    }, [expenseToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!expenseToEdit) return;

        if (!date || !categoryId || !amount) {
            alert('請填寫日期、類別和金額。');
            return;
        }

        const updatedData = {
            date,
            category_id: categoryId,
            amount: parseFloat(amount),
            merchant,
            item,
            note: note || null,
        };
        onUpdateExpense(expenseToEdit.id, updatedData);
        onClose();
    };
    
    const commonInputClass = "mt-1 block w-full rounded-md bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="編輯花費紀錄">
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="edit-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">日期</label>
                        <input type="date" id="edit-date" value={date} onChange={e => setDate(e.target.value)} className={commonInputClass} required />
                    </div>
                    <div>
                        <label htmlFor="edit-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">類別</label>
                        <select id="edit-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className={commonInputClass} required>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="edit-amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">金額</label>
                        <input type="number" id="edit-amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" step="0.01" className={commonInputClass} required />
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
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                            取消
                        </button>
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            儲存變更
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditExpenseModal;
