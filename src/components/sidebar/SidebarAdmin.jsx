import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Building2,
  FileText,
  Settings,
  LogOut,
  HardHat,
  UserCircle
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menus = [
    { title: "Dashboard", path: "/admin", icon: <LayoutDashboard size={22} /> },
    { title: "Data Pegawai", path: "/admin/pegawai", icon: <Users size={22} /> },
    { title: "Absensi", path: "/admin/absensi", icon: <ClipboardCheck size={22} /> },
    { title: "Divisi", path: "/admin/divisi", icon: <Building2 size={22} /> },
    { title: "Proyek", path: "/admin/proyek", icon: <HardHat size={22} /> },
    { title: "Laporan", path: "/admin/laporan", icon: <FileText size={22} /> },
    { title: "Pengaturan", path: "/admin/pengaturan", icon: <Settings size={22} /> },
  ];

  return (
    <aside className="w-[290px] min-h-screen bg-[#0b1225] border-r border-white/5 p-7 flex flex-col justify-between select-none">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-4 mb-16 px-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Building2 size={30} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">ADMIN</h1>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">PT Sa'adah Dinar</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-2">
          {menus.map((menu, index) => {
            const active = location.pathname === menu.path;
            return (
              <Link
                key={index}
                to={menu.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-blue-200/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {menu.icon}
                <span>{menu.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* PROFILE FOOTER */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-300">
            <UserCircle size={28} />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Administrator</h3>
            <p className="text-blue-300/50 text-[11px] font-bold uppercase tracking-wider">System Root</p>
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
    </aside>
  );
}