import { Bell, Search, ShieldCheck } from "lucide-react";

export default function Navbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        {onMenu}
        <div>
          <p className="text-sm font-semibold text-slate-950">Web-based Inventory Control System</p>
          <p className="text-xs text-slate-500">Clean category organization for product control</p>
        </div>
      </div>
      <div className="hidden max-w-sm flex-1 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 md:flex">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          className="w-full bg-transparent px-3 py-2 text-sm outline-none"
          placeholder="Search inventory..."
          readOnly
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="focus-ring rounded-lg border border-slate-200 bg-white p-2 text-slate-600" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 sm:flex">
          <ShieldCheck className="h-4 w-4 text-teal-700" />
          <span className="text-sm font-medium text-slate-700">Admin</span>
        </div>
      </div>
    </header>
  );
}
