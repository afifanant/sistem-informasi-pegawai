import { Bell, Search } from "lucide-react";

export default function TopbarPegawai() {

  return (
    <div className="bg-white rounded-[30px] p-6 shadow-sm flex items-center justify-between mb-8">

      <div>

        <p className="uppercase tracking-[4px] text-blue-500 text-sm">
          Employee Panel
        </p>

        <h1 className="text-4xl font-black mt-2">
          Dashboard Pegawai
        </h1>
      </div>

      <div className="flex items-center gap-4">

        <div className="bg-gray-100 rounded-2xl px-5 py-3 flex items-center gap-3">

          <Search size={20} />

          <input
            type="text"
            placeholder="Cari..."
            className="bg-transparent outline-none"
          />
        </div>

        <button className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center">

          <Bell size={22} />
        </button>
      </div>
    </div>
  );
}