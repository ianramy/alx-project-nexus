// src/components/profile/ProfileModal.tsx

import { useEffect, useMemo, useState } from "react";
import { updateCurrentUser, changeCurrentUserPassword } from "@/utils/auth";

export type EditableUser = {
    id?: number | string;
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    bio?: string | null;
    avatar?: string | null;
    phone_number?: string | null;
    date_of_birth?: string | null; // YYYY-MM-DD
    gender?: string | null;
    city?: number | null;
};

export type PasswordForm = {
    current_password: string;
    new_password: string;
    re_new_password: string;
};

export type ProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initial: EditableUser;
    onSaved: (u: EditableUser) => void;
    loading: boolean;
    setLoading: (v: boolean) => void;
};

export default function ProfileModal({
    isOpen,
    onClose,
    initial,
    onSaved,
    loading,
    setLoading,
}: ProfileModalProps) {
    const [form, setForm] = useState<EditableUser>(initial);
    const [pwOpen, setPwOpen] = useState(false);
    const [pw, setPw] = useState<PasswordForm>({
        current_password: "",
        new_password: "",
        re_new_password: "",
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setForm(initial);
            setPw({ current_password: "", new_password: "", re_new_password: "" });
            setPwOpen(false);
            setError(null);
        }
    }, [isOpen, initial]);

    const canSave = useMemo(() => Boolean(form?.username && form?.email), [form]);

    const handleChange = (key: keyof EditableUser, v: string) => {
        setForm((prev) => ({ ...prev, [key]: v }));
    };

    const diff = (a: EditableUser, b: EditableUser) => {
        const out: Record<string, unknown> = {};
        (Object.keys(b) as (keyof EditableUser)[]).forEach((k) => {
            if (k === "id") return;
            if (b[k] !== a[k]) out[k as string] = b[k] as unknown;
        });
        return out;
    };

    const normalizeErr = (e: unknown) => {
        const err = e as { data?: Record<string, unknown>; message?: string };
        if (err?.data && typeof err.data === "object") {
            return Object.entries(err.data)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as unknown[]).join(", ") : String(v)}`)
                .join(" | ");
        }
        return err?.message ?? "Something went sideways.";
    };

    const handleSubmit = async () => {
        if (!canSave) return;
        setLoading(true);
        setError(null);
        try {
            // 1) change password if requested
            const wantsPwChange =
                pwOpen && pw.current_password && pw.new_password && pw.re_new_password;
            if (wantsPwChange) {
                await changeCurrentUserPassword(pw);
            }

            // 2) patch profile with just the changes
            const payload = diff(initial, form);
            if (Object.keys(payload).length > 0) {
                const updated = (await updateCurrentUser(payload)) as EditableUser;
                onSaved(updated);
            }

            onClose();
        } catch (e) {
            setError(normalizeErr(e));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Overlay */}
                <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

                {/* Panel */}
                <div
                    className="relative z-10 my-8 w-full max-w-lg rounded-xl bg-white shadow-xl p-6 max-h-[85vh] overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-profile-title"
                >
                    <h3 id="edit-profile-title" className="text-xl font-semibold text-gray-900">Edit profile</h3>
                    <p className="text-sm text-gray-500 mb-4">Keep your details crisp and current.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                value={form.username ?? ""}
                                onChange={(e) => handleChange("username", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                value={form.email ?? ""}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First name</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                    value={form.first_name ?? ""}
                                    onChange={(e) => handleChange("first_name", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last name</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                    value={form.last_name ?? ""}
                                    onChange={(e) => handleChange("last_name", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                rows={3}
                                value={form.bio ?? ""}
                                onChange={(e) => handleChange("bio", e.target.value)}
                                placeholder="Say a little, mean a lot."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                            <input
                                type="url"
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                value={form.avatar ?? ""}
                                onChange={(e) => handleChange("avatar", e.target.value)}
                                placeholder="https://…"
                            />
                        </div>

                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => setPwOpen((s) => !s)}
                                className="text-sm font-medium text-green-700 hover:underline"
                            >
                                {pwOpen ? "Hide password change" : "Change password"}
                            </button>
                        </div>

                        {pwOpen && (
                            <div className="mt-3 space-y-3 rounded-lg border border-gray-200 p-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current password</label>
                                    <input
                                        type="password"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                        value={pw.current_password}
                                        onChange={(e) => setPw((p) => ({ ...p, current_password: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New password</label>
                                    <input
                                        type="password"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                        value={pw.new_password}
                                        onChange={(e) => setPw((p) => ({ ...p, new_password: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm new password</label>
                                    <input
                                        type="password"
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                        value={pw.re_new_password}
                                        onChange={(e) => setPw((p) => ({ ...p, re_new_password: e.target.value }))}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Use a long passphrase. Future you will high-five you.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-md bg-red-50 p-2 text-sm text-red-700 border border-red-200">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                            disabled={!canSave || loading}
                        >
                            {loading ? "Saving…" : "Save changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
