import {
  LayoutDashboard,
  Activity,
  BarChart3,
  FileText,
  LogOut,
  UserCircle
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
    `flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
      isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
        : "text-blue-200/60 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="w-[280px] min-h-screen bg-[#0b1225] border-r border-white/5 p-6 flex flex-col justify-between select-none">
      <div>
        {/* BRANDING */}
        <div className="flex items-center gap-4 mb-16 px-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <LayoutDashboard size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">PIMPINAN</h1>
            <p className="text-blue-400 text-xs font-medium tracking-wider uppercase">PT Sa'adah Dinar</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-2">
          <NavLink to="/pimpinan" end className={getNavClass}>
            <LayoutDashboard size={22} />
            Dashboard
          </NavLink>

          <NavLink to="/pimpinan/monitoring" className={getNavClass}>
            <Activity size={22} />
            Monitoring
          </NavLink>

          <NavLink to="/pimpinan/statistik" className={getNavClass}>
            <BarChart3 size={22} />
            Statistik
          </NavLink>

          <NavLink to="/pimpinan/laporan" className={getNavClass}>
            <FileText size={22} />
            Laporan
          </NavLink>
        </nav>
      </div>

      {/* PROFILE & LOGOUT FOOTER */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-300">
            <UserCircle size={28} />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Pimpinan</h1>
            <p className="text-blue-300/50 text-[11px] font-bold uppercase tracking-wider">Director</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-300 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
}