
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SunIcon, MoonIcon, DesktopIcon } from './icons';

type Theme = 'light' | 'dark' | 'system';

const ThemeSwitcher: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
                return savedTheme as Theme;
            }
        }
        return 'system';
    });
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = window.document.documentElement;
        const applyTheme = (t: Theme) => {
            if (t === 'light') {
                root.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else if (t === 'dark') {
                root.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else { // system
                localStorage.removeItem('theme');
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        applyTheme(theme);
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            // Only re-apply if the current theme is 'system'
            if (localStorage.getItem('theme') === null) {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        setIsOpen(false);
    };

    const options = [
        { value: 'light', label: '淺色', icon: <SunIcon className="w-5 h-5" /> },
        { value: 'dark', label: '深色', icon: <MoonIcon className="w-5 h-5" /> },
        { value: 'system', label: '系統', icon: <DesktopIcon className="w-5 h-5" /> },
    ] as const;

    const CurrentIcon = useMemo(() => {
        const Icon = options.find(opt => opt.value === theme)?.icon;
        return React.cloneElement(Icon || <DesktopIcon className="w-5 h-5" />, { className: "w-5 h-5" });
    }, [theme]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800"
                aria-label="切換主題"
            >
                {CurrentIcon}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-16 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleThemeChange(option.value)}
                                title={option.label}
                                aria-label={option.label}
                                className={`flex justify-center items-center w-full p-3 ${
                                    theme === option.value
                                        ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {option.icon}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;