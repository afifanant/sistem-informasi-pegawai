import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // IMPORT INI DITAMBAHKAN
import PegawaiLayout from "../../layouts/PegawaiLayout";
import { supabase } from "../../supabaseClient"; 
import {
  User,
  CalendarCheck,
  Clock3,
  Bell,
  Loader2
} from "lucide-react";

export default function DashboardPegawai() {
  // 1. State Animasi & Loading
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 2. State Data Dinamis
  const [profile, setProfile] = useState({ name: "Memuat...", email: "" });
  const [aktivitas, setAktivitas] = useState([]);

  // 3. Menarik Data dari Supabase (Hanya Profil & Absensi)
  useEffect(() => {
    setIsMounted(true);

    const getDashboardData = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (user) {
          // Set Profil
          setProfile({
            name: user.user_metadata?.full_name || user.email.split("@")[0],
            email: user.email
          });

          // Ambil Data Absensi
          const { data: dataAbsensi } = await supabase
            .from("absensi")
            .select("*")
            .eq('user_id', user.id)
            .order('tanggal', { ascending: false })
            .limit(5); // Ambil 5 absensi terakhir

          if (dataAbsensi) setAktivitas(dataAbsensi);
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  const totalKehadiran = aktivitas.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-blue-500 mr-3" size={30} />
        <p className="text-lg font-semibold tracking-wide">Menyiapkan Workspace...</p>
      </div>
    );
  }

  return (
    <PegawaiLayout>
      <div className={`transform transition-all duration-1000 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}>
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-[35px] p-10 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
          
          <div className="relative z-10">
            <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">Employee Dashboard</p>
            <h1 className="text-5xl font-black mt-4 tracking-tight">Selamat Datang, {profile.name} 👋</h1>
            <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
              Pantau absensi dan log aktivitas kerja Anda secara realtime dari database perusahaan.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          
          {/* KEHADIRAN */}
          <div className="bg-[#111827] rounded-[30px] p-8 text-white border border-gray-800 transition-all hover:border-green-500/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Kehadiran</p>
                <h2 className="text-5xl font-black mt-3">{totalKehadiran} <span className="text-xl text-gray-500">Log</span></h2>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
                <CalendarCheck size={28} />
              </div>
            </div>
          </div>

          {/* PROFILE CARD */}
          <div className="bg-[#111827] rounded-[30px] p-8 text-white border border-gray-800 flex items-center justify-between transition-all hover:border-blue-500/30">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
                <User size={35} />
              </div>
              <div>
                <h2 className="text-2xl font-black">{profile.name}</h2>
                <p className="text-gray-400 mt-1">{profile.email}</p>
              </div>
            </div>
            {/* TOMBOL EDIT PROFILE DIUBAH MENJADI LINK */}
            <Link 
              to="/pegawai/profile" 
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-bold transition-all text-white"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* AKTIVITAS (Log Asli dari Absensi) */}
        <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white border border-gray-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
              <Bell size={28} />
            </div>
            <div>
              <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Activity</p>
              <h2 className="text-4xl font-black tracking-tight">Log Absensi Terakhir</h2>
            </div>
          </div>

          <div className="space-y-4">
            {aktivitas.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Belum ada aktivitas absensi tercatat.</p>
            ) : (
              aktivitas.map((log) => (
                <div key={log.id} className="bg-[#1f2937] p-6 rounded-2xl border border-gray-700 transition-colors hover:border-green-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgb(74,222,128,0.8)]"></div>
                    <div>
                      <p className="font-semibold text-md">Absen Masuk: {log.waktu_masuk || "Tercatat"}</p>
                      <p className="text-gray-400 text-xs mt-1 flex items-center gap-2">
                        <Clock3 size={14} /> {log.tanggal}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </PegawaiLayout>
  );
}