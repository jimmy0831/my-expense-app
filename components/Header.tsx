
import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
    appName: string;
    onAppNameChange: (newName: string) => void;
    onSignOut: () => void;
    userEmail?: string;
}

const Header: React.FC<HeaderProps> = ({ appName, onAppNameChange, onSignOut, userEmail }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentName, setCurrentName] = useState(appName);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCurrentName(appName);
    }, [appName]);
    
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);
    
    const handleBlur = () => {
        setIsEditing(false);
        if(currentName.trim()){
            onAppNameChange(currentName.trim());
        } else {
            setCurrentName(appName); // revert if empty
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBlur();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setCurrentName(appName);
        }
    };

    return (
        <header className="bg-white dark:bg-slate-800/50 shadow-md p-4 sticky top-0 z-10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentName}
                            onChange={(e) => setCurrentName(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="text-3xl font-bold text-slate-900 dark:text-white bg-transparent outline-none border-b-2 border-indigo-500 w-full"
                        />
                    ) : (
                        <h1 
                            onClick={() => setIsEditing(true)} 
                            className="text-3xl font-bold cursor-pointer text-slate-900 dark:text-white truncate"
                            title="點擊以重新命名"
                        >
                            {appName}
                        </h1>
                    )}
                </div>
                 <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block truncate">{userEmail}</span>
                    <button onClick={onSignOut} className="py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                        登出
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
