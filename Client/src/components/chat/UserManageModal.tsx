import React, { useState, useEffect } from "react";
import type { User } from "../../types/chat";
import { api } from "../../services/api";
import { UserPlus, UserCheck, Trash2, X, AlertTriangle, Edit3, Eye, EyeOff } from "lucide-react";

interface UserManageModalProps {
  mode: "create" | "edit" | "delete" | null;
  targetUser?: User | null;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserManageModal: React.FC<UserManageModalProps> = ({
  mode,
  targetUser,
  token,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (targetUser && mode === "edit") {
      setName(targetUser.name);
      setEmail(targetUser.email);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setPassword("");
    }
    setShowPassword(false);
    setError(null);
  }, [targetUser, mode]);

  if (!mode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "create") {
        await api.createUser(token, { name, email, password });
      } else if (mode === "edit" && targetUser) {
        const updateData: { name?: string; email?: string; password?: string } = {};
        if (name.trim()) updateData.name = name.trim();
        if (email.trim()) updateData.email = email.trim();
        if (password.trim()) updateData.password = password.trim();
        await api.updateUser(token, targetUser._id, updateData);
      } else if (mode === "delete" && targetUser) {
        await api.deleteUser(token, targetUser._id);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm select-none">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            {mode === "create" && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                <UserPlus className="h-5 w-5" />
              </div>
            )}
            {mode === "edit" && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                <Edit3 className="h-5 w-5" />
              </div>
            )}
            {mode === "delete" && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                {mode === "create" && "Create New User"}
                {mode === "edit" && "Edit User Details"}
                {mode === "delete" && "Delete User Account"}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {mode === "create" && "Add a new user to the chat system"}
                {mode === "edit" && `Updating ${targetUser?.name || "user"}`}
                {mode === "delete" && "This action cannot be undone"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {mode === "delete" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-200">
                <AlertTriangle className="h-6 w-6 shrink-0 text-rose-400" />
                <p>
                  Are you sure you want to delete user{" "}
                  <strong className="text-white">{targetUser?.name}</strong> ({targetUser?.email})?
                </p>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Charlie Brown"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="charlie@palmtask.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-300">
                  {mode === "create" ? "Password" : "New Password (leave blank to keep current)"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={mode === "create"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-3.5 pr-10 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition focus:outline-none"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>{mode === "create" ? "Create User" : "Save Changes"}</span>
                      <UserCheck className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
