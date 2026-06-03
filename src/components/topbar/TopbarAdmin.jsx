import {
  Bell,
  Search,
  Moon,
} from "lucide-react";

export default function TopbarAdmin() {

  return (
    <div className="bg-white rounded-[30px] p-6 shadow-sm flex items-center justify-between mb-8">

      {/* LEFT */}
      <div>

        <p className="uppercase tracking-[4px] text-gray-400 text-sm">
          Administrator
        </p>

        <h1 className="text-4xl font-black mt-2">
          Dashboard Admin
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="bg-gray-100 rounded-2xl px-5 py-3 flex items-center gap-3">

          <Search size={20} className="text-gray-500" />

          <input
            type="text"
            placeholder="Cari data..."
            className="bg-transparent outline-none"
          />
        </div>

        {/* DARK */}
        <button className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">

          <Moon size={22} />
        </button>

        {/* NOTIF */}
        <button className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">

          <Bell size={22} />
        </button>
      </div>
    </div>
  );
}