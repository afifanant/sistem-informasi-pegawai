import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/PimpinanLayout";
import {
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Bell,
  Loader2,
  Clock
} from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function DashboardPimpinan() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPegawai: 0,
    tugasAktif: 0,
    produktivitas: 0,
    kehadiran: 0,
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];

        // 1. Tarik Data Kalkulasi (Paralel untuk performa)
        const [
          { count: pegawai },
          { count: tugasTotal },
          { count: tugasSelesai },
          { count: tugasAktif },
          { count: hadirHariIni }
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "pegawai"),
          supabase.from("tugas").select("*", { count: "exact", head: true }),
          supabase.from("tugas").select("*", { count: "exact", head: true }).eq("status", "Selesai"),
          supabase.from("tugas").select("*", { count: "exact", head: true }).in("status", ["Progress", "Pending", "aktif"]),
          supabase.from("absensi").select("*", { count: "exact", head: true }).eq("status", "Hadir").gte("created_at", `${today}T00:00:00`)
        ]);

        // 2. Tarik Daftar Aktivitas Terakhir
        const { data: actData } = await supabase
          .from("aktivitas")
          .select("id, deskripsi, created_at, profiles(nama)")
          .order("created_at", { ascending: false })
          .limit(4);

        // Kalkulasi Logika Bisnis
        const calcProduktivitas = tugasTotal ? Math.round((tugasSelesai / tugasTotal) * 100) : 0;
        const calcKehadiran = pegawai ? Math.round((hadirHariIni / pegawai) * 100) : 0;

        setStats({
          totalPegawai: pegawai || 0,
          tugasAktif: tugasAktif || 0,
          produktivitas: calcProduktivitas,
          kehadiran: calcKehadiran,
        });

        setActivities(actData || []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // ENGINE REAL-TIME: Pantau tabel aktivitas agar feed di kanan hidup
    const channel = supabase
      .channel('pimpinan_dashboard_channel')
      .on('postgres', { event: 'INSERT', schema: 'public', table: 'aktivitas' }, (payload) => {
        // Tambahkan aktivitas baru ke posisi paling atas, buang yang paling bawah
        setActivities((prev) => [payload.new, ...prev].slice(0, 4));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const cardData = [
    { title: "Total Pegawai", value: stats.totalPegawai, icon: <Users size={28} />, color: "bg-yellow-500/20 text-yellow-400" },
    { title: "Tugas Aktif", value: stats.tugasAktif, icon: <Briefcase size={28} />, color: "bg-blue-500/20 text-blue-400" },
    { title: "Produktivitas", value: `${stats.produktivitas}%`, icon: <TrendingUp size={28} />, color: "bg-green-500/20 text-green-400" },
    // Efisiensi masih hardcode karena butuh data finansial yang mungkin belum lu buat
    { title: "Efisiensi", value: "Tinggi", icon: <DollarSign size={28} />, color: "bg-orange-500/20 text-orange-400" }, 
  ];

  return (
    <DashboardLayout role="pimpinan">
      {/* HERO */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#0f172a] rounded-[35px] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
        <p className="uppercase tracking-[6px] text-blue-200 text-sm">Dashboard</p>
        <h1 className="text-6xl font-black leading-tight mt-4">
          Monitoring <br /> Pegawai Proyek
        </h1>
        <p className="text-blue-100 mt-6 max-w-2xl leading-relaxed">
          Dashboard manajemen strategis. Memantau performa, data realtime, dan efisiensi operasional secara langsung.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {loading ? (
          <div className="col-span-4 flex justify-center py-10"><Loader2 className="animate-spin text-blue-400" size={40} /></div>
        ) : (
          cardData.map((item, index) => (
            <div key={index} className="bg-[#111827] border border-gray-800 rounded-3xl p-7 hover:border-blue-500/50 transition-colors shadow-lg">
              <p className="text-gray-400 font-medium">{item.title}</p>
              <div className="flex justify-between items-center mt-5">
                <h2 className="text-5xl font-black text-white tracking-tight">{item.value}</h2>
                <div className={`${item.color} p-4 rounded-2xl shadow-inner`}>{item.icon}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CONTENT BAWAH */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        
        {/* LEFT (Statistik Bar Pegawai) */}
        <div className="xl:col-span-2 bg-[#0f172a] border border-gray-800 rounded-[35px] p-8 shadow-xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="uppercase tracking-[4px] text-gray-500 text-sm font-semibold">Monitoring</p>
              <h2 className="text-4xl font-black text-white mt-2">Statistik Kinerja</h2>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { nama: "Kehadiran Pegawai (Hari Ini)", value: stats.kehadiran, color: "from-blue-500 to-cyan-400" },
              { nama: "Produktivitas Keseluruhan", value: stats.produktivitas, color: "from-green-500 to-emerald-400" },
            ].map((item, index) => (
              <div key={index} className="bg-[#111827] border border-gray-800 p-6 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">{item.nama}</h3>
                  <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl font-black">
                    {item.value}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT (Live Aktivitas) */}
        <div className="bg-black rounded-[35px] border border-gray-800 p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-yellow-500/20 text-yellow-500 p-4 rounded-2xl border border-yellow-500/30">
              <Bell size={28} />
            </div>
            <div>
              <p className="uppercase tracking-[4px] text-gray-500 text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> Realtime
              </p>
              <h2 className="text-4xl font-black text-white mt-1">Aktivitas</h2>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
               <div className="flex justify-center py-5"><Loader2 className="animate-spin text-gray-500" /></div>
            ) : activities.length === 0 ? (
               <p className="text-gray-500 text-center py-5">Belum ada log aktivitas.</p>
            ) : (
              activities.map((item, index) => (
                <div key={item.id || index} className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:bg-[#1f2937] transition-colors">
                  <p className="font-bold text-white leading-snug">
                    {/* Tampilkan nama pegawai jika ada relasinya, kalau tidak tampilkan deskripsi saja */}
                    {item.profiles?.nama ? `${item.profiles.nama} - ` : ""}{item.deskripsi}
                  </p>
                  <p className="text-gray-500 text-xs mt-3 flex items-center gap-2">
                    <Clock size={12} /> {item.created_at ? new Date(item.created_at).toLocaleTimeString('id-ID') : "Baru saja"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}