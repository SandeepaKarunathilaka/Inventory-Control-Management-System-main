import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Edit3, Eye, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../api/categoryApi";
import CategoryFormModal from "../components/CategoryFormModal";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import { formatDate, getApiError } from "../lib/formatters";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modal, setModal] = useState({ open: false, mode: "add", category: null });
  const navigate = useNavigate();

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error(getApiError(error, "Unable to load categories"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = `${category.id} ${category.name} ${category.description || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || category.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const handleSubmit = async (payload) => {
    try {
      if (modal.mode === "edit") {
        await categoryApi.update(modal.category.id, payload);
        toast.success("Category updated successfully");
      } else {
        await categoryApi.create(payload);
        toast.success("Category added successfully");
      }
      setModal({ open: false, mode: "add", category: null });
      await loadCategories();
    } catch (error) {
      toast.error(getApiError(error, "Unable to save category"));
    }
  };

  const handleDelete = async (category) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this category?",
      text: category.productCount > 0 ? "This category has products, so the backend will prevent deletion." : "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#475569",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      await categoryApi.remove(category.id);
      toast.success("Category deleted successfully");
      await loadCategories();
    } catch (error) {
      toast.error(getApiError(error, "Unable to delete category"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-normal text-slate-950">Category Management</h1>
          <p className="mt-1 text-sm text-slate-500">Create, update, delete, and inspect inventory product categories.</p>
        </div>
        <button
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          onClick={() => setModal({ open: true, mode: "add", category: null })}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="flex items-center rounded-lg border border-slate-300 bg-white px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="focus-ring w-full border-0 px-3 py-2.5 text-sm outline-none"
              placeholder="Search categories"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <select
            className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner label="Loading categories..." />
      ) : filteredCategories.length === 0 ? (
        <EmptyState title="No categories found" description="Try adjusting the search or add a new category for the demo." />
      ) : (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["Category ID", "Category Name", "Description", "Status", "Product Count", "Created Date", "Actions"].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="transition hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-700">CAT-{String(category.id).padStart(3, "0")}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-950">{category.name}</td>
                    <td className="min-w-72 px-4 py-4 text-sm text-slate-600">{category.description || "-"}</td>
                    <td className="whitespace-nowrap px-4 py-4"><StatusBadge status={category.status} /></td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-700">{category.productCount}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{formatDate(category.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="focus-ring rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                          title="View Products"
                          onClick={() => navigate(`/categories/${category.id}/products`)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="focus-ring rounded-lg border border-slate-200 p-2 text-sky-700 transition hover:bg-sky-50"
                          title="Edit"
                          onClick={() => setModal({ open: true, mode: "edit", category })}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className="focus-ring rounded-lg border border-slate-200 p-2 text-rose-700 transition hover:bg-rose-50"
                          title="Delete"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <CategoryFormModal
        open={modal.open}
        mode={modal.mode}
        category={modal.category}
        existingNames={categories.map((category) => category.name)}
        onClose={() => setModal({ open: false, mode: "add", category: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
