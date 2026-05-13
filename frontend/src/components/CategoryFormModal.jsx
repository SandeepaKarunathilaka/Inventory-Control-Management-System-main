import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  status: "ACTIVE"
};

export default function CategoryFormModal({ open, mode, category, onClose, onSubmit, existingNames = [] }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      category
        ? {
            name: category.name || "",
            description: category.description || "",
            status: category.status || "ACTIVE"
          }
        : initialForm
    );
    setErrors({});
    setSubmitting(false);
  }, [open, category]);

  if (!open) return null;

  const validate = () => {
    const nextErrors = {};
    const trimmedName = form.name.trim();
    const currentName = category?.name?.toLowerCase();
    const duplicate = existingNames.some((name) => name.toLowerCase() === trimmedName.toLowerCase() && name.toLowerCase() !== currentName);

    if (!trimmedName) nextErrors.name = "Category name is required.";
    if (duplicate) nextErrors.name = "Category name must be unique.";
    if (form.description.trim().length > 255) nextErrors.description = "Description should not exceed 255 characters.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{mode === "edit" ? "Edit Category" : "Add Category"}</h2>
            <p className="text-sm text-slate-500">Maintain category details used to group inventory products.</p>
          </div>
          <button className="focus-ring rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="categoryName">
              Category Name
            </label>
            <input
              id="categoryName"
              className={`focus-ring mt-2 w-full rounded-lg border px-3 py-2.5 text-sm ${
                errors.name ? "border-rose-300" : "border-slate-300"
              }`}
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Example: Electronics"
              maxLength={100}
            />
            {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className={`focus-ring mt-2 min-h-28 w-full resize-none rounded-lg border px-3 py-2.5 text-sm ${
                errors.description ? "border-rose-300" : "border-slate-300"
              }`}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Short description for this category"
              maxLength={255}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-rose-600">{errors.description}</span>
              <span className="text-slate-400">{form.description.length}/255</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="focus-ring mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button type="button" className="focus-ring rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
