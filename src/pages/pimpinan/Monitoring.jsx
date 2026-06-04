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
  const [stats, setStats] = useState({ online: 0, aktivitas: 0, kehadiran: "0%", produktivitas: "0%" });
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 1. Fetch Stats (Sesuaikan nama tabel dengan database lu)
        const { count: online } = await supabase.from("absensi").select("*", { count: "exact", head: true }).eq("status", "hadir");
        const { count: totalAktivitas } = await supabase.from("aktivitas").select("*", { count: "exact", head: true });
        
        // 2. Fetch Lists
        const { data: actData } = await supabase.from("aktivitas").select("*").limit(4).order("created_at", { ascending: false });
        const { data: alertData } = await supabase.from("notifikasi").select("*").limit(4).order("created_at", { ascending: false });

        setStats({
          online: online || 0,
          aktivitas: totalAktivitas || 0,
          kehadiran: "98%", // Lu bisa buat logic hitung % di sini
          produktivitas: "91%"
        });
        setActivities(actData || []);
        setAlerts(alertData || []);
        
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <PimpinanLayout>
      {loading ? (
        <div className="flex h-screen items-center justify-center text-white">
          <Loader2 className="animate-spin" size={50} />
        </div>
      ) : (
        <div className="p-8">
          {/* HERO */}
          <div className="bg-gradient-to-r from-blue-700 to-[#09152f] rounded-[40px] p-10 text-white shadow-2xl">
            <p className="uppercase tracking-[8px] text-blue-200 text-sm mb-4">Live Monitoring</p>
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
              <div key={i} className="bg-[#09152f] rounded-3xl p-8 text-white">
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
                {activities.map((item, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <div>
                        <h1 className="font-bold text-lg">{item.deskripsi}</h1>
                        <p className="text-gray-400 text-sm">{new Date(item.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NOTIF */}
            <div className="bg-black rounded-3xl p-8 text-white">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-black"><Bell size={30} /></div>
                <div>
                  <p className="tracking-[6px] text-gray-400 text-sm uppercase">Notification</p>
                  <h1 className="text-5xl font-black">Alert</h1>
                </div>
              </div>
              <div className="space-y-5">
                {alerts.map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-2xl p-5 border border-white/10">
                    <h1 className="font-bold text-lg">{item.pesan}</h1>
                    <p className="text-gray-400 mt-2">{item.kategori}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </PimpinanLayout>
  );
}