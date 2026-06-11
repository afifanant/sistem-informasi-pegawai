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

      const { data: profilesData } = await supabase.from('profiles').select('*');
      const profileMap = {};
      if (profilesData) {
        profilesData.forEach(p => {
          profileMap[p.id] = p.nama || p.full_name || p.email || "Tanpa Nama";
        });
      }

      switch (tipe) {
        case "Laporan Data Pegawai":
          resultData = profilesData;
          filename = "Laporan_Data_Pegawai";
          break;

        case "Laporan Kehadiran Pegawai":
          const { data: absensiData, error: errAbsensi } = await supabase.from("absensi").select("*");
          if (errAbsensi) throw errAbsensi;
          resultData = absensiData;
          filename = "Laporan_Kehadiran";
          break;
          
        case "Laporan Divisi":
          const { data: divisiData, error: errDivisi } = await supabase.from("divisi").select("*");
          if (errDivisi) throw errDivisi;
          resultData = divisiData;
          filename = "Laporan_Divisi";
          break;

        default:
          throw new Error("Tipe laporan tidak dikenali");
      }

      if (tipe === "Laporan Data Pegawai" || tipe === "Laporan Divisi") {
        formattedData = resultData; 
      } else {
        formattedData = resultData.map(row => ({
          Nama_Pegawai: profileMap[row.user_id] || "Sistem / Akun Dihapus",
          ...row
        }));
      }
      
      downloadCSV(formattedData, filename);

    } catch (error) {
      console.error("Gagal mendownload laporan:", error.message);
      alert("Terjadi kesalahan saat menarik data: " + error.message);
    } finally {
      setLoadingType(null);
    }
  };

  // DAFTAR LAPORAN KINI HANYA 3 ITEM
  const daftarLaporan = [
    "Laporan Data Pegawai",
    "Laporan Kehadiran Pegawai",
    "Laporan Divisi",
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 bg-[#f4f7fb] w-full min-h-screen">
        
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl">
          <p className="uppercase tracking-[5px] text-blue-200 text-sm">
            Executive Report
          </p>
          <h1 className="text-5xl font-black mt-3">
            Laporan Perusahaan
          </h1>
          <p className="mt-4 text-blue-100 max-w-3xl">
            Monitoring dan ekstraksi data esensial perusahaan secara real-time.
          </p>
        </div>

        {/* Karena sisa 3 item, grid ini otomatis akan menyusun 2 di atas, 1 di bawah */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {daftarLaporan.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[35px] p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="bg-blue-100 text-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <FileText size={30} />
                  </div>

                  <h2 className="text-3xl font-black text-slate-800">
                    {item}
                  </h2>

                  <div className="flex items-center gap-2 mt-4 text-gray-500">
                    <Calendar size={18} />
                    Update hari ini
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-green-600 font-semibold">
                    <CheckCircle2 size={18} />
                    Data Real-time Tersedia
                  </div>
                </div>

                <button 
                  onClick={() => handleDownload(item)}
                  disabled={loadingType === item}
                  className={`px-5 py-3 rounded-2xl flex items-center gap-2 transition font-bold ${
                    loadingType === item 
                      ? "bg-gray-400 cursor-not-allowed text-white" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 active:scale-95"
                  }`}
                >
                  {loadingType === item ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
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