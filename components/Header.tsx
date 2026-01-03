
import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
    appName: string;
    onAppNameChange: (newName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ appName, onAppNameChange }) => {
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
            <div className="max-w-7xl mx-auto">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentName}
                        onChange={(e) => setCurrentName(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="text-3xl font-bold text-slate-900 dark:text-white bg-transparent outline-none border-b-2 border-indigo-500"
                    />
                ) : (
                    <h1 
                        onClick={() => setIsEditing(true)} 
                        className="text-3xl font-bold cursor-pointer text-slate-900 dark:text-white"
                        title="點擊以重新命名"
                    >
                        {appName}
                    </h1>
                )}
            </div>
        </header>
    );
};

export default Header;
