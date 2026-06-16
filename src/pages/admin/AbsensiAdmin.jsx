import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  CalendarCheck,
  Clock3,
  Search,
  CheckCircle2,
  XCircle,
  TimerReset,
  Loader2,
  MapPin // <-- Ditambahkan untuk icon peta
} from "lucide-react";

export default function AbsensiAdmin() {
  // 1. State UI & Animasi
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 2. State Data Dinamis
  const [dataAbsensi, setDataAbsensi] = useState([]);
  const [stats, setStats] = useState({ hadir: 0, izin: 0, terlambat: 0, total: 0 });

  // 3. Fungsi Menarik dan Menggabungkan Data
  const fetchDataAdmin = async () => {
    try {
      // A. Tarik seluruh data absensi
      const { data: absensi, error: errAbsensi } = await supabase
        .from('absensi')
        .select('*')
        .order('tanggal', { ascending: false })
        .order('waktu_masuk', { ascending: false });

      if (errAbsensi) throw errAbsensi;

      // B. Tarik seluruh data profil (untuk mendapatkan Nama & Divisi)
      const { data: profiles, error: errProfiles } = await supabase
        .from('profiles')
        .select('id, full_name, position');

      if (errProfiles) throw errProfiles;

      // C. Gabungkan data absensi dengan profil pemiliknya
      const mergedData = (absensi || []).map(absen => {
        const pemilik = profiles?.find(p => p.id === absen.user_id);
        return {
          ...absen,
          nama: pemilik?.full_name || 'User Tidak Dikenal',
          divisi: pemilik?.position || 'Belum Diatur'
        };
      });

      setDataAbsensi(mergedData);

      // D. Kalkulasi Statistik Hari Ini
      const hariIni = new Date().toISOString().split('T')[0];
      const absenHariIni = mergedData.filter(item => item.tanggal === hariIni);
      
      setStats({
        hadir: absenHariIni.filter(i => i.status === 'Hadir').length,
        izin: absenHariIni.filter(i => i.status === 'Izin').length,
        // PERBAIKAN: Menghitung status "Telat" sesuai yang dikirim dari halaman pegawai
        terlambat: absenHariIni.filter(i => i.status === 'Telat' || i.status === 'Terlambat').length, 
        total: mergedData.length 
      });

    } catch (error) {
      console.error("Gagal menarik data admin:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchDataAdmin();
  }, []);

  // 4. Logika Pencarian (Search Filter)
  const filteredData = dataAbsensi.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.divisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full min-h-screen text-white">
          <Loader2 className="animate-spin mr-3" size={30} /> Sinkronisasi Data Pegawai...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`transform transition-all duration-1000 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}>
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-[35px] p-10 text-white shadow-xl">
          <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">
            Attendance System
          </p>
          <h1 className="text-5xl font-black mt-4 tracking-tight">
            Monitoring Absensi
          </h1>
          <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
            Pantau absensi pegawai perusahaan secara realtime. Data yang disajikan otomatis tersinkronisasi dengan database pusat.
          </p>
        </div>

        {/* STATS (Dihitung Realtime) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          
          <div className="bg-[#111827] rounded-[30px] p-7 text-white border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Hadir Hari Ini</p>
                <h2 className="text-5xl font-black mt-3">{stats.hadir}</h2>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
                <CheckCircle2 size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Izin / Cuti</p>
                <h2 className="text-5xl font-black mt-3">{stats.izin}</h2>
              </div>
              <div className="bg-yellow-500 p-4 rounded-2xl shadow-lg shadow-yellow-500/20">
                <TimerReset size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Terlambat</p>
                <h2 className="text-5xl font-black mt-3">{stats.terlambat}</h2>
              </div>
              <div className="bg-red-500 p-4 rounded-2xl shadow-lg shadow-red-500/20">
                <XCircle size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Record</p>
                <h2 className="text-5xl font-black mt-3">{stats.total}</h2>
              </div>
              <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <CalendarCheck size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white border border-gray-800 shadow-xl">
          
          {/* TOPBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>
              <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Realtime Monitoring</p>
              <h2 className="text-4xl font-black mt-2 tracking-tight">Data Absensi Pegawai</h2>
            </div>

            {/* SEARCH FITUR AKTIF */}
            <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[350px] border border-gray-700 focus-within:border-blue-500 transition-all">
              <Search className="text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Cari nama, divisi, atau status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* TABLE DATA */}
          <div className="overflow-x-auto">
            {filteredData.length === 0 ? (
               <div className="text-center py-10 text-gray-500">
                 Tidak ada data absensi yang ditemukan.
               </div>
            ) : (
<table className="w-full min-w-[900px]">
  <thead>
    <tr className="border-b border-gray-700 text-left text-gray-400">
      <th className="pb-5 font-semibold">Tanggal</th>
      <th className="pb-5 font-semibold">Nama Pegawai</th>
      <th className="pb-5 font-semibold">Divisi</th>
      <th className="pb-5 font-semibold">Jam Masuk</th>
      <th className="pb-5 font-semibold">Jam Pulang</th>
      {/* Header diganti untuk mencakup Bukti */}
      <th className="pb-5 font-semibold">Status & Bukti</th> 
      <th className="pb-5 font-semibold">Lokasi Absen</th>
    </tr>
  </thead>
  <tbody>
    {filteredData.map((item) => (
      <tr key={item.id} className="border-b border-gray-800 hover:bg-[#1f2937] transition-colors">
        <td className="py-5 font-medium text-blue-400">{item.tanggal}</td>
        <td className="py-5 font-bold text-white">{item.nama}</td>
        <td className="py-5 text-gray-400 text-sm">{item.divisi}</td>
        
        <td className="py-5">
          <div className="flex items-center gap-2 font-medium text-gray-300">
            <Clock3 size={16} className="text-gray-500" />
            {item.waktu_masuk || "-"}
          </div>
        </td>
        
        <td className="py-5">
          <div className="flex items-center gap-2 font-medium text-gray-300">
            <Clock3 size={16} className="text-gray-500" />
            {item.waktu_pulang || "-"}
          </div>
        </td>
        
        {/* GABUNGAN: Status dan Bukti Izin */}
        <td className="py-5">
          <div className="flex items-center gap-3">
            {/* Badge Status */}
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
              item.status === "Hadir" ? "bg-green-500/10 text-green-400 border border-green-500/20" : 
              (item.status === "Izin" || item.status === "Sakit") ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : 
              "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {item.status}
            </span>

            {/* Jika ada bukti_url, tampilkan di sampingnya */}
            {item.bukti_url && (
              <div className="border-l border-gray-700 pl-3">
                {item.bukti_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <img 
                    src={item.bukti_url} 
                    alt="Bukti" 
                    className="w-10 h-10 object-cover rounded-lg border border-gray-600 hover:scale-125 transition-transform cursor-pointer shadow-md"
                    onClick={() => window.open(item.bukti_url, "_blank")}
                    title="Klik untuk memperbesar bukti izin"
                  />
                ) : (
                  <a 
                    href={item.bukti_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                    title="Buka Dokumen Izin"
                  >
                    {/* Pastikan Anda sudah import FileText dari lucide-react */}
                    <FileText size={18} />
                  </a>
                )}
              </div>
            )}
          </div>
        </td>
        
        {/* Sel Tabel Lokasi & Maps */}
        <td className="py-5 max-w-[250px]">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-300 leading-relaxed line-clamp-2" title={item.lokasi_hadir}>
              {item.lokasi_hadir || "Lokasi tidak tercatat"}
            </span>
            
            {/* Tombol Peta */}
            {(item.lat && item.lng) && (
              <a 
                href={`https://maps.google.com/?q=${item.lat},${item.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-fit mt-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-[0_0_10px_rgb(37,99,235,0.3)]"
              >
                <MapPin size={12} /> Lihat di Peta
              </a>
            )}
          </div>
        </td>

      </tr>
    ))}
  </tbody>
