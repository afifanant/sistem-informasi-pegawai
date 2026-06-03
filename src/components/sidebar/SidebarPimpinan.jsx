import {
  LayoutDashboard,
  Activity,
  BarChart3,
  FileText,
} from "lucide-react";

export default function SidebarPimpinan() {
  return (
    <div className="w-[270px] min-h-screen bg-[#09152f] text-white p-7 flex flex-col justify-between">

      {/* LOGO */}
      <div>
        <div className="flex items-center gap-4 mb-14">

          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
            <LayoutDashboard size={30} />
            
          </div>

          <div>
            <h1 className="text-2xl font-black">
              PIMPINAN
            </h1>

            <p className="text-blue-200">
              panel Pimpinan
            </p>
          </div>

        </div>

        {/* MENU */}
        <div className="space-y-4">

          <a
            href="/pimpinan"
            className="flex items-center gap-4 bg-blue-600 px-5 py-5 rounded-2xl font-bold"
          >
            <LayoutDashboard size={24} />
              
              
              Dashboard
          </a>

          <a
            href="/pimpinan/monitoring"
            className="flex items-center gap-4 hover:bg-white/10 px-5 py-5 rounded-2xl transition"
          >
            <Activity size={24} />
            Monitoring
          </a>

          <a
            href="/pimpinan/statistik"
            className="flex items-center gap-4 hover:bg-white/10 px-5 py-5 rounded-2xl transition"
          >
            <BarChart3 size={24} />
            Statistik
          </a>

          <a
            href="/pimpinan/laporan"
            className="flex items-center gap-4 hover:bg-white/10 px-5 py-5 rounded-2xl transition"
          >
            <FileText size={24} />
            Laporan
          </a>

        </div>

      </div>

      {/* PROFILE */}
      <div className="bg-white/10 rounded-3xl p-5">

        <div className="flex items-center gap-4">

          <img
            src="https://i.pravatar.cc/100?img=12"
            alt=""
            className="w-14 h-14 rounded-full"
          />

          <div>
            <h1 className="font-bold text-lg">
              Pimpinan
            </h1>

            <p className="text-blue-200 text-sm">
              Director Company
            </p>
          </div>

        </div>

        <button className="w-full mt-5 bg-red-500 hover:bg-red-600 transition py-3 rounded-2xl font-bold">
          Logout
        </button>

      </div>

    </div>
  );
}