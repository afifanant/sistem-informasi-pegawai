import {
  LayoutDashboard,
  ClipboardCheck,
  Briefcase,
  User,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; // Sesuaikan jika path file jembatan lu berbeda

export default function SidebarPegawai() {
  const location = useLocation();
  const navigate = useNavigate();

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

  // FUNGSI EKSEKUTOR LOGOUT
  const handleLogout = async () => {
    try {
      // 1. Matikan sesi di backend Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      // 2. Tendang user ke halaman depan
      navigate("/");
      
    } catch (error) {
      console.error("Gagal logout:", error.message);
      alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
    }
  };

  return (
    <aside className="w-[290px] bg-[#0f172a] text-white min-h-screen flex flex-col justify-between p-7">
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-4 mb-14">
          <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black">PEGAWAI</h1>
            <p className="text-blue-200">Employee System</p>
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
                ${
                  active
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

      {/* PROFILE & LOGOUT */}
      <div className="bg-white/10 rounded-[30px] p-5">
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-lg">Pegawai</h3>
            <p className="text-green-200 text-sm">Staff Perusahaan</p>
          </div>
        </div>

        {/* TOMBOL LOGOUT TERHUBUNG */}
        <button 
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 active:scale-[0.98] transition-all py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}