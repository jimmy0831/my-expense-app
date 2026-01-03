
import React from 'react';
import { DocumentTextIcon, ChartPieIcon, CogIcon } from './icons';

interface TabsProps {
    activeTab: string;
    onTabClick: (tabName: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabClick }) => {
    const tabs = [
        { name: 'records', label: '紀錄', icon: <DocumentTextIcon /> },
        { name: 'charts', label: '圖表', icon: <ChartPieIcon /> },
        { name: 'settings', label: '設定', icon: <CogIcon /> },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800/95 border-t border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
            <div className="flex justify-around max-w-lg mx-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        onClick={() => onTabClick(tab.name)}
                        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm transition-colors ${
                            activeTab === tab.name
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`}
                    >
                        {React.cloneElement(tab.icon, { className: 'h-6 w-6' })}
                        <span className="mt-1">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
