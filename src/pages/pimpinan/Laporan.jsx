import { useState } from "react";
import DashboardLayout from "../../layouts/PimpinanLayout";
import { supabase } from "../../supabaseClient";
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function Laporan() {
  const [loadingType, setLoadingType] = useState(null);

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert("Data tidak ditemukan atau kosong.");
      return;
    }
    
    const headers = Object.keys(data[0]).join(",");
    
    const rows = data.map(row => 
      Object.values(row).map(value => {
        let safeValue = value === null || value === undefined ? "" : value;
        if (typeof safeValue === 'object') {
          safeValue = JSON.stringify(safeValue);
        }
        if (typeof safeValue === 'string') {
          safeValue = safeValue.replace(/"/g, '""');
        }
        return `"${safeValue}"`;
      }).join(",")
    ).join("\n");
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async (tipe) => {
    setLoadingType(tipe);
    try {
      let resultData;
      let filename;
      let formattedData = [];

      // Tarik master profil untuk maping nama
      const { data: profilesData, error: errProfiles } = await supabase.from('profiles').select('*');
      if (errProfiles) throw errProfiles;

      const profileMap = {};
      if (profilesData) {
        profilesData.forEach(p => {
          profileMap[p.id] = p.nama || p.full_name || p.email || "Tanpa Nama";
        });
      }

      switch (tipe) {
        case "Laporan Data Pegawai": {
          resultData = profilesData;
          filename = "Laporan_Data_Pegawai";
          break;
        }

        case "Laporan Kehadiran Pegawai": {
          const { data: absensiData, error: errAbsensi } = await supabase.from("absensi").select("*");
          if (errAbsensi) throw errAbsensi;
          resultData = absensiData;
          filename = "Laporan_Kehadiran";
          break;
        }
          
        case "Laporan Divisi": {
          const { data: divisiData, error: errDivisi } = await supabase.from("divisi").select("*");
          if (errDivisi) throw errDivisi;
          resultData = divisiData;
          filename = "Laporan_Divisi";
          break;
        }

        // PENAMBAHAN: Case untuk Hasil Kerja
        case "Laporan Hasil Kerja": {
          const { data: hasilData, error: errHasil } = await supabase
            .from("laporan_proyek")
            .select("*")
            .order("created_at", { ascending: false });
            
          if (errHasil) throw errHasil;
          
          // Pre-format agar CSV tidak berisi raw timestamp
          resultData = hasilData.map(item => ({
            ID_Laporan: item.id,
            user_id: item.user_id, // Disimpan sementara untuk mapping nama di bawah
            Tanggal_Upload: new Date(item.created_at).toLocaleString('id-ID'),
            Nama_Proyek: item.nama_proyek,
            Link_Dokumen: item.file_url
          }));
          
          filename = "Laporan_Hasil_Kerja";
          break;
        }

        default:
          throw new Error("Tipe laporan tidak dikenali");
      }

      // Format final untuk menyisipkan Nama Pegawai & membuang user_id agar Excel bersih
      if (tipe === "Laporan Data Pegawai" || tipe === "Laporan Divisi") {
        formattedData = resultData; 
      } else {
        formattedData = resultData.map(row => {
          // Destructure untuk membuang user_id dari hasil akhir CSV
          const { user_id, ...rest } = row; 
          return {
            Nama_Pegawai: profileMap[user_id] || "Sistem / Akun Dihapus",
            ...rest
          };
        });
      }
      
      downloadCSV(formattedData, filename);

    } catch (error) {
      console.error("Gagal mendownload laporan:", error.message);
      alert("Terjadi kesalahan saat menarik data: " + error.message);
    } finally {
      setLoadingType(null);
    }
  };

  // PENAMBAHAN: Opsi laporan baru
  const daftarLaporan = [
    "Laporan Data Pegawai",
    "Laporan Kehadiran Pegawai",
    "Laporan Divisi",
    "Laporan Hasil Kerja",
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 bg-[#f4f7fb] w-full min-h-screen">
        
        {/* HERO SECTION */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-[100px] opacity-30"></div>
          
          <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">
            Executive Report
          </p>
          <h1 className="text-5xl font-black mt-3 tracking-tight">
            Laporan Perusahaan
          </h1>
          <p className="mt-4 text-blue-100/90 max-w-3xl text-lg">
            Monitoring dan ekstraksi data esensial perusahaan secara real-time.
          </p>
        </div>

        {/* DAFTAR KARTU LAPORAN */}
        {/* PERBAIKAN: Diubah menjadi xl:grid-cols-4 agar pas untuk 4 kartu */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {daftarLaporan.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[35px] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner border ${
                  item === "Laporan Hasil Kerja" 
                    ? "bg-amber-50 text-amber-600 border-amber-100" // Warna khusus untuk hasil kerja
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  <FileText size={30} />
                </div>

                <h2 className="text-2xl lg:text-3xl font-black text-slate-800 leading-tight">
                  {item}
                </h2>

                <div className="flex items-center gap-2 mt-5 text-gray-500 text-sm font-medium">
                  <Calendar size={18} className="text-blue-500" />
                  Update hari ini
                </div>

                <div className="flex items-center gap-2 mt-3 text-emerald-600 text-sm font-bold bg-emerald-50 w-fit px-3 py-1 rounded-full">
                  <CheckCircle2 size={16} />
                  Data Real-time Tersedia
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                  onClick={() => handleDownload(item)}
                  disabled={loadingType === item}
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold text-sm uppercase tracking-wide ${
                    loadingType === item 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 active:scale-[0.98]"
                  }`}
                >
                  {loadingType === item ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Download (.csv)
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}