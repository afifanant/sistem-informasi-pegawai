import {
  LayoutDashboard,
  Activity,
  BarChart3,
  FileText,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function SidebarPimpinan() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getNavClass = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-5 rounded-2xl font-bold transition duration-300 ${
      isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="w-[270px] min-h-screen bg-[#09152f] text-white p-7 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-14">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
            <LayoutDashboard size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-black">PIMPINAN</h1>
            <p className="text-blue-200">panel Pimpinan</p>
          </div>
        </div>

        {/* MENU */}
        <div className="space-y-4">
          {/* Tambahkan atribut "end" di sini agar Dashboard tidak aktif saat di halaman lain */}
          <NavLink to="/pimpinan" end className={getNavClass}>
            <LayoutDashboard size={24} />
            Dashboard
          </NavLink>

          <NavLink to="/pimpinan/monitoring" className={getNavClass}>
            <Activity size={24} />
            Monitoring
          </NavLink>

          <NavLink to="/pimpinan/statistik" className={getNavClass}>
            <BarChart3 size={24} />
            Statistik
          </NavLink>

          <NavLink to="/pimpinan/laporan" className={getNavClass}>
            <FileText size={24} />
            Laporan
          </NavLink>
        </div>
      </div>

      {/* PROFILE & LOGOUT */}
      <div className="bg-white/5 rounded-3xl p-5">
        <div className="flex items-center gap-4">
          <img src="https://i.pravatar.cc/100?img=12" alt="Profile" className="w-14 h-14 rounded-full" />
          <div>
            <h1 className="font-bold text-lg">Pimpinan</h1>
            <p className="text-blue-300 text-sm">Director Company</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full mt-5 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white transition py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}