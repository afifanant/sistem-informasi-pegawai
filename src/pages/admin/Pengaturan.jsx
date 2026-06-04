import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  Settings,
  Shield,
  Bell,
  Moon,
  Lock,
  User,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function Pengaturan() {
  // 1. State Animasi & UI
  const [isMounted, setIsMounted] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // Menyimpan ID modal yang sedang terbuka
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 2. State untuk Form Keamanan (Ubah Password)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 3. State untuk Form Profile Perusahaan (Simulasi)
  const [companyForm, setCompanyForm] = useState({
    nama: "SIMPEG Corporation",
    email: "admin@simpeg.com",
    alamat: "Jl. Teknologi No. 1, Jakarta"
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // FUNGSI NYATA: Mengubah Password Admin via Supabase
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword.length < 6) {
      return setMessage({ type: "error", text: "Password baru minimal 6 karakter." });
    }
    if (newPassword !== confirmPassword) {
      return setMessage({ type: "error", text: "Konfirmasi password tidak cocok!" });
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Keamanan Akun: Password berhasil diperbarui!" });
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setActiveModal(null), 2000); // Tutup modal setelah 2 detik
    } catch (error) {
      setMessage({ type: "error", text: "Gagal update password: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI SIMULASI: Update Profile Perusahaan
  const handleUpdateCompany = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi delay jaringan (Nantinya ini diganti dengan script UPDATE ke tabel company_settings)
    setTimeout(() => {
      setMessage({ type: "success", text: "Profil Perusahaan berhasil disimpan di sistem." });
      setLoading(false);
      setTimeout(() => setActiveModal(null), 2000);
    }, 1000);
  };

  // Konfigurasi Menu Pengaturan
  const menuSettings = [
    {
      id: "profil",
      title: "Profile Perusahaan",
      desc: "Kelola identitas, nama, dan alamat perusahaan",
      icon: <User size={28} />,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "keamanan",
      title: "Keamanan Akun",
      desc: "Ganti password dan amankan akses Admin",
      icon: <Shield size={28} />,
      color: "from-red-500 to-rose-600"
    },
    {
      id: "notifikasi",
      title: "Notifikasi",
      desc: "Pengaturan notifikasi peringatan realtime (Segera Hadir)",
      icon: <Bell size={28} />,
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "tema",
      title: "Tema & UI",
      desc: "Pengaturan Dark Mode dan visual (Segera Hadir)",
      icon: <Moon size={28} />,
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: "privasi",
      title: "Privasi Sistem",
      desc: "Kelola enkripsi dan visibilitas data (Segera Hadir)",
      icon: <Lock size={28} />,
      color: "from-emerald-500 to-green-600"
    },
    {
      id: "general",
      title: "General Settings",
      desc: "Konfigurasi zona waktu dan format (Segera Hadir)",
      icon: <Settings size={28} />,
      color: "from-slate-500 to-gray-600"
    },
  ];

  return (
    <DashboardLayout>
      <div className={`transform transition-all duration-1000 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}>
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
          
          <div className="relative z-10">
            <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">
              System Settings
            </p>
            <h1 className="text-5xl font-black mt-4 tracking-tight">
              Pengaturan Sistem
            </h1>
            <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
              Pusat kendali aplikasi. Kelola identitas perusahaan, perbarui keamanan akun, dan sesuaikan preferensi operasional.
            </p>
          </div>
        </div>

        {/* FEEDBACK BANNER (Global) */}
        {message.text && (
          <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 animate-[fadeIn_0.5s_ease-out] ${
            message.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={22} className="flex-shrink-0" /> : <AlertCircle size={22} className="flex-shrink-0" />}
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        {/* SETTINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {menuSettings.map((item) => (
            <div
              key={item.id}
              className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 hover:border-blue-500 transition-all group shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h2 className="text-2xl font-black mt-6 tracking-tight group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-gray-400 mt-3 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <button 
                onClick={() => {
                  setMessage({type: "", text: ""});
                  setActiveModal(item.id);
                }}
                className="mt-8 w-full bg-[#1f2937] hover:bg-blue-600 border border-gray-700 hover:border-blue-500 py-4 rounded-2xl font-bold transition-all shadow-sm group-hover:shadow-blue-500/20 active:scale-95"
              >
                Kelola Pengaturan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODALS SECTION ================= */}

      {/* 1. MODAL KEAMANAN AKUN (PASSWORD) - FULLY FUNCTIONAL */}
      {activeModal === "keamanan" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111827] w-full max-w-lg rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-5">
              <div className="bg-red-500/20 text-red-500 p-3 rounded-xl border border-red-500/20">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black">Keamanan Akun</h2>
                <p className="text-gray-400 text-sm mt-1">Perbarui password akses Admin.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 font-medium mb-2 block">Password Baru</label>
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-red-500 transition-colors"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium mb-2 block">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  placeholder="Ketik ulang password baru"
                  className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-red-500 transition-colors"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 py-4 rounded-2xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex justify-center items-center">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL PROFILE PERUSAHAAN - UI MOCKUP */}
      {activeModal === "profil" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111827] w-full max-w-lg rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-5">
              <div className="bg-blue-500/20 text-blue-400 p-3 rounded-xl border border-blue-500/20">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black">Profil Perusahaan</h2>
                <p className="text-gray-400 text-sm mt-1">Identitas resmi perusahaan.</p>
              </div>
            </div>

            <form onSubmit={handleUpdateCompany} className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 font-medium mb-2 block">Nama Perusahaan</label>
                <input
                  type="text"
                  className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors"
                  value={companyForm.nama}
                  onChange={(e) => setForm({ ...companyForm, nama: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium mb-2 block">Email Perusahaan</label>
                <input
                  type="email"
                  className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors"
                  value={companyForm.email}
                  onChange={(e) => setForm({ ...companyForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium mb-2 block">Alamat Pusat</label>
                <textarea
                  className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors min-h-[100px]"
                  value={companyForm.alamat}
                  onChange={(e) => setForm({ ...companyForm, alamat: e.target.value })}
                />
              </div>

              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 py-4 rounded-2xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center items-center">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Simpan Profil"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL FALLBACK UNTUK FITUR YANG BELUM SELESAI */}
      {["notifikasi", "tema", "privasi", "general"].includes(activeModal) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111827] w-full max-w-sm rounded-[35px] p-10 text-white border border-gray-800 text-center shadow-2xl">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings size={35} className="text-gray-400 animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-black mb-3">Under Construction</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Fitur pengaturan ini sedang dalam tahap pengembangan dan akan tersedia pada update sistem berikutnya.
            </p>
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full bg-gray-700 hover:bg-gray-600 py-4 rounded-2xl font-bold transition-colors"
            >
              Tutup Jendela
            </button>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}