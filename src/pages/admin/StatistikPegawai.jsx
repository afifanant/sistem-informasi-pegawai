import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  Users,
  UserCheck,
  UserX,
  Briefcase,
  TrendingUp,
  Activity,
  Loader2
} from "lucide-react";

export default function StatistikPegawai() {
  // 1. State UI
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 2. State Data Dinamis
  const [stats, setStats] = useState({
    totalPegawai: 0,
    pegawaiAktif: 0,
    cuti: 0,
    totalDivisi: 0,
  });
  const [kehadiranPersen, setKehadiranPersen] = useState(0);
  const [aktivitasTerbaru, setAktivitasTerbaru] = useState([]);

  // 3. Mesin Penarik Data (Query Engine)
  useEffect(() => {
    setIsMounted(true);

    const fetchDashboardData = async () => {
      try {
        // Tarik data dari berbagai tabel secara paralel agar cepat
        const [resProfiles, resDivisi, resAbsensi] = await Promise.all([
          supabase.from('profiles').select('status'),
          supabase.from('divisi').select('id', { count: 'exact', head: true }),
          supabase.from('absensi').select('id, waktu_masuk, profiles(full_name)').order('waktu_masuk', { ascending: false }).limit(4)
        ]);

        const profiles = resProfiles.data || [];
        const absensi = resAbsensi.data || [];

        // Kalkulasi Statistik Pegawai
        const totalPeg = profiles.length;
        const aktif = profiles.filter(p => p.status === 'Aktif').length;
        const cuti = profiles.filter(p => p.status === 'Cuti').length;

        // Kalkulasi Persentase Kehadiran (Asumsi Sederhana: Jumlah absensi hari ini vs Total Pegawai)
        // Di sistem nyata yang lebih kompleks, ini butuh perhitungan rentang tanggal
        let persenHadir = 0;
        if (totalPeg > 0) {
          persenHadir = Math.round((aktif / totalPeg) * 100); 
        }

        setStats({
          totalPegawai: totalPeg,
          pegawaiAktif: aktif,
          cuti: cuti,
          totalDivisi: resDivisi.count || 0,
        });

        setKehadiranPersen(persenHadir);
        setAktivitasTerbaru(absensi);

      } catch (error) {
        console.error("Gagal memuat statistik:", error.message);
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
      icon: <Users size={30} />,
      color: "bg-blue-500",
    },
    {
      title: "Pegawai Aktif",
      value: stats.pegawaiAktif,
      icon: <UserCheck size={30} />,
      color: "bg-green-500",
    },
    {
      title: "Sedang Cuti",
      value: stats.cuti,
      icon: <UserX size={30} />,
      color: "bg-yellow-500",
    },
    {
      title: "Total Divisi",
      value: stats.totalDivisi,
      icon: <Briefcase size={30} />,
      color: "bg-purple-500",
    },
  ];

  const progress = [
    {
      nama: "Kapasitas SDM Terpenuhi",
      value: `${kehadiranPersen}%`,
      width: `${kehadiranPersen}%`,
    },
    {
      nama: "Tingkat Keaktifan Operasional",
      value: stats.totalPegawai > 0 ? "100%" : "0%", // Placeholder rasio aktif
      width: stats.totalPegawai > 0 ? "100%" : "0%",
    },
    {
      nama: "Kinerja Divisi",
      value: stats.totalDivisi > 0 ? "95%" : "0%", // Placeholder kinerja
      width: stats.totalDivisi > 0 ? "95%" : "0%",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full min-h-screen text-slate-800">
          <Loader2 className="animate-spin text-blue-600 mr-3" size={30} /> 
          <span className="font-semibold">Mengkalkulasi Statistik Database...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`p-8 bg-[#f5f7fb] min-h-screen transform transition-all duration-1000 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}>

        {/* HEADER */}
        <div className="mb-10">
          <p className="uppercase tracking-[4px] text-gray-500 text-sm font-semibold">
            Dashboard Utama
          </p>
          <h1 className="text-5xl font-black mt-2 text-slate-900 tracking-tight">
            Statistik Pegawai
          </h1>
          <p className="text-gray-500 mt-3">Ringkasan data analitik dari seluruh sistem perusahaan secara realtime.</p>
        </div>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[35px] p-8 shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 font-medium">
                    {item.title}
                  </p>
                  <h2 className="text-5xl font-black mt-4 text-slate-800">
                    {item.value}
                  </h2>
                </div>
                <div className={`${item.color} text-white p-4 rounded-2xl shadow-lg`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CONTENT */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* PROGRESS */}
          <div className="xl:col-span-2 bg-white rounded-[35px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-500 text-white p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <TrendingUp size={28} />
              </div>
              <div>
                <p className="uppercase tracking-[4px] text-gray-500 text-sm font-semibold">
                  Monitoring
                </p>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                  Progress Perusahaan
                </h2>
              </div>
            </div>

            <div className="space-y-8">
              {progress.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-bold text-lg text-slate-700">
                      {item.nama}
                    </h3>
                    <span className="font-black text-blue-600">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out group-hover:bg-blue-400"
                      style={{ width: item.width }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AKTIVITAS (Realtime dari Database) */}
          <div className="bg-[#111827] text-white rounded-[35px] p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
                <Activity size={28} />
              </div>
              <div>
                <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">
                  Realtime
                </p>
                <h2 className="text-4xl font-black tracking-tight">
                  Aktivitas
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {aktivitasTerbaru.length === 0 ? (
                <div className="text-center py-5 text-gray-500">Belum ada aktivitas terekam.</div>
              ) : (
                aktivitasTerbaru.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1f2937] p-5 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors"
                  >
                    <p className="font-semibold leading-relaxed text-sm">
                      <span className="text-blue-400">{item.profiles?.full_name || 'Seseorang'}</span> telah melakukan absen masuk.
                    </p>
                    <p className="text-gray-400 text-xs mt-2 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      {item.waktu_masuk}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CHART (Statis Placeholder - Membutuhkan Advanced SQL RPC untuk Dinamis) */}
        <section className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-100 mt-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-purple-500 text-white p-4 rounded-2xl shadow-lg shadow-purple-500/20">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="uppercase tracking-[4px] text-gray-500 text-sm font-semibold">
                Statistik Bulanan
              </p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Grafik Kehadiran
              </h2>
            </div>
          </div>

          {/* CHART BAR */}
          <div className="flex items-end gap-2 md:gap-6 h-[300px]">
            {[
              { bulan: "Jan", tinggi: "70%" },
              { bulan: "Feb", tinggi: "85%" },
              { bulan: "Mar", tinggi: "60%" },
              { bulan: "Apr", tinggi: "95%" },
              { bulan: "Mei", tinggi: "80%" },
              { bulan: "Jun", tinggi: "100%" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center group"
              >
                <div
                  className="w-full bg-blue-500 rounded-t-xl hover:bg-blue-400 transition-colors relative cursor-pointer"
                  style={{ height: item.tinggi }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-3 rounded-lg transition-opacity">
                    {item.tinggi}
                  </div>
                </div>
                <p className="mt-4 font-bold text-slate-600 text-sm md:text-base">
                  {item.bulan}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}