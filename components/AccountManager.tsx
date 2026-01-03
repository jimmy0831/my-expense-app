
import React from 'react';

interface AccountManagerProps {
    onAccountDelete: () => void;
}

const AccountManager: React.FC<AccountManagerProps> = ({ onAccountDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">帳號設定</h3>
            <div className="mt-4 border-t border-red-200 dark:border-red-900/50 pt-4">
                 <p className="text-sm text-slate-600 dark:text-slate-400">
                    刪除您的帳號將會永久移除所有相關資料，包含您的花費紀錄與自訂類別。此操作無法復原。
                 </p>
                <button 
                    onClick={onAccountDelete}
                    className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                    永久刪除我的帳號
                </button>
            </div>
        </div>
    );
};

export default AccountManager;
