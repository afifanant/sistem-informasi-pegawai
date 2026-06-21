import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  FileText,
  Download,
  Users,
  CalendarCheck,
  Briefcase,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FolderOpen // Tambahan icon baru
} from "lucide-react";

export default function Laporan() {
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Ditambah: stat untuk hasil kerja
  const [stats, setStats] = useState({ pegawai: 0, absensi: 0, divisi: 0, hasilKerja: 0 });
  const [isDownloading, setIsDownloading] = useState(null); 

  useEffect(() => {
    setIsMounted(true);

    const fetchStats = async () => {
      try {
        // Ditambah: query fetch ke laporan_proyek
        const [resPegawai, resAbsensi, resDivisi, resHasilKerja] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('absensi').select('id', { count: 'exact', head: true }),
          supabase.from('divisi').select('id', { count: 'exact', head: true }),
          supabase.from('laporan_proyek').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          pegawai: resPegawai.count || 0,
          absensi: resAbsensi.count || 0,
          divisi: resDivisi.count || 0,
          hasilKerja: resHasilKerja.count || 0,
        });
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
      }
    };

    fetchStats();
  }, []);

  const downloadCSV = (data, filename) => {
    if (!data || !data.length) {
      setMessage({ type: "error", text: "Data kosong, tidak ada yang bisa di-export." });
      return;
    }

    const headers = Object.keys(data[0]);
    
    const csvContent = [
      headers.join(","), 
      ...data.map(row => 
        headers.map(fieldName => {
          let fieldData = row[fieldName] === null ? "" : row[fieldName];
          if (typeof fieldData === 'string') {
            fieldData = `"${fieldData.replace(/"/g, '""')}"`;
          }
          return fieldData;
        }).join(",")
      )
    ].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async (tipe) => {
    setIsDownloading(tipe);
    setMessage({ type: "", text: "" });

    try {
      if (tipe === "pegawai") {
        const { data, error } = await supabase.from('profiles').select('id, full_name, email, position, status, role');
        if (error) throw error;
        downloadCSV(data, "Laporan_Data_Pegawai");
      
      } else if (tipe === "absensi") {
        const { data, error } = await supabase
          .from('absensi')
          .select(`id, tanggal, waktu_masuk, waktu_pulang, status, profiles (full_name, position)`)
          .order('tanggal', { ascending: false });
        
        if (error) throw error;

        const formattedData = data.map(item => ({
          ID_Absensi: item.id,
          Tanggal: item.tanggal,
          Nama_Pegawai: item.profiles?.full_name || 'Tidak Diketahui',
          Divisi: item.profiles?.position || 'Tidak Diketahui',
          Jam_Masuk: item.waktu_masuk || '-',
          Jam_Pulang: item.waktu_pulang || '-',
          Status: item.status
        }));
        
        downloadCSV(formattedData, "Laporan_Data_Absensi");

      } else if (tipe === "divisi") {
        const { data, error } = await supabase.from('divisi').select('nama, manager');
        if (error) throw error;
        downloadCSV(data, "Laporan_Struktur_Divisi");

      } else if (tipe === "hasil_kerja") {
        // PENAMBAHAN: Logika tarik data laporan_proyek
        const { data, error } = await supabase
          .from('laporan_proyek')
          .select('id, nama_proyek, file_url, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedData = data.map(item => ({
          ID_Laporan: item.id,
          Tanggal_Upload: new Date(item.created_at).toLocaleString('id-ID'),
          Nama_Proyek: item.nama_proyek,
          Link_File: item.file_url // Link ini yang akan di-klik oleh admin di Excel
        }));

        downloadCSV(formattedData, "Laporan_Hasil_Kerja_Proyek");
      }

      setMessage({ type: "success", text: `Laporan ${tipe.replace('_', ' ')} berhasil di-download.` });
    } catch (error) {
      setMessage({ type: "error", text: "Gagal memproses laporan: " + error.message });
    } finally {
      setIsDownloading(null);
    }
  };

  const laporanCards = [
    {
      id: "pegawai",
      title: "Laporan Pegawai",
      desc: "Export rekapitulasi data profil, divisi, dan status seluruh karyawan ke format Excel/CSV.",
      icon: <Users size={28} />,
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: "absensi",
      title: "Laporan Absensi",
      desc: "Export catatan kehadiran, jam masuk, jam pulang, dan status absensi harian seluruh karyawan.",
      icon: <CalendarCheck size={28} />,
      color: "from-green-500 to-emerald-400",
    },
    {
      id: "divisi",
      title: "Laporan Divisi",
      desc: "Export data struktur divisi perusahaan beserta daftar manager penanggung jawab.",
      icon: <Briefcase size={28} />,
      color: "from-purple-500 to-pink-400",
    },
    {
      id: "hasil_kerja",
      title: "Hasil Pekerjaan",
      desc: "Export rekapitulasi data proyek lapangan beserta URL file dokumentasi yang diunggah pegawai.",
      icon: <FolderOpen size={28} />,
      color: "from-amber-500 to-orange-400", // Warna pembeda untuk hasil kerja
    },
  ];

  return (
    <DashboardLayout>
      <div className={`transform transition-all duration-1000 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}>
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
          <div className="relative z-10">
            <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">
              Company Report
            </p>
            <h1 className="text-5xl font-black mt-4 tracking-tight">
              Pusat Pelaporan
            </h1>
            <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
              Tarik data operasional perusahaan secara realtime dari database dan konversikan menjadi format Excel (CSV) untuk keperluan audit.
            </p>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {message.text && (
          <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 animate-[fadeIn_0.5s_ease-out] ${
            message.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={22} className="flex-shrink-0" /> : <AlertCircle size={22} className="flex-shrink-0" />}
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        {/* STATS KETERSEDIAAN DATA (DIUBAH KE GRID-COLS-4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Data Pegawai</p>
                <h2 className="text-4xl font-black mt-3">{stats.pegawai} <span className="text-xs font-normal text-gray-500">Record</span></h2>
              </div>
              <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Log Absensi</p>
                <h2 className="text-4xl font-black mt-3">{stats.absensi} <span className="text-xs font-normal text-gray-500">Record</span></h2>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
                <CalendarCheck size={24} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Struktur Divisi</p>
                <h2 className="text-4xl font-black mt-3">{stats.divisi} <span className="text-xs font-normal text-gray-500">Divisi</span></h2>
              </div>
              <div className="bg-purple-500 p-4 rounded-2xl shadow-lg shadow-purple-500/20">
                <Briefcase size={24} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Hasil Kerja</p>
                <h2 className="text-4xl font-black mt-3">{stats.hasilKerja} <span className="text-xs font-normal text-gray-500">File</span></h2>
              </div>
              <div className="bg-amber-500 p-4 rounded-2xl shadow-lg shadow-amber-500/20">
                <FolderOpen size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* REPORT CARD (DIUBAH KE GRID-COLS-4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          {laporanCards.map((item) => (
            <div
              key={item.id}
              className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 hover:border-blue-500 transition-all group shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-6`}>
                  {item.icon}
                </div>

                <h2 className="text-2xl font-black mt-6 tracking-tight group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h2>

                <p className="text-gray-400 mt-3 leading-relaxed font-medium text-sm min-h-[80px]">
                  {item.desc}
                </p>
              </div>

              <button 
                onClick={() => handleDownload(item.id)}
                disabled={isDownloading !== null}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-500 active:scale-95 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading === item.id ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Menyusun...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Export CSV
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}