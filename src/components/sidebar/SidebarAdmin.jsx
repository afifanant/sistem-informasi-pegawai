import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Building2,
  FileText,
  Settings,
  LogOut,
  HardHat // Penambahan ikon konstruksi/proyek lapangan yang relevan
} from "lucide-react";

import { useNavigate, Link, useLocation } from "react-router-dom";

export default function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menus = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={22} />,
    },
    {
      title: "Data Pegawai",
      path: "/admin/pegawai",
      icon: <Users size={22} />,
    },
    {
      title: "Absensi",
      path: "/admin/absensi",
      icon: <ClipboardCheck size={22} />,
    },
    {
      title: "Divisi",
      path: "/admin/divisi",
      icon: <Building2 size={22} />,
    },
    {
      title: "Proyek", // Menu baru untuk manajemen penugasan proyek lapangan
      path: "/admin/proyek",
      icon: <HardHat size={22} />,
    },
    {
      title: "Laporan",
      path: "/admin/laporan",
      icon: <FileText size={22} />,
    },
    {
      title: "Pengaturan",
      path: "/admin/pengaturan",
      icon: <Settings size={22} />,
    },
  ];

  return (
    <aside className="w-[290px] bg-[#0f172a] text-white min-h-screen flex flex-col justify-between p-7">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-4 mb-14">
          <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-wide">
              SIMPEG
            </h1>
            <p className="text-gray-400">
              PT Sa'adah Dinar
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-3">
          {menus.map((menu, index) => {
            const active = location.pathname === menu.path;

            return (
              <Link
                key={index}
                to={menu.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-semibold
                ${active
                    ? "bg-blue-600 shadow-lg shadow-blue-500/20"
                    : "hover:bg-white/10 text-gray-300"
                  }
                `}
              >
                {menu.icon}
                <span>{menu.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* PROFILE */}
      <div className="bg-white/5 border border-white/10 rounded-[30px] p-5">
        <div className="text-center mb-2">
          <h3 className="font-bold text-lg">
            Administrator
          </h3>
          <p className="text-gray-400 text-sm">
            Admin Perusahaan
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 transition-all py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}