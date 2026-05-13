export default function StatCard({ title, value, icon: Icon, accent = "teal" }) {
  const styles = {
    teal: "bg-teal-50 text-teal-700",
    blue: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700"
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-normal text-slate-950">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${styles[accent]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
