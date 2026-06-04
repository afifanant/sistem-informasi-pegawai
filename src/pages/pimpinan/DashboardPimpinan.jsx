import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/PimpinanLayout";
import {
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Bell,
  Loader2,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function DashboardPimpinan() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPegawai: 0,
    tugasAktif: 0,
    produktivitas: "0%",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch data dinamis dari Supabase
        const [
          { count: pegawai },
          { count: tugas }
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("tugas").select("*", { count: "exact", head: true }).eq("status", "aktif")
        ]);

        setStats({
          totalPegawai: pegawai || 0,
          tugasAktif: tugas || 0,
          produktivitas: "91%", // Bisa lu hitung logic-nya di sini nanti
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cardData = [
    { title: "Total Pegawai", value: stats.totalPegawai, icon: <Users size={28} />, color: "bg-yellow-500/20 text-yellow-400" },
    { title: "Tugas Aktif", value: stats.tugasAktif, icon: <Briefcase size={28} />, color: "bg-blue-500/20 text-blue-400" },
    { title: "Produktivitas", value: stats.produktivitas, icon: <TrendingUp size={28} />, color: "bg-green-500/20 text-green-400" },
    { title: "Efisiensi", value: "$24K", icon: <DollarSign size={28} />, color: "bg-orange-500/20 text-orange-400" },
  ];

  return (
    <DashboardLayout role="pimpinan">
      {/* HERO */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#0f172a] rounded-[35px] p-10 text-white shadow-2xl">
        <p className="uppercase tracking-[6px] text-blue-200 text-sm">Dashboard</p>
        <h1 className="text-6xl font-black leading-tight mt-4">
          Monitoring <br /> Pegawai Proyek
        </h1>
        <p className="text-blue-100 mt-6 max-w-2xl leading-relaxed">
          Dashboard manajemen strategis. Memantau performa, data realtime, dan efisiensi operasional.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {loading ? (
          <div className="col-span-4 flex justify-center py-10"><Loader2 className="animate-spin text-blue-400" size={40} /></div>
        ) : (
          cardData.map((item, index) => (
            <div key={index} className="bg-[#111827] border border-gray-800 rounded-3xl p-7 hover:border-blue-500/50 transition-colors">
              <p className="text-gray-400">{item.title}</p>
              <div className="flex justify-between items-center mt-5">
                <h2 className="text-5xl font-black text-white">{item.value}</h2>
                <div className={`${item.color} p-4 rounded-2xl`}>{item.icon}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* LEFT (Statistik Pegawai) */}
        <div className="xl:col-span-2 bg-[#0f172a] border border-gray-800 rounded-[35px] p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="uppercase tracking-[4px] text-gray-500 text-sm">Monitoring</p>
              <h2 className="text-4xl font-black text-white mt-2">Statistik Pegawai</h2>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl text-white font-bold transition">Download</button>
          </div>
          {/* ... sisa kode statistik lu ... */}
        </div>

        {/* RIGHT (Aktivitas) */}
        <div className="bg-black rounded-[35px] border border-gray-800 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-yellow-500 p-4 rounded-2xl text-black"><Bell size={28} /></div>
            <div>
              <p className="uppercase tracking-[4px] text-gray-500 text-sm">Realtime</p>
              <h2 className="text-4xl font-black text-white">Aktivitas</h2>
            </div>
          </div>
          {/* ... sisa kode aktivitas lu ... */}
        </div>
      </div>
    </DashboardLayout>
  );
}