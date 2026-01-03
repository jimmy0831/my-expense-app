
import React, { useMemo, useState } from 'react';
import { JoinedExpense } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartPieIcon, ListIcon, NoDataIcon } from './icons';

interface ChartsProps {
    expenses: JoinedExpense[];
}

const getMonthStartEnd = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date();
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
};

const Charts: React.FC<ChartsProps> = ({ expenses }) => {
    const [startDate, setStartDate] = useState(getMonthStartEnd().start);
    const [endDate, setEndDate] = useState(getMonthStartEnd().end);

    const filteredExpenses = useMemo(() => {
        if (!startDate || !endDate) return expenses;
        return expenses.filter(exp => {
            return exp.date >= startDate && exp.date <= endDate;
        });
    }, [expenses, startDate, endDate]);

    const pieData = useMemo(() => {
        const dataMap = new Map<string, { name: string; value: number; color: string }>();
        filteredExpenses.forEach(exp => {
            const existing = dataMap.get(exp.category.id);
            if (existing) {
                existing.value += exp.amount;
            } else {
                dataMap.set(exp.category.id, {
                    name: exp.category.name,
                    value: exp.amount,
                    color: exp.category.color,
                });
            }
        });
        return Array.from(dataMap.values());
    }, [filteredExpenses]);

    const barData = useMemo(() => {
        const dataMap = new Map<string, { name: string; amount: number }>();
        filteredExpenses.forEach(exp => {
            const date = new Date(exp.date).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
            const existing = dataMap.get(exp.date); // Group by exact date
            if (existing) {
                existing.amount += exp.amount;
            } else {
                dataMap.set(exp.date, { name: date, amount: exp.amount });
            }
        });
        return Array.from(dataMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(entry => entry[1]);
    }, [filteredExpenses]);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        if (percent === 0) return null;
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const commonInputClass = "mt-1 block w-full rounded-lg border-slate-300 bg-white dark:bg-slate-700/80 dark:border-slate-600 px-3 py-2 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";
    
    const chartTitleDateRange = `${startDate.replace(/-/g, '/')} - ${endDate.replace(/-/g, '/')}`;

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">開始日期</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} max={endDate} className={commonInputClass} />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">結束日期</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className={commonInputClass} />
                    </div>
                </div>
            </div>

            {filteredExpenses.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center flex flex-col items-center justify-center">
                    <NoDataIcon />
                    <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">此範圍內無資料</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">請嘗試擴大您的日期範圍，或新增花費紀錄。</p>
                </div>
            ) : (
                <>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                         <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2"><ChartPieIcon /> 消費佔比</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{chartTitleDateRange}</p>
                        </div>
                        <div className="w-full h-80 mt-4">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={renderCustomizedLabel}>
                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`}/>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2"><ListIcon/> 每日花費趨勢</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{chartTitleDateRange}</p>
                        </div>
                        <div className="w-full h-80 mt-4">
                            <ResponsiveContainer>
                                <BarChart data={barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                    <Bar dataKey="amount" fill="#4f46e5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Charts;