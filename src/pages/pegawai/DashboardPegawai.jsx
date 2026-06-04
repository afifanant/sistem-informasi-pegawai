import { useState, useEffect } from "react";
import PegawaiLayout from "../../layouts/PegawaiLayout";
import { supabase } from "../../supabaseClient"; 

import {
  User,
  Briefcase,
  CalendarCheck,
  Clock3,
  TrendingUp,
  CheckCircle2,
  Bell,
  Target,
  Loader2
} from "lucide-react";

export default function DashboardPegawai() {
  // 1. State Animasi & Loading
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 2. State Data Dinamis
  const [profile, setProfile] = useState({ name: "Memuat...", email: "" });
  const [tugas, setTugas] = useState([]);
  const [aktivitas, setAktivitas] = useState([]);

  // 3. Menarik Seluruh Data Relasional
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

          // Ambil Data Tugas (Untuk Kalkulasi Produktivitas & List)
          const { data: dataTugas } = await supabase
            .from("tugas")
            .select("*")
            .order('id', { ascending: false })
            .limit(5); // Ambil 5 tugas terbaru

          if (dataTugas) setTugas(dataTugas);

          // Ambil Data Absensi (Untuk Log Aktivitas & Kehadiran)
          const { data: dataAbsensi } = await supabase
            .from("absensi")
            .select("*")
            .eq('user_id', user.id)
            .order('tanggal', { ascending: false })
            .limit(3); // Ambil 3 absensi terakhir sebagai log aktivitas

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

  // 4. Kalkulasi Metrik (Computed Variables)
  const totalTugas = tugas.length;
  const tugasSelesai = tugas.filter(item => item.status === "Selesai").length;
  const produktivitas = totalTugas === 0 ? 0 : Math.round((tugasSelesai / totalTugas) * 100);
  const totalKehadiran = aktivitas.filter(item => item.status === "Hadir").length;

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
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 transition-transform duration-1000 group-hover:translate-x-10"></div>
          
          <div className="relative z-10">
            <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">Employee Dashboard</p>
            <h1 className="text-5xl font-black mt-4 tracking-tight">Selamat Datang, {profile.name} 👋</h1>
            <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
              Pantau pekerjaan, absensi, dan progress kerja Anda secara realtime dari database perusahaan.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          
          {/* KEHADIRAN (Dinilai dari record absensi) */}
          <div className="bg-[#111827] rounded-[30px] p-7 text-white transition-all duration-300 hover:shadow-green-500/10 border border-transparent hover:border-gray-800 hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Log Kehadiran</p>
                <h2 className="text-5xl font-black mt-3">{totalKehadiran} <span className="text-xl text-gray-500">Hari</span></h2>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
                <CalendarCheck size={28} />
              </div>
            </div>
          </div>

          {/* TOTAL TUGAS */}
          <div className="bg-[#111827] rounded-[30px] p-7 text-white transition-all duration-300 hover:shadow-blue-500/10 border border-transparent hover:border-gray-800 hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Tugas Aktif</p>
                <h2 className="text-5xl font-black mt-3">{totalTugas}</h2>
              </div>
              <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <Briefcase size={28} />
              </div>
            </div>
          </div>

          {/* PRODUKTIVITAS (Dihitung dari persentase tugas selesai) */}
          <div className="bg-[#111827] rounded-[30px] p-7 text-white transition-all duration-300 hover:shadow-purple-500/10 border border-transparent hover:border-gray-800 hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Produktivitas</p>
                <h2 className="text-5xl font-black mt-3">{produktivitas}%</h2>
              </div>
              <div className="bg-purple-500 p-4 rounded-2xl shadow-lg shadow-purple-500/20">
                <TrendingUp size={28} />
              </div>
            </div>
          </div>

          {/* TARGET */}
          <div className="bg-[#111827] rounded-[30px] p-7 text-white transition-all duration-300 hover:shadow-cyan-500/10 border border-transparent hover:border-gray-800 hover:-translate-y-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Kinerja Ideal</p>
                <h2 className="text-5xl font-black mt-3">100%</h2>
              </div>
              <div className="bg-cyan-500 p-4 rounded-2xl shadow-lg shadow-cyan-500/20">
                <Target size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          
          {/* LEFT COLUMN */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* TUGAS TERBARU (Data Asli) */}
            <div className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 p-4 rounded-2xl">
                  <Briefcase size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">My Task</p>
                  <h2 className="text-4xl font-black tracking-tight">Tugas Terbaru</h2>
                </div>
              </div>

              <div className="space-y-4">
                {tugas.length === 0 ? (
                   <p className="text-gray-500 text-center py-6">Belum ada tugas yang diberikan.</p>
                ) : (
                  tugas.map((item, index) => (
                    <div key={index} className="bg-[#1f2937] rounded-2xl p-6 border border-gray-700 transition-colors hover:border-blue-500/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <p className="text-gray-400 mt-2 text-sm flex items-center gap-2">
                            <Clock3 size={14} className="text-blue-500" /> Deadline: {item.deadline}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                            item.status === "Selesai"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : item.status === "Progress"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PROGRESS KINERJA */}
            <div className="bg-gradient-to-br from-blue-700 to-slate-900 rounded-[35px] p-8 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-blue-200 text-sm font-semibold">Performance</p>
                  <h2 className="text-4xl font-black tracking-tight">Status Pekerjaan</h2>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <h3 className="font-bold">Total Penyelesaian Tugas</h3>
                    <span className="font-black">{produktivitas}%</span>
                  </div>
                  <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-cyan-400 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${produktivitas}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* PROFILE CARD */}
            <div className="bg-[#111827] rounded-[35px] p-8 text-white text-center border border-gray-800 transition-all hover:border-gray-700">
              <div className="w-28 h-28 rounded-full bg-blue-600 mx-auto flex items-center justify-center shadow-inner">
                <User size={50} />
              </div>
              <h2 className="text-3xl font-black mt-6 tracking-tight">{profile.name}</h2>
              <p className="text-gray-400 mt-2 text-sm">{profile.email}</p>

              <button className="mt-8 bg-blue-600 hover:bg-blue-500 active:scale-95 w-full py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/20">
                Edit Profile
              </button>
            </div>

            {/* AKTIVITAS (Log Asli dari Absensi) */}
            <div className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
                  <Bell size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Activity</p>
                  <h2 className="text-4xl font-black tracking-tight">Log Terakhir</h2>
                </div>
              </div>

              <div className="space-y-4">
                {aktivitas.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">Belum ada aktivitas absensi tercatat.</p>
                ) : (
                  aktivitas.map((log) => (
                    <div key={log.id} className="bg-[#1f2937] p-5 rounded-2xl border border-gray-700 transition-colors hover:border-green-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgb(74,222,128,0.8)] animate-pulse"></div>
                        <p className="font-semibold text-sm">Absen Masuk: {log.waktu_masuk || "Tercatat"}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-gray-400 text-xs font-medium">
                        <Clock3 size={14} />
                        {log.tanggal}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PegawaiLayout>
  );
}