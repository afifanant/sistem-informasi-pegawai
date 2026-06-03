import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart3,
  LogOut,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {

  const location = useLocation();

  const menus = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={22} />,
      path: "/admin",
    },

    {
      title: "Data Pegawai",
      icon: <Users size={22} />,
      path: "/admin/pegawai",
    },

    {
      title: "Absensi",
      icon: <ClipboardCheck size={22} />,
      path: "/admin/absensi",
    },

    {
      title: "Statistik",
      icon: <BarChart3 size={22} />,
      path: "/pimpinan/statistik",
    },
  ];

  return (
    <aside className="w-[300px] bg-[#0f172a] text-white min-h-screen p-7 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="mb-14">

          <h1 className="text-4xl font-black tracking-wide">
            SIMPEG
          </h1>

          <p className="text-gray-400 mt-2">
            Sistem Informasi Pegawai
          </p>
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
                    ? "bg-blue-600 shadow-lg shadow-blue-600/30"
                    : "hover:bg-white/10 text-gray-300"
                  }`}
              >

                {menu.icon}

                <span>
                  {menu.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* PROFILE */}
      <div className="bg-white/5 border border-white/10 rounded-[30px] p-5">

        <div className="flex items-center gap-4">

          <img
            src="https://i.pravatar.cc/100"
            alt="admin"
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>

            <h3 className="font-bold text-lg">
              Administrator
            </h3>

            <p className="text-gray-400 text-sm">
              Admin Perusahaan
            </p>
          </div>
        </div>

        <button className="mt-6 w-full bg-red-500 hover:bg-red-600 transition-all py-3 rounded-2xl font-bold flex items-center justify-center gap-2">

          <LogOut size={20} />

          Logout
        </button>
      </div>
    </aside>
  );
}