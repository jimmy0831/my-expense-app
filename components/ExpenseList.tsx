
import React from 'react';
import { JoinedExpense } from '../types';
import { PencilIcon, TrashIcon } from './icons';

interface ExpenseListProps {
    expenses: JoinedExpense[];
    isModal?: boolean;
    onEdit?: (expense: JoinedExpense) => void;
    onDelete?: (expenseId: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, isModal = false, onEdit, onDelete }) => {
    
    const emptyState = isModal ? (
        <div className="text-center text-slate-500 dark:text-slate-400 py-10">
            <p>本日沒有花費紀錄。</p>
        </div>
    ) : (
        <div className="text-center text-slate-500 dark:text-slate-400 py-10">
            <p>沒有花費紀錄可顯示。</p>
            <p className="text-sm">請點擊左側日曆下方的表單來新增一筆花費。</p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 h-full flex flex-col">
            {!isModal && <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">花費紀錄</h3>}
            <div className={`flex-grow overflow-y-auto ${!isModal ? 'mt-4' : ''}`}>
                {expenses.length === 0 ? (
                   emptyState
                ) : (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {expenses.map(exp => (
                            <li key={exp.id} className="py-3 flex justify-between items-center space-x-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{exp.merchant || 'N/A'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{exp.date}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{exp.item || 'N/A'}</p>
                                        <span className="text-xs px-2 py-0.5 rounded-full text-white whitespace-nowrap" style={{ backgroundColor: exp.category.color }}>
                                            {exp.category.name}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-base font-bold text-slate-900 dark:text-white text-right w-20">
                                        ${exp.amount.toFixed(2)}
                                    </div>
                                    <div className="flex items-center">
                                        {onEdit && (
                                            <button onClick={() => onEdit(exp)} className="text-slate-400 hover:text-indigo-500 p-1 rounded-full" aria-label="編輯">
                                                <PencilIcon />
                                            </button>
                                        )}
                                        {onDelete && (
                                             <button onClick={() => onDelete(exp.id)} className="text-slate-400 hover:text-red-500 p-1 rounded-full" aria-label="刪除">
                                                <TrashIcon />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ExpenseList;
