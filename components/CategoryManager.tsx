
import React, { useState } from 'react';
import { Category } from '../types';
import { PlusIcon, TrashIcon, CheckIcon, XIcon } from './icons';

interface CategoryManagerProps {
    categories: Category[];
    onAddCategory: (name: string, color: string) => void;
    onUpdateCategory: (id: string, name: string, color: string) => void;
    onDeleteCategory: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#f87171');

    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCategory(name, color);
        setName('');
    };
    
    const handleEditClick = (category: Category) => {
        setEditingCategoryId(category.id);
        setEditName(category.name);
        setEditColor(category.color);
    };

    const handleCancelEdit = () => {
        setEditingCategoryId(null);
    };

    const handleUpdate = () => {
        if (editingCategoryId) {
            onUpdateCategory(editingCategoryId, editName, editColor);
            setEditingCategoryId(null);
        }
    };

    const commonInputClass = "mt-1 block w-full rounded-lg border-slate-300 bg-white dark:bg-slate-700/80 dark:border-slate-600 px-3 py-2 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 h-full flex flex-col">
            <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">類別管理</h3>
            <form onSubmit={handleAdd} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="category-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">類別名稱</label>
                    <input type="text" id="category-name" value={name} onChange={e => setName(e.target.value)} placeholder="例如：飲食、交通..." className={commonInputClass} />
                </div>
                <div className="flex items-end gap-3">
                    <div className="flex-shrink-0">
                        <label htmlFor="category-color" className="block text-sm font-medium text-slate-700 dark:text-slate-300">選擇顏色</label>
                         <input 
                          type="color" 
                          id="category-color" 
                          value={color} 
                          onChange={e => setColor(e.target.value)} 
                          className="mt-1 p-0 w-16 h-10 block bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                        />
                    </div>
                    <button type="submit" className="flex-grow h-10 flex justify-center items-center gap-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors">
                        <PlusIcon /> 新增類別
                    </button>
                </div>
            </form>

            <div className="mt-8 flex-grow space-y-3 overflow-y-auto pr-2">
                {categories.map(cat => (
                    <div key={cat.id}>
                        {editingCategoryId === cat.id ? (
                            // Edit Mode
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                <input 
                                    type="color" 
                                    value={editColor} 
                                    onChange={e => setEditColor(e.target.value)}
                                    className="p-0 w-10 h-10 block bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer flex-shrink-0"
                                />
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="block w-full rounded-lg border-slate-300 bg-white dark:bg-slate-600 dark:border-slate-500 px-3 py-2 shadow-sm sm:text-sm"
                                />
                                <button onClick={handleUpdate} className="p-2 text-slate-400 hover:text-green-500 transition-colors"><CheckIcon /></button>
                                <button onClick={handleCancelEdit} className="p-2 text-slate-400 hover:text-slate-100 transition-colors"><XIcon /></button>
                            </div>
                        ) : (
                            // Display Mode
                            <div onClick={() => handleEditClick(cat)} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                <span className="flex items-center gap-3 text-sm font-medium">
                                    <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: cat.color }}></span>
                                    {cat.name}
                                </span>
                                <div className="flex items-center">
                                    <span className="text-xs text-slate-400 mr-2 hidden sm:block">編輯</span>
                                    <button onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryManager;