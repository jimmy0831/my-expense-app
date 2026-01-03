
import React, { useState, useMemo } from 'react';
import { JoinedExpense } from '../types';

interface CalendarViewProps {
    expenses: JoinedExpense[];
    onDateSelect: (date: string) => void;
    selectedDate: string | null;
}

const CalendarView: React.FC<CalendarViewProps> = ({ expenses, onDateSelect, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const expenseDates = useMemo(() => {
        return new Set(expenses.map(exp => exp.date));
    }, [expenses]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const monthName = currentDate.toLocaleString('zh-TW', { month: 'long' });
    const year = currentDate.getFullYear();

    const getDaysInMonth = () => {
        const date = new Date(year, currentDate.getMonth(), 1);
        const days = [];
        while (date.getMonth() === currentDate.getMonth()) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
    const daysInMonth = getDaysInMonth();
    
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    
    // Helper to format date to YYYY-MM-DD without timezone issues
    const toLocalDateString = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">&lt;</button>
                <h3 className="font-bold text-lg">{year} {monthName}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-500 dark:text-slate-300">
                {dayNames.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {daysInMonth.map(day => {
                    const dateString = toLocalDateString(day);
                    const hasExpense = expenseDates.has(dateString);
                    const isSelected = selectedDate === dateString;
                    const isToday = toLocalDateString(new Date()) === dateString;

                    return (
                        <div key={dateString} onClick={() => onDateSelect(dateString)} className="relative flex justify-center items-center h-10 cursor-pointer">
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isSelected ? 'bg-indigo-500 text-white' : isToday ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                {day.getDate()}
                            </span>
                            {hasExpense && <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
