import { useEffect, useState } from "react";
import { Boxes, CheckCircle2, Package, XCircle } from "lucide-react";
import { categoryApi } from "../api/categoryApi";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import { getApiError } from "../lib/formatters";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await categoryApi.getStats();
        setStats(response.data);
      } catch (error) {
        toast.error(getApiError(error, "Unable to load dashboard summary"));
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard summary..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-normal text-slate-950">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Category and product overview for the admin demo.</p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Categories" value={stats?.totalCategories ?? 0} icon={Boxes} accent="teal" />
        <StatCard title="Active Categories" value={stats?.activeCategories ?? 0} icon={CheckCircle2} accent="blue" />
        <StatCard title="Inactive Categories" value={stats?.inactiveCategories ?? 0} icon={XCircle} accent="amber" />
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} accent="rose" />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Viva Demo Focus</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          This module helps the admin organize products into categories, maintain category status, prevent duplicate category names,
          and filter products by their assigned category.
        </p>
      </section>
    </div>
  );
}
