import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading data..." }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white">
      <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
