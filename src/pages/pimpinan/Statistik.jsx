import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/PimpinanLayout"; // Pastikan ini benar
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Loader2,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function Statistik() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pegawai: 0,
    divisi: 0,
    absensi: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch data secara paralel untuk kecepatan
        const [
          { count: countPegawai },
          { count: countDivisi },
          { count: countAbsensi }
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("divisi").select("*", { count: "exact", head: true }),
          supabase.from("absensi").select("*", { count: "exact", head: true })
        ]);

        setStats({
          pegawai: countPegawai || 0,
          divisi: countDivisi || 0,
          absensi: countAbsensi || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const cardData = [
    { title: "Total Pegawai", value: stats.pegawai, icon: <Users />, color: "bg-blue-500" },
    { title: "Total Divisi", value: stats.divisi, icon: <Briefcase />, color: "bg-purple-500" },
    { title: "Absensi", value: stats.absensi, icon: <TrendingUp />, color: "bg-green-500" },
    { title: "Kinerja", value: "95%", icon: <BarChart3 />, color: "bg-orange-500" },
  ];

  return (
    // MEMBUNGKUS KONTEN DENGAN LAYOUT
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-[#f4f7fb] w-full">
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl">
          <p className="uppercase tracking-[5px] text-blue-200 text-sm">
            Executive Statistics
          </p>
          <h1 className="text-5xl font-black mt-3">Statistik Perusahaan</h1>
          <p className="mt-4 text-blue-100 max-w-3xl">
            Analisis data real-time, performa pegawai, dan pertumbuhan perusahaan.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            cardData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[30px] p-7 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">{item.title}</p>
                    <h2 className="text-5xl font-black mt-4 text-slate-800">
                      {item.value}
                    </h2>
                  </div>
                  <div className={`${item.color} text-white p-4 rounded-2xl`}>
                    {item.icon}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CHART */}
        <div className="bg-white rounded-[35px] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-blue-600 text-white p-4 rounded-2xl">
              <BarChart3 />
            </div>
            <div>
              <p className="uppercase tracking-[4px] text-gray-400 text-sm">
                Analytics
              </p>
              <h2 className="text-4xl font-black text-slate-800">
                Grafik Produktivitas
              </h2>
            </div>
          </div>

          <div className="flex items-end gap-6 h-[350px]">
            {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"].map((bulan, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t-3xl bg-gradient-to-t from-blue-700 to-cyan-400"
                  style={{ height: `${60 + index * 5}%` }}
                ></div>
                <p className="mt-4 font-bold text-slate-700">{bulan}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}