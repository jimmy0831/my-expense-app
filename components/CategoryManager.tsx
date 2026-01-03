
import React, { useState } from 'react';
import { Category } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface CategoryManagerProps {
    categories: Category[];
    onAddCategory: (name: string, color: string) => void;
    onDeleteCategory: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#f87171');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAddCategory(name.trim(), color);
            setName('');
        }
    };
    
    const commonInputClass = "mt-1 block w-full rounded-md bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 h-full flex flex-col">
            <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">類別管理</h3>
            <form onSubmit={handleAdd} className="mt-4 flex items-end gap-2">
                <div className="flex-grow">
                     <label htmlFor="category-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">名稱</label>
                    <input type="text" id="category-name" value={name} onChange={e => setName(e.target.value)} placeholder="新類別" className={commonInputClass} />
                </div>
                <div>
                     <label htmlFor="category-color" className="block text-sm font-medium text-slate-700 dark:text-slate-300">顏色</label>
                    <input type="color" id="category-color" value={color} onChange={e => setColor(e.target.value)} className="mt-1 h-10 w-12 rounded-md p-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 shadow-sm" />
                </div>
                <button type="submit" className="p-2 h-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    <PlusIcon />
                </button>
            </form>
            <div className="mt-6 flex-grow space-y-2 overflow-y-auto">
                {categories.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-2 rounded-md">
                        <span className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></span>
                            {cat.name}
                        </span>
                        <button onClick={() => onDeleteCategory(cat.id)} className="text-slate-400 hover:text-red-500">
                            <TrashIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryManager;
