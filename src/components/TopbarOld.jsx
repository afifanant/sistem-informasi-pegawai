import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <div className="bg-[#111827] border border-gray-800 p-5 rounded-3xl flex justify-between items-center mb-8">

      {/* SEARCH */}
      <div className="flex items-center gap-3 bg-[#1e293b] px-5 py-3 rounded-2xl w-[350px]">

        <Search size={20} className="text-gray-400" />

        <input
          type="text"
          placeholder="Cari sesuatu..."
          className="bg-transparent outline-none w-full text-white"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        <button className="bg-[#1e293b] p-3 rounded-2xl">
          <Bell />
        </button>

        <div className="flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/100"
            alt=""
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h3 className="font-bold">
              Administrator
            </h3>

            <p className="text-gray-400 text-sm">
              Admin Perusahaan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}