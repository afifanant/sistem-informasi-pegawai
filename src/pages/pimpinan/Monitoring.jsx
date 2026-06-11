import { useState, useEffect } from "react";
import PimpinanLayout from "../../layouts/PimpinanLayout";
import {
  Activity,
  Users,
  Clock3,
  TrendingUp,
  Bell,
  Loader2,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function Monitoring() {
  const [loading, setLoading] = useState(true);
  
  // State untuk Data
  const [stats, setStats] = useState({ online: 0, aktivitas: 0, kehadiran: "0%", produktivitas: "0%" });
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fungsi untuk memuat data awal
    async function fetchInitialData() {
      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0]; // Ambil tanggal hari ini (YYYY-MM-DD)

        // 1. Fetch Total Pegawai (untuk hitung persentase)
        const { count: totalPegawai } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "pegawai");

        // 2. Fetch Absensi Hari Ini (Hadir)
        const { count: online } = await supabase
          .from("absensi")
          .select("*", { count: "exact", head: true })
          .eq("status", "Hadir")
          .gte("created_at", `${today}T00:00:00`);

        // 3. Fetch Total Aktivitas Hari Ini
        const { count: totalAktivitas } = await supabase
          .from("aktivitas")
          .select("*", { count: "exact", head: true })
          .gte("created_at", `${today}T00:00:00`);

        // 4. Fetch Tugas Selesai vs Total Tugas (Untuk Produktivitas)
        const { count: tugasSelesai } = await supabase.from("tugas").select("*", { count: "exact", head: true }).eq("status", "Selesai");
        const { count: tugasTotal } = await supabase.from("tugas").select("*", { count: "exact", head: true });

        // 5. Fetch Lists Terkini
        const { data: actData } = await supabase.from("aktivitas").select("*").limit(4).order("created_at", { ascending: false });
        const { data: alertData } = await supabase.from("notifikasi").select("*").limit(4).order("created_at", { ascending: false });

        // Hitung Persentase Real
        const persenKehadiran = totalPegawai ? Math.round((online / totalPegawai) * 100) : 0;
        const persenProduktivitas = tugasTotal ? Math.round((tugasSelesai / tugasTotal) * 100) : 0;

        setStats({
          online: online || 0,
          aktivitas: totalAktivitas || 0,
          kehadiran: `${persenKehadiran}%`,
          produktivitas: `${persenProduktivitas}%`
        });
        
        setActivities(actData || []);
        setAlerts(alertData || []);
        
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();

    // ==========================================
    // ENGINE REAL-TIME SUPABASE (Wajib Ada Untuk "Live")
    // ==========================================
    const channel = supabase
      .channel('live_monitoring_channel')
      // Pantau tabel aktivitas
      .on('postgres', { event: 'INSERT', schema: 'public', table: 'aktivitas' }, (payload) => {
        setActivities((prev) => [payload.new, ...prev].slice(0, 4)); // Tambah baru, buang yang paling lama
        setStats((prev) => ({ ...prev, aktivitas: prev.aktivitas + 1 })); // Update counter realtime
      })
      // Pantau tabel notifikasi
      .on('postgres', { event: 'INSERT', schema: 'public', table: 'notifikasi' }, (payload) => {
        setAlerts((prev) => [payload.new, ...prev].slice(0, 4));
      })
      // Pantau tabel absensi (jika ada yang absen, angka online naik otomatis)
      .on('postgres', { event: 'INSERT', schema: 'public', table: 'absensi' }, (payload) => {
        if (payload.new.status === 'Hadir') {
          setStats((prev) => ({ ...prev, online: prev.online + 1 }));
        }
      })
      .subscribe();

    // Cleanup subscription saat komponen ditutup agar tidak memory leak
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <PimpinanLayout>
      {loading ? (
        <div className="flex h-screen items-center justify-center text-white">
          <Loader2 className="animate-spin text-blue-500" size={50} />
        </div>
      ) : (
        <div className="p-8">
          {/* HERO */}
          <div className="bg-gradient-to-r from-blue-700 to-[#09152f] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-[100px] opacity-50 animate-pulse"></div>
            <p className="uppercase tracking-[8px] text-blue-200 text-sm mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              Live Monitoring
            </p>
            <h1 className="text-6xl font-black leading-tight">Monitoring <br /> Aktivitas Pegawai</h1>
            <p className="text-blue-100 mt-6 text-xl max-w-3xl">Pantau seluruh aktivitas realtime pegawai dan performa kerja perusahaan.</p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            {[
              { label: "Pegawai Online", val: stats.online, icon: <Users size={30} />, color: "text-green-400", bg: "bg-green-500/20" },
              { label: "Aktivitas Hari Ini", val: stats.aktivitas, icon: <Activity size={30} />, color: "text-blue-400", bg: "bg-blue-500/20" },
              { label: "Kehadiran", val: stats.kehadiran, icon: <Clock3 size={30} />, color: "text-orange-400", bg: "bg-orange-500/20" },
              { label: "Produktivitas", val: stats.produktivitas, icon: <TrendingUp size={30} />, color: "text-purple-400", bg: "bg-purple-500/20" },
            ].map((s, i) => (
              <div key={i} className="bg-[#09152f] rounded-3xl p-8 text-white border border-transparent hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400">{s.label}</p>
                    <h1 className="text-5xl font-black mt-4">{s.val}</h1>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl ${s.bg} flex items-center justify-center ${s.color}`}>
                    {s.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* LIVE ACTIVITY */}
            <div className="lg:col-span-2 bg-[#09152f] rounded-3xl p-8 text-white">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center"><Activity size={30} /></div>
                <div>
                  <p className="tracking-[6px] text-gray-400 text-sm uppercase">Realtime</p>
                  <h1 className="text-5xl font-black">Aktivitas Live</h1>
                </div>
              </div>
              <div className="space-y-5">
                {activities.length === 0 ? (
                  <p className="text-gray-500">Belum ada aktivitas hari ini.</p>
                ) : (
                  activities.map((item, index) => (
                    <div key={item.id || index} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between transition-all hover:bg-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgb(34,197,94)]"></div>
                        <div>
                          <h1 className="font-bold text-lg">{item.deskripsi || item.nama_aktivitas}</h1>
                          <p className="text-gray-400 text-sm">{new Date(item.created_at).toLocaleTimeString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* NOTIF */}
            <div className="bg-black rounded-3xl p-8 text-white border border-gray-900">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-black"><Bell size={30} /></div>
                <div>
                  <p className="tracking-[6px] text-gray-400 text-sm uppercase">Notification</p>
                  <h1 className="text-5xl font-black">Alert</h1>
                </div>
              </div>
              <div className="space-y-5">
                {alerts.length === 0 ? (
                   <p className="text-gray-500">Tidak ada notifikasi sistem.</p>
                ) : (
                  alerts.map((item, index) => (
                    <div key={item.id || index} className="bg-white/10 rounded-2xl p-5 border border-white/10">
                      <h1 className="font-bold text-lg">{item.pesan}</h1>
                      <p className="text-gray-400 mt-2 text-sm">{item.kategori || new Date(item.created_at).toLocaleTimeString('id-ID')}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PimpinanLayout>
  );
}