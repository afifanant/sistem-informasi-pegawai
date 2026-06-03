import DashboardLayout from "../../layouts/AdminLayout";

import {
  Settings,
  Shield,
  Bell,
  Moon,
  Lock,
  User,
} from "lucide-react";

export default function Pengaturan() {

  return (
    <DashboardLayout>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          System Settings
        </p>

        <h1 className="text-5xl font-black mt-4">
          Pengaturan Sistem
        </h1>

        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Kelola pengaturan perusahaan dan keamanan sistem.
        </p>
      </div>

      {/* SETTINGS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

        {[
          {
            title: "Profile Perusahaan",
            desc: "Kelola identitas perusahaan",
            icon: <User size={28} />,
          },
          {
            title: "Keamanan Akun",
            desc: "Password dan keamanan login",
            icon: <Shield size={28} />,
          },
          {
            title: "Notifikasi",
            desc: "Pengaturan notifikasi realtime",
            icon: <Bell size={28} />,
          },
          {
            title: "Dark Mode",
            desc: "Tema dashboard perusahaan",
            icon: <Moon size={28} />,
          },
          {
            title: "Privasi Sistem",
            desc: "Kelola keamanan data perusahaan",
            icon: <Lock size={28} />,
          },
          {
            title: "General Settings",
            desc: "Konfigurasi aplikasi perusahaan",
            icon: <Settings size={28} />,
          },
        ].map((item, index) => (

          <div
            key={index}
            className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 hover:border-blue-500 transition-all"
          >

            <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center">

              {item.icon}
            </div>

            <h2 className="text-3xl font-black mt-6">
              {item.title}
            </h2>

            <p className="text-gray-400 mt-4 leading-relaxed">
              {item.desc}
            </p>

            <button className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-bold transition">
              Kelola
            </button>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}