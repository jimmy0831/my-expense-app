import React, { useState, useEffect, useMemo } from "react";
import { Category, Expense } from "../types";
import { PlusIcon } from "./icons";
import AutocompleteInput from "./AutocompleteInput";

interface AddExpenseFormProps {
  categories: Category[];
  expenses: Expense[];
  onAddExpense: (
    expense: Omit<Expense, "id" | "created_at" | "user_id">,
  ) => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  categories,
  expenses,
  onAddExpense,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [item, setItem] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    // When categories load, if no category is selected, select the first one.
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  // 根據當前選擇的類別，提取歷史商家（去重且過濾空值）
  const merchantSuggestions = useMemo(() => {
    if (!categoryId) return [];
    const merchants = expenses
      .filter((exp) => exp.category_id === categoryId && exp.merchant)
      .map((exp) => exp.merchant as string);
    return Array.from(new Set(merchants)).sort();
  }, [expenses, categoryId]);

  // 根據當前輸入的商家，提取歷史項目（去重且過濾空值）
  const itemSuggestions = useMemo(() => {
    if (!merchant) return [];
    const items = expenses
      .filter((exp) => exp.merchant === merchant && exp.item)
      .map((exp) => exp.item as string);
    return Array.from(new Set(items)).sort();
  }, [expenses, merchant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      date,
      category_id: categoryId || null,
      amount: parseFloat(amount) || 0,
      merchant,
      item,
      note: note || null,
    });
    // Reset form
    setAmount("");
    setMerchant("");
    setItem("");
    setNote("");
  };

  const commonInputClass =
    "mt-1 block w-full rounded-lg border-slate-300 bg-white dark:bg-slate-700/80 dark:border-slate-600 px-3 py-2 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";
  const dateInputClass =
    "mt-1 block w-full rounded-lg border-slate-300 bg-white dark:bg-slate-700/80 dark:border-slate-600 px-3 py-2 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm [&::-webkit-date-and-time-value]:text-left [&::-webkit-datetime-edit]:px-0 [&::-webkit-datetime-edit-fields-wrapper]:px-0 min-h-[38px]";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold leading-6 text-slate-900 dark:text-white">
        新增消費
      </h3>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            日期
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={dateInputClass}
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            類別
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={commonInputClass}
          >
            {categories.length === 0 ? (
              <option value="">請先新增一個類別</option>
            ) : (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            金額
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className={commonInputClass}
          />
        </div>
        <AutocompleteInput
          id="merchant"
          label="商家 (可選)"
          value={merchant}
          onChange={setMerchant}
          suggestions={merchantSuggestions}
        />
        <AutocompleteInput
          id="item"
          label="項目 (可選)"
          value={item}
          onChange={setItem}
          suggestions={itemSuggestions}
        />
        <div>
          <label
            htmlFor="note"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            備註 (可選)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className={commonInputClass}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
        >
          <PlusIcon /> 新增花費
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;
