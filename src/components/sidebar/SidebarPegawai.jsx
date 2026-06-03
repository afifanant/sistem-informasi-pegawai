import {
  LayoutDashboard,
  ClipboardCheck,
  Briefcase,
  User,
  LogOut,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function SidebarPegawai() {

  const location = useLocation();

  const menus = [
    {
      title: "Dashboard",
      path: "/pegawai",
      icon: <LayoutDashboard size={22} />,
    },

    {
      title: "Absensi Saya",
      path: "/pegawai/absensi",
      icon: <ClipboardCheck size={22} />,
    },

    {
      title: "Tugas Saya",
      path: "/pegawai/tugas",
      icon: <Briefcase size={22} />,
    },

    {
  title: "Profile Saya",
  path: "/pegawai/profile",
  icon: <User size={22} />,
},
  ];

  return (
    <aside className="w-[290px] bg-[#0f172a] text-white min-h-screen flex flex-col justify-between p-7">

      <div>

        {/* LOGO */}
        <div className="flex items-center gap-4 mb-14">

          <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center">

            <User size={32} />
          </div>

          <div>

            <h1 className="text-4xl font-black">
              PEGAWAI
            </h1>

            <p className="text-blue-200">
              Employee System
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
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all

                ${active
                    ? "bg-blue-600"
                    : "hover:bg-white/10 text-gray-300"
                  }
                `}
              >

                {menu.icon}

                {menu.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* PROFILE */}
      <div className="bg-white/10 rounded-[30px] p-5">

        <div className="flex items-center gap-4">

          <img
            src="https://i.pravatar.cc/100?img=12"
            alt=""
            className="w-14 h-14 rounded-full"
          />

          <div>

            <h3 className="font-bold text-lg">
              Pegawai
            </h3>

            <p className="text-green-200 text-sm">
              Staff Perusahaan
            </p>
          </div>
        </div>

        <button className="mt-6 w-full bg-red-500 hover:bg-red-600 transition py-3 rounded-2xl font-bold flex items-center justify-center gap-2">

          <LogOut size={20} />

          Logout
        </button>
      </div>
    </aside>
  );
}