import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/PimpinanLayout";
import {
  Users,
  UserCheck,
  UserX,
  MapPin,
  Loader2,
  Clock,
  RefreshCw
} from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function DashboardPimpinan() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State khusus untuk animasi tombol refresh
  const [stats, setStats] = useState({
    totalPegawai: 0,
    hadirHariIni: 0,
    izinHariIni: 0,
    persenKehadiran: 0,
  });
  const [absensiList, setAbsensiList] = useState([]);

  // Fungsi untuk mengambil data absensi terbaru beserta lokasi dan nama pegawai
  async function fetchAbsensiData() {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Ambil data count & list secara paralel
      const [
        { count: countPegawai },
        { count: countHadir },
        { count: countIzin },
        { data: dataAbsensiHariIni }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("absensi").select("*", { count: "exact", head: true }).eq("status", "Hadir").gte("created_at", `${today}T00:00:00`),
        supabase.from("absensi").select("*", { count: "exact", head: true }).eq("status", "Izin").gte("created_at", `${today}T00:00:00`),
        supabase
          .from("absensi")
          .select(`
            id,
            status,
            lokasi,
            created_at,
            profiles (
              nama,
              role,
              divisi
            )
          `)
          .gte("created_at", `${today}T00:00:00`)
          .order("created_at", { ascending: false })
      ]);

      const total = countPegawai || 0;
      const hadir = countHadir || 0;
      const izin = countIzin || 0;
      const persen = total > 0 ? Math.round((hadir / total) * 100) : 0;

      setStats({
        totalPegawai: total,
        hadirHariIni: hadir,
        izinHariIni: izin,
        persenKehadiran: persen,
      });

      setAbsensiList(dataAbsensiHariIni || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
    }
  }

  // Fungsi yang dipicu saat tombol Refresh diklik manual oleh Pimpinan
  async function handleRefresh() {
    setRefreshing(true);
    await fetchAbsensiData();
    setRefreshing(false);
  }

  useEffect(() => {
    async function initDashboard() {
      setLoading(true);
      await fetchAbsensiData();
      setLoading(false);
    }
    
    initDashboard();

    // Realtime subscription jika ada data absen masuk baru
    const channel = supabase
      .channel("live_absensi_pimpinan")
      .on("postgres", { event: "INSERT", schema: "public", table: "absensi" }, () => {
        fetchAbsensiData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const cardData = [
    { title: "Total Pegawai", value: stats.totalPegawai, icon: <Users size={26} />, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { title: "Hadir Hari Ini", value: stats.hadirHariIni, icon: <UserCheck size={26} />, color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { title: "Izin / Sakit", value: stats.izinHariIni, icon: <UserX size={26} />, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    { title: "Rasio Kehadiran", value: `${stats.persenKehadiran}%`, icon: <Clock size={26} />, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" }, 
  ];

  return (
    <DashboardLayout role="pimpinan">
      <div className="space-y-8 bg-[#0b0f19] min-h-screen p-2 text-slate-100">
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#1e1b4b] rounded-[35px] p-10 text-white shadow-2xl relative overflow-hidden border border-blue-900/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-25"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div>
              <p className="uppercase tracking-[6px] text-blue-300 text-xs font-bold">Pimpinan Live Monitor</p>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight mt-2 tracking-tight">
                Status Kehadiran & <br /> Lokasi Absensi Pegawai
              </h1>
            </div>
            
            {/* TOMBOL REFRESH AKTIF */}
            <button 
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-50 border border-white/20 px-5 py-3 rounded-2xl transition-all flex items-center gap-2 text-sm font-semibold cursor-pointer shadow-lg"
            >
              <RefreshCw size={16} className={refreshing || loading ? "animate-spin" : ""} />
              {refreshing ? "Memperbarui..." : "Refresh Data"}
            </button>
          </div>
        </div>

        {/* CARDS KONTROL UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-6">
              <Loader2 className="animate-spin text-blue-500" size={36} />
            </div>
          ) : (
            cardData.map((item, index) => (
              <div key={index} className="bg-[#111827] border border-gray-800/80 rounded-3xl p-6 shadow-xl">
                <p className="text-gray-400 font-semibold text-xs tracking-wide uppercase">{item.title}</p>
                <div className="flex justify-between items-center mt-4">
                  <h2 className="text-4xl font-black text-white tracking-tight">{item.value}</h2>
                  <div className={`${item.color} p-3.5 rounded-2xl border`}>{item.icon}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MONITORING LOKASI DAN STATUS ABSENSI */}
        <div className="bg-[#111827] border border-gray-800 rounded-[35px] p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/10 text-emerald-500 p-3.5 rounded-2xl border border-emerald-500/20">
                <MapPin size={24} />
              </div>
              <div>
                <p className="uppercase tracking-[3px] text-gray-500 text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Terkoneksi Ke GPS
                </p>
                <h2 className="text-2xl font-black text-white mt-0.5">Lokasi Real-time Presensi Pegawai</h2>
              </div>
            </div>
          </div>

          {/* TABEL LOKASI ABSENSI */}
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-600" /></div>
          ) : absensiList.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl bg-[#1f2937]/10">
              <p className="text-gray-500 text-sm">Belum ada pegawai yang melakukan absensi hari ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="pb-4 font-bold">Nama Pegawai</th>
                    <th className="pb-4 font-bold">Divisi / Peran</th>
                    <th className="pb-4 font-bold">Jam Absen</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold"><span className="flex items-center gap-1"><MapPin size={12}/> Lokasi / Koordinat</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50 text-sm">
                  {absensiList.map((item) => {
                    const namaUser = item.profiles?.nama || "Tidak Diketahui";
                    const divisiUser = item.profiles?.divisi || "Umum";
                    const roleUser = item.profiles?.role || "Staf";
                    
                    return (
                      <tr key={item.id} className="hover:bg-[#1f2937]/20 transition-colors">
                        <td className="py-4 font-bold text-slate-200">{namaUser}</td>
                        <td className="py-4 text-slate-400 text-xs">
                          <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded font-mono mr-2">{divisiUser}</span>
                          <span className="text-gray-500 capitalize">{roleUser}</span>
                        </td>
                        <td className="py-4 text-slate-300 font-mono text-xs">
                          {item.created_at ? new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"} WIB
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                            item.status === "Hadir" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-xs max-w-xs truncate">
                          {item.lokasi ? (
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.lokasi)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
                              title="Klik untuk lihat rute di Google Maps"
                            >
                              {item.lokasi}
                            </a>
                          ) : (
                            <span className="text-gray-600">Lokasi tidak terekam</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}