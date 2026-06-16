import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  Users,
  UserCheck,
  Activity,
  TrendingUp,
  Clock3,
  Loader2
} from "lucide-react";

export default function DashboardAdmin() {
  // 1. State Animasi & Loading
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 2. State Penyimpanan Data Agregasi
  const [stats, setStats] = useState({
    totalPegawai: 0,
    pegawaiAktif: 0,
    persenAbsensi: 0,
    produktivitas: 0
  });
  const [aktivitas, setAktivitas] = useState([]);

  // 3. Mesin Penarik Data (Query Aggregator)
  useEffect(() => {
    setIsMounted(true);

    const fetchDashboardData = async () => {
      try {
        // Jalankan Query serentak agar loading lebih cepat
        const [resProfiles, resAbsensi] = await Promise.all([
          supabase.from('profiles').select('id, status'),
          supabase.from('absensi')
            .select('id, created_at, status, profiles(full_name)')
            .order('created_at', { ascending: false })
        ]);

        const profilesData = resProfiles.data || [];
        const absensiData = resAbsensi.data || [];

        // Penyesuaian waktu Hari Ini (Lokal Indonesia)
        const todayDateStr = new Date().toLocaleDateString('id-ID');
        
        // Filter absensi khusus hari ini berdasarkan created_at
        const absensiHariIni = absensiData.filter(a => {
          const absenDateStr = new Date(a.created_at).toLocaleDateString('id-ID');
          return absenDateStr === todayDateStr;
        });

        // A. Kalkulasi Statistik Pegawai
        const total = profilesData.length;
        const aktif = profilesData.filter(p => p.status === 'Aktif').length;
        
        const jumlahAbsenHariIni = absensiHariIni.length;
        const rasioKehadiran = total > 0 ? Math.round((jumlahAbsenHariIni / total) * 100) : 0;
        const rasioProduktivitas = total > 0 ? Math.round((aktif / total) * 100) : 0;

        setStats({
          totalPegawai: total,
          pegawaiAktif: aktif,
          persenAbsensi: rasioKehadiran,
          produktivitas: rasioProduktivitas
        });

        // B. Mapping Log Aktivitas Realtime (Berdasarkan status & waktu aktual)
        const logTerbaru = absensiHariIni
          .slice(0, 8) // Ditingkatkan menjadi 8 log agar layout tidak terlalu kosong
          .map(a => {
            const time = new Date(a.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const statusText = a.status ? a.status.toLowerCase() : "hadir";
            return `${a.profiles?.full_name || 'Tanpa Nama'} melakukan presensi ${statusText} pada ${time} WIB`;
          });
        
        // Fallback jika belum ada yang absen hari ini
        setAktivitas(logTerbaru.length > 0 ? logTerbaru : ["Belum ada aktivitas absensi hari ini."]);

      } catch (error) {
        console.error("Gagal sinkronisasi data admin:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Pegawai",
      value: stats.totalPegawai,
      icon: <Users size={28} />,
      color: "bg-blue-500",
      shadow: "shadow-blue-500/20"
    },
    {
      title: "Pegawai Aktif",
      value: stats.pegawaiAktif,
      icon: <UserCheck size={28} />,
      color: "bg-green-500",
      shadow: "shadow-green-500/20"
    },
    {
      title: "Absensi Hari Ini",
      value: `${stats.persenAbsensi}%`,
      icon: <Activity size={28} />,
      color: "bg-orange-500",
      shadow: "shadow-orange-500/20"
    },
    {
      title: "Produktivitas",
      value: `${stats.produktivitas}%`,
      icon: <TrendingUp size={28} />,
      color: "bg-purple-500",
      shadow: "shadow-purple-500/20"
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full min-h-screen text-slate-800">
          <Loader2 className="animate-spin text-blue-600 mr-3" size={30} /> 
          <span className="font-semibold text-lg">Mengkalkulasi Data Pusat...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={`transform transition-all duration-1000 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}>
        
        {/* HERO */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-[40px] p-10 text-white mb-8 overflow-hidden relative shadow-2xl">
          <div className="absolute w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl top-[-100px] right-[-100px] animate-pulse"></div>
          <div className="relative z-10">
            <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">
              Dashboard Perusahaan
            </p>
            <h1 className="text-5xl lg:text-7xl font-black mt-5 leading-tight tracking-tight">
              Sistem Informasi
              <br />
              Pegawai Modern
            </h1>
            <p className="text-blue-100 mt-6 max-w-[700px] text-lg leading-relaxed font-medium">
              Monitoring realtime pegawai, absensi digital, statistik perusahaan, dan aktivitas operasional dalam satu sistem komprehensif.
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[35px] p-8 shadow-md border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 font-medium">{item.title}</p>
                  <h2 className="text-5xl font-black mt-4 text-slate-800">{item.value}</h2>
                </div>
                <div className={`${item.color} text-white p-4 rounded-2xl shadow-lg ${item.shadow}`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CONTENT */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          
          {/* LEFT COLUMN: AKTIVITAS */}
          <div className="xl:col-span-2">
            <div className="bg-[#111827] rounded-[35px] p-8 shadow-xl border border-gray-800 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                  <Clock3 size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-blue-400 text-sm font-semibold">Realtime</p>
                  <h2 className="text-4xl font-black text-white tracking-tight">Log Aktivitas</h2>
                </div>
              </div>

              <div className="space-y-4">
                {aktivitas.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#1f2937] rounded-2xl p-5 flex items-center gap-4 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgb(74,222,128,0.8)] animate-pulse shrink-0"></div>
                    <p className="font-semibold text-gray-200 tracking-wide text-sm md:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: WIDGETS */}
          <div className="space-y-6">
            
            {/* KARTU STATISTIK MINGGUAN */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-[35px] p-8 shadow-xl transform transition-transform hover:-translate-y-1">
              <p className="text-blue-100 font-semibold uppercase tracking-wider text-sm">Statistik Kehadiran</p>
              <h2 className="text-7xl font-black mt-6 tracking-tighter">{stats.persenAbsensi}%</h2>
              <p className="mt-6 leading-relaxed text-blue-50 font-medium text-sm">
                Tingkat partisipasi absensi pegawai secara keseluruhan pada hari ini berdasarkan data real-time.
              </p>
            </div>

            {/* STATUS SERVER */}
            <div className="bg-[#111827] text-white rounded-[35px] p-8 shadow-xl border border-gray-800">
              <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Sistem</p>
              <h2 className="text-4xl font-black mt-4 tracking-tight">Status Server</h2>
              <div className="flex items-center gap-3 mt-8 bg-[#1f2937] p-5 rounded-2xl border border-gray-700">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgb(34,197,94,0.8)] animate-pulse"></div>
                <p className="text-lg font-bold text-gray-200">Koneksi Stabil</p>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}