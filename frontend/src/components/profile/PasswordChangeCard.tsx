import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuth from "../../hook/useAuth";

type PasswordField = "current_password" | "password" | "password_confirmation";

type PasswordForm = Record<PasswordField, string>;

type PasswordErrors = Partial<Record<PasswordField, string>>;

interface ValidationErrorResponse {
  message?: string;
  errors?: Partial<Record<PasswordField, string[]>>;
}

const initialForm: PasswordForm = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

const fieldLabels: Record<PasswordField, string> = {
  current_password: "Password saat ini",
  password: "Password baru",
  password_confirmation: "Konfirmasi password baru",
};

const PasswordChangeCard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [form, setForm] = useState<PasswordForm>(initialForm);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: PasswordField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await api.patch<{ message: string }>("/profile/password", form);
      setForm(initialForm);
      setMessage(response.data.message || "Password berhasil diubah. Silakan masuk kembali.");

      await new Promise((resolve) => window.setTimeout(resolve, 900));
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      const response = (error as { response?: { data?: ValidationErrorResponse } }).response;
      const validationErrors = response?.data?.errors;

      if (validationErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(validationErrors).map(([field, messages]) => [
              field,
              messages?.[0] || "Kolom ini tidak valid.",
            ])
          ) as PasswordErrors
        );
      } else {
        setMessage(response?.data?.message || "Gagal mengubah password. Periksa kembali data yang dimasukkan.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Ubah Password</h2>
          <p className="mt-1 text-sm text-gray-500">
            Password bisa diganti kapan saja. Setelah berhasil, Anda perlu login ulang.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-3">
        {(Object.keys(fieldLabels) as PasswordField[]).map((field) => (
          <label key={field} className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {fieldLabels[field]}
            </span>
            <input
              type="password"
              value={form[field]}
              onChange={(event) => updateField(field, event.target.value)}
              disabled={isSubmitting}
              autoComplete={field === "current_password" ? "current-password" : "new-password"}
              className={`mt-2 w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white ${
                errors[field] ? "border-red-300" : "border-gray-100"
              }`}
            />
            {errors[field] && (
              <span className="mt-1 block text-xs font-medium text-red-600">
                {errors[field]}
              </span>
            )}
          </label>
        ))}

        <div className="md:col-span-3">
          {message && (
            <div className={`mb-4 rounded-xl border p-3 text-sm font-semibold ${
              message.includes("berhasil")
                ? "border-green-100 bg-green-50 text-green-700"
                : "border-red-100 bg-red-50 text-red-700"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Menyimpan..." : "Ubah Password"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PasswordChangeCard;
