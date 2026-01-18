import React, { useState } from "react";
import Modal from "./Modal";

interface AccountManagerProps {
  onAccountDelete: () => void;
  onPasswordUpdate: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
}

const AccountManager: React.FC<AccountManagerProps> = ({
  onAccountDelete,
  onPasswordUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // 前端驗證
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "請填寫所有欄位" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "新密碼與確認密碼不相符" });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({ type: "error", text: "新密碼不能與目前密碼相同" });
      return;
    }

    try {
      setLoading(true);
      await onPasswordUpdate(currentPassword, newPassword);
      setMessage({ type: "success", text: "密碼更新成功！" });
      // 清空表單
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // 延遲關閉 modal 讓用戶看到成功訊息
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage(null);
      }, 1500);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "密碼更新失敗" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setMessage(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const commonInputClass =
    "mt-1 block w-full rounded-lg border-slate-300 bg-white dark:bg-slate-700/80 dark:border-slate-600 px-3 py-2 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
          帳號設定
        </h3>

        {/* 密碼修改按鈕 */}
        <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
          <button
            onClick={handleOpenModal}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            修改密碼
          </button>
        </div>

        {/* 帳號刪除區塊 */}
        <div className="mt-6 border-t border-red-200 dark:border-red-900/50 pt-4">
          <button
            onClick={onAccountDelete}
            className="mt-4 w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            永久刪除我的帳號
          </button>
        </div>
      </div>

      {/* 密碼修改 Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="修改密碼">
        <div className="p-5">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                目前密碼
              </label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={commonInputClass}
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                新密碼
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={commonInputClass}
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                確認新密碼
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={commonInputClass}
                disabled={loading}
              />
            </div>
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "處理中..." : "更新密碼"}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AccountManager;
