import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Briefcase,
  LogOut,
  Building2,
} from "lucide-react";

export default function DashboardLayout({ children }) {

  const location = useLocation();

  const menus = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin",
    },

    {
      title: "Data Pegawai",
      icon: <Users size={20} />,
      path: "/admin/pegawai",
    },

    {
      title: "Absensi",
      icon: <ClipboardList size={20} />,
      path: "/admin/absensi",
    },

    {
      title: "Statistik",
      icon: <BarChart3 size={20} />,
      path: "/pimpinan/statistik",
    },

    {
      title: "Monitoring",
      icon: <Briefcase size={20} />,
      path: "/pimpinan/monitoring",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-[290px] bg-slate-950 text-white p-8 hidden lg:flex flex-col justify-between">

        <div>

          {/* LOGO */}
          <div className="flex items-center gap-4 mb-14">

            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Building2 size={30} />
            </div>

            <div>
              <h1 className="font-black text-2xl">
                SIMPEG
              </h1>

              <p className="text-gray-400 text-sm">
                Company System
              </p>
            </div>
          </div>

          {/* MENU */}
          <div className="space-y-3">

            {menus.map((menu, index) => (

              <Link
                key={index}
                to={menu.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold
                  
                  ${
                    location.pathname === menu.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-slate-800"
                  }
                `}
              >

                {menu.icon}

                <span>{menu.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* PROFILE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">

          <div className="flex items-center gap-4">

            <img
              src="https://i.pravatar.cc/100"
              alt=""
              className="w-14 h-14 rounded-2xl object-cover"
            />

            <div>
              <h3 className="font-bold">
                Administrator
              </h3>

              <p className="text-gray-400 text-sm">
                admin@company.com
              </p>
            </div>
          </div>

          <button className="mt-5 w-full bg-red-500 hover:bg-red-600 transition py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 lg:p-10 overflow-hidden">

        {/* TOPBAR */}
        <div className="bg-white rounded-[30px] p-6 shadow-sm mb-8 flex justify-between items-center">

          <div>

            <p className="text-gray-500 text-sm">
              Sistem Informasi Pegawai
            </p>

            <h2 className="text-3xl font-black mt-1">
              Dashboard Perusahaan
            </h2>
          </div>

          <div className="flex items-center gap-4">

            <div className="text-right hidden md:block">

              <h3 className="font-bold">
                Administrator
              </h3>

              <p className="text-gray-500 text-sm">
                Online
              </p>
            </div>

            <img
              src="https://i.pravatar.cc/100"
              alt=""
              className="w-14 h-14 rounded-2xl"
            />
          </div>
        </div>

        {/* PAGE */}
        {children}
      </main>
    </div>
  );
}