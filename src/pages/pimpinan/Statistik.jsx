import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/PimpinanLayout";
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Loader2,
  Phone,
  MapPin,
  ShieldCheck,
  Layers,
  CalendarDays
} from "lucide-react";
import { supabase } from "../../supabaseClient";
// Import komponen dari Recharts untuk grafik
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function Statistik() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pegawai: 0,
    divisi: 0,
    absensi: 0,
  });
  
  const [pegawaiList, setPegawaiList] = useState([]);
  const [divisiList, setDivisiList] = useState([]);
  const [chartData, setChartData] = useState([]); // State baru untuk data grafik

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [
          resPegawai,
          resDivisi,
          resAbsensi
        ] = await Promise.all([
          supabase.from("profiles").select("*, divisi(*)", { count: "exact" }), 
          supabase.from("divisi").select("*"),
          // Hilangkan head: true agar kita bisa mengolah data status absensinya
          supabase.from("absensi").select("*", { count: "exact" })
        ]);

        let finalDataPegawai = resPegawai.data;
        let finalCountPegawai = resPegawai.count;

        if (resPegawai.error) {
          console.warn("Info: Tidak ada relasi tabel divisi, menggunakan select reguler.");
          const fallback = await supabase.from("profiles").select("*", { count: "exact" });
          finalDataPegawai = fallback.data;
          finalCountPegawai = fallback.count;
        }

        const dataDivisi = resDivisi.data || [];
        const dataAbsensi = resAbsensi.data || [];

        setStats({
          pegawai: finalCountPegawai || 0,
          divisi: dataDivisi.length || 0,
          absensi: resAbsensi.count || 0,
        });

        setPegawaiList(finalDataPegawai || []);
        setDivisiList(dataDivisi);

        // --- PENGOLAHAN DATA UNTUK GRAFIK ---
        // Mengelompokkan berdasarkan status absensi (Hadir, Sakit, Izin, dsb)
        let totalHadir = 0;
        let totalSakit = 0;
        let totalIzin = 0;
        let totalAlpa = 0;

        dataAbsensi.forEach((item) => {
          // Sesuaikan 'status' dengan nama kolom di tabel absensi Anda (bisa status, keterangan, dll)
          const status = (item.status || item.keterangan || "").toLowerCase();
          if (status.includes("hadir")) totalHadir++;
          else if (status.includes("sakit")) totalSakit++;
          else if (status.includes("izin")) totalIzin++;
          else totalAlpa++;
        });

        setChartData([
          { name: "Hadir", total: totalHadir, color: "#22c55e" }, // Hijau
          { name: "Izin", total: totalIzin, color: "#eab308" },   // Kuning
          { name: "Sakit", total: totalSakit, color: "#f97316" }, // Orange
          { name: "Alpa/Lainnya", total: totalAlpa, color: "#ef4444" }, // Merah
        ]);

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
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-[#f4f7fb] w-full min-h-screen">
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl">
          <p className="uppercase tracking-[5px] text-blue-200 text-sm">
            Executive Directory & Statistics
          </p>
          <h1 className="text-5xl font-black mt-3">Data Pegawai & Statistik</h1>
          <p className="mt-4 text-blue-100 max-w-3xl">
            Pantau ringkasan data real-time, profil lengkap tim, alamat kontak, beserta divisi kerja perusahaan secara langsung.
          </p>
        </div>

        {/* CARDS STATISTIK */}
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

        {/* DIRECTORY */}
        <div className="bg-white rounded-[35px] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-green-500 text-white p-4 rounded-2xl">
              <Users />
            </div>
            <div>
              <p className="uppercase tracking-[4px] text-gray-400 text-sm">
                Corporate Directory
              </p>
              <h2 className="text-3xl font-black text-slate-800">
                Seluruh Data Anggota Tim
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-green-500" size={40} />
            </div>
          ) : pegawaiList.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Belum ada data pegawai yang terdaftar.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pegawaiList.map((pegawai) => {
                const namaPegawai = pegawai.nama || pegawai.full_name || pegawai.nama_lengkap || pegawai.email?.split('@')[0] || "Tanpa Nama";
                
                let namaDivisi = "Umum";
                if (pegawai.divisi && typeof pegawai.divisi === "object") {
                  namaDivisi = pegawai.divisi.nama_divisi || pegawai.divisi.nama || "Umum";
                } else if (typeof pegawai.divisi === "string") {
                  namaDivisi = pegawai.divisi;
                } else if (pegawai.nama_divisi) {
                  namaDivisi = pegawai.nama_divisi;
                } else if (pegawai.id_divisi || pegawai.divisi_id) {
                  const targetId = pegawai.id_divisi || pegawai.divisi_id;
                  const divisiDitemukan = divisiList.find(d => d.id === targetId);
                  if (divisiDitemukan) {
                    namaDivisi = divisiDitemukan.nama_divisi || divisiDitemukan.nama || targetId;
                  } else {
                    namaDivisi = `ID: ${targetId}`;
                  }
                }

                return (
                  <div 
                    key={pegawai.id} 
                    className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0 uppercase">
                        {namaPegawai.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-lg truncate leading-snug">
                          {namaPegawai}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md capitalize">
                            <ShieldCheck size={12} /> {pegawai.role || "Pegawai"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md capitalize">
                            <Layers size={12} /> {namaDivisi}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2.5 text-sm text-slate-600">
                      <div className="flex items-center gap-3">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <span className="font-semibold tracking-wide text-slate-700">
                          {pegawai.no_hp || pegawai.phone || pegawai.phone_number || pegawai.no_telp || pegawai.telepon || pegawai.hp || "Nomor belum diisi"}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-500 leading-relaxed text-xs">
                          {pegawai.alamat || pegawai.address || pegawai.domisili || pegawai.alamat_rumah || "Alamat belum diisi"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* GRAFIK ABSENSI */}
        <div className="bg-white rounded-[35px] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-orange-500 text-white p-4 rounded-2xl">
              <CalendarDays />
            </div>
            <div>
              <p className="uppercase tracking-[4px] text-gray-400 text-sm">
                Attendance Insight
              </p>
              <h2 className="text-3xl font-black text-slate-800">
                Grafik Status Kehadiran
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
          ) : (
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontWeight: 600 }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}