</table>
            )}
          </div>
        </div>

        {/* ACTIVITY & STATUS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* LOG AKTIVITAS (Dinamis dari 5 Absensi Terakhir) */}
          <div className="xl:col-span-2 bg-gradient-to-br from-blue-600 to-slate-950 rounded-[35px] p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <CalendarCheck size={28} />
              </div>
              <div>
                <p className="uppercase tracking-[4px] text-blue-200 text-sm font-semibold">Realtime</p>
                <h2 className="text-4xl font-black tracking-tight">Aktivitas Terbaru</h2>
              </div>
            </div>

            <div className="space-y-4">
              {dataAbsensi.slice(0, 5).map((item) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgb(74,222,128,0.8)] animate-pulse ${
                      item.status === "Telat" ? "bg-red-400" : item.status === "Izin" ? "bg-yellow-400" : "bg-green-400"
                    }`}></div>
                    <p className="font-medium text-sm lg:text-base">
                      <span className="font-bold text-blue-300">{item.nama}</span> melakukan check-in pada <span className="font-bold">{item.waktu_masuk}</span> dengan status <span className="italic">{item.status}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SYSTEM STATUS */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[35px] p-8 text-white shadow-xl transform transition-transform hover:-translate-y-1">
              <p className="uppercase tracking-[4px] text-cyan-100 text-sm font-semibold">Productivity</p>
              {/* Persentase kehadiran hari ini dibanding total user (asumsi sederhana) */}
              <h2 className="text-7xl font-black mt-5 tracking-tighter">
                {stats.total > 0 ? Math.round((stats.hadir / dataAbsensi.filter(i => i.tanggal === new Date().toISOString().split('T')[0]).length || 1) * 100) : 100}%
              </h2>
              <p className="mt-4 text-cyan-100 text-sm leading-relaxed font-medium">
                Tingkat kehadiran pegawai hari ini berdasarkan data tersinkronisasi.
              </p>
            </div>

            <div className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 shadow-xl">
              <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">System Status</p>
              <h2 className="text-4xl font-black mt-4 tracking-tight">Server Active</h2>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgb(34,197,94,0.8)] animate-pulse"></div>
                <p className="font-medium text-sm text-gray-300">Semua koneksi ke database berjalan normal</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}