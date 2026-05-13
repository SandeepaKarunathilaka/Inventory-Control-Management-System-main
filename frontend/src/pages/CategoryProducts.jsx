import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, Filter, PackageSearch, Search } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categoryApi } from "../api/categoryApi";
import { productApi } from "../api/productApi";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, getApiError } from "../lib/formatters";

export default function CategoryProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(id);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setLoading(true);
        const [categoryList, categoryDetails, productList] = await Promise.all([
          categoryApi.getAll(),
          categoryApi.getById(id),
          productApi.getAll(id)
        ]);
        setCategories(categoryList.data);
        setSelectedCategory(categoryDetails.data);
        setProducts(productList.data);
      } catch (error) {
        toast.error(getApiError(error, "Unable to load category products"));
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, [id]);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    setLoading(true);
    try {
      const [categoryDetails, productList] = await Promise.all([
        categoryApi.getById(categoryId),
        productApi.getAll(categoryId)
      ]);
      setSelectedCategory(categoryDetails.data);
      setProducts(productList.data);
      navigate(`/categories/${categoryId}/products`, { replace: true });
    } catch (error) {
      toast.error(getApiError(error, "Unable to filter products by category"));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.id} ${product.name} ${product.sku} ${product.status}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800">
            <ArrowLeft className="h-4 w-4" />
            Back to Category Management
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-normal text-slate-950">Products Under Category</h1>
          <p className="mt-1 text-sm text-slate-500">
            Selected category: <span className="font-semibold text-slate-800">{selectedCategory?.name || "Loading..."}</span>
          </p>
        </div>
      </div>

      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_260px]">
        <div className="flex items-center rounded-lg border border-slate-300 bg-white px-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="focus-ring w-full border-0 px-3 py-2.5 text-sm outline-none"
            placeholder="Search products by name, SKU, or status"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            className="focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            value={selectedCategoryId}
            onChange={(event) => handleCategoryChange(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner label="Loading products..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState title="No products found" description="This category has no products or your search did not match any item." />
      ) : (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <PackageSearch className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950">{selectedCategory?.name} Products</h2>
                <p className="text-sm text-slate-500">{filteredProducts.length} item(s) displayed</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["Product ID", "Product Name", "SKU", "Price", "Quantity", "Status"].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-700">PRD-{String(product.id).padStart(3, "0")}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-950">{product.name}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{product.sku}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-700">{formatCurrency(product.price)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{product.quantity}</td>
                    <td className="whitespace-nowrap px-4 py-4"><StatusBadge status={product.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
