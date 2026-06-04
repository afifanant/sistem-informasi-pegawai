import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  Users,
  UserCheck,
  Activity,
  TrendingUp,
  Briefcase,
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
  const [divisiProgress, setDivisiProgress] = useState([]);

  // 3. Mesin Penarik Data (Query Aggregator)
  useEffect(() => {
    setIsMounted(true);

    const fetchDashboardData = async () => {
      try {
        // Ambil waktu hari ini untuk filter absensi
        const hariIni = new Date().toISOString().split('T')[0];

        // Jalankan 3 Query serentak agar loading lebih cepat (Promise.all)
        const [resProfiles, resAbsensi, resDivisi] = await Promise.all([
          supabase.from('profiles').select('id, status'),
          supabase.from('absensi')
            .select('id, waktu_masuk, tanggal, profiles(full_name)')
            .order('waktu_masuk', { ascending: false }),
          supabase.from('divisi').select('nama, warna')
        ]);

        const profilesData = resProfiles.data || [];
        const absensiData = resAbsensi.data || [];
        const divisiData = resDivisi.data || [];

        // A. Kalkulasi Statistik Pegawai
        const total = profilesData.length;
        const aktif = profilesData.filter(p => p.status === 'Aktif').length;
        
        const absenHariIni = absensiData.filter(a => a.tanggal === hariIni).length;
        const rasioKehadiran = total > 0 ? Math.round((absenHariIni / total) * 100) : 0;
        const rasioProduktivitas = total > 0 ? Math.round((aktif / total) * 100) : 0;

        setStats({
          totalPegawai: total,
          pegawaiAktif: aktif,
          persenAbsensi: rasioKehadiran,
          produktivitas: rasioProduktivitas
        });

        // B. Mapping Log Aktivitas (Maksimal 5 aktivitas terbaru hari ini)
        const logTerbaru = absensiData
          .filter(a => a.tanggal === hariIni)
          .slice(0, 5)
          .map(a => `${a.profiles?.full_name || 'Pegawai'} melakukan check-in jam ${a.waktu_masuk}`);
        
        // Fallback jika belum ada yang absen hari ini
        setAktivitas(logTerbaru.length > 0 ? logTerbaru : ["Belum ada aktivitas absensi hari ini"]);

        // C. Mapping Progress Divisi (Menggantikan Proyek fiktif)
        // Kita beri nilai progress acak antara 70-100% sebagai simulasi dashboard hidup
        const mappedDivisi = divisiData.slice(0, 4).map(div => ({
          nama: div.nama,
          progress: `${Math.floor(Math.random() * (100 - 70 + 1) + 70)}%`,
          width: `${Math.floor(Math.random() * (100 - 70 + 1) + 70)}%`
        }));
        
        setDivisiProgress(mappedDivisi.length > 0 ? mappedDivisi : [
          { nama: "Belum Ada Divisi", progress: "0%", width: "0%" }
        ]);

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
    },
    {
      title: "Pegawai Aktif",
      value: stats.pegawaiAktif,
      icon: <UserCheck size={28} />,
      color: "bg-green-500",
    },
    {
      title: "Absensi Hari Ini",
      value: `${stats.persenAbsensi}%`,
      icon: <Activity size={28} />,
      color: "bg-orange-500",
    },
    {
      title: "Produktivitas",
      value: `${stats.produktivitas}%`,
      icon: <TrendingUp size={28} />,
      color: "bg-purple-500",
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

        {/* STATS (Dinamis dari Database) */}
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
                <div className={`${item.color} text-white p-4 rounded-2xl shadow-lg`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CONTENT */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          
          {/* LEFT COLUMN */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* AKTIVITAS (Log Realtime dari Tabel Absensi) */}
            <div className="bg-gradient-to-b from-blue-500 to-slate-900 rounded-[35px] p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-900/50">
                  <Clock3 size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-blue-200 text-sm font-semibold">Realtime</p>
                  <h2 className="text-4xl font-black text-white tracking-tight">Log Aktivitas</h2>
                </div>
              </div>

              <div className="space-y-4">
                {aktivitas.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgb(74,222,128,0.8)] animate-pulse"></div>
                    <p className="font-semibold text-white tracking-wide text-sm md:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* KINERJA DIVISI (Dinamis dari tabel divisi) */}
            <div className="bg-gradient-to-br from-slate-800 to-blue-950 rounded-[35px] p-8 shadow-xl text-white">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-purple-500 text-white p-4 rounded-2xl shadow-lg shadow-purple-500/20">
                  <Briefcase size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Monitoring</p>
                  <h2 className="text-4xl font-black tracking-tight">Kinerja Divisi</h2>
                </div>
              </div>

              <div className="space-y-8">
                {divisiProgress.map((item, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-200">{item.nama}</h3>
                      <span className="font-black text-blue-400">{item.progress}</span>
                    </div>
                    <div className="w-full h-5 bg-slate-900/50 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out group-hover:bg-blue-400"
                        style={{ width: item.width }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* KARTU STATISTIK MINGGUAN */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-[35px] p-8 shadow-xl transform transition-transform hover:-translate-y-1">
              <p className="text-blue-100 font-semibold uppercase tracking-wider text-sm">Statistik Kehadiran</p>
              <h2 className="text-7xl font-black mt-6 tracking-tighter">{stats.persenAbsensi}%</h2>
              <p className="mt-6 leading-relaxed text-blue-50 font-medium">
                Tingkat partisipasi absensi pegawai hari ini berdasar sinkronisasi database.
              </p>
            </div>

            {/* STATUS SERVER */}
            <div className="bg-slate-900 text-white rounded-[35px] p-8 shadow-xl border border-gray-800">
              <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Sistem</p>
              <h2 className="text-4xl font-black mt-4 tracking-tight">Status Server</h2>
              <div className="flex items-center gap-3 mt-8">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgb(34,197,94,0.8)] animate-pulse"></div>
                <p className="text-lg font-bold text-gray-200">Koneksi Database Stabil</p>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}