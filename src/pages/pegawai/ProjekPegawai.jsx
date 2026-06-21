import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; 
import {
  Briefcase,
  CalendarDays,
  MapPin,
  Loader2,
  AlertCircle,
  Layers,
  UploadCloud,
  CheckCircle
} from "lucide-react";

import SidebarPegawai from "../../components/sidebar/SidebarPegawai"; 

export default function ProjekPegawai() {
  const [projekData, setProjekData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // State untuk Upload
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchProjek = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("nama_proyek, proyek_lokasi, tanggal_mulai, tanggal_selesai, position") 
        .eq("id", user.id)
        .single(); 

      if (error && error.code !== 'PGRST116') {
        console.error("Error database:", error);
      }
      
      if (data && data.nama_proyek) {
        setProjekData(data);
      } else {
        setProjekData(null);
      }

    } catch (error) {
      console.error("Gagal mengambil data penugasan:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjek();
    setTimeout(() => setIsMounted(true), 100);
  }, []);

  // Fungsi Upload Hasil Kerja
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Pilih file terlebih dahulu!");
    if (!projekData || !userId) return alert("Data proyek tidak valid.");

    setUploading(true);
    setUploadSuccess(false);

    try {
      // 1. Upload file ke Supabase Storage (Bucket: 'hasil_kerja')
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('hasil_kerja')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // 2. Ambil Public URL dari file yang diupload
      const { data: publicUrlData } = supabase.storage
        .from('hasil_kerja')
        .getPublicUrl(filePath);

      // 3. Simpan rekam jejak ke tabel database baru (laporan_proyek)
      const { error: dbError } = await supabase
        .from('laporan_proyek')
        .insert([
          { 
            user_id: userId, 
            nama_proyek: projekData.nama_proyek, 
            file_url: publicUrlData.publicUrl 
          }
        ]);

      if (dbError) throw dbError;

      setUploadSuccess(true);
      setFile(null); // Reset form
    } catch (error) {
      console.error("Error upload:", error);
      alert("Gagal mengupload hasil kerja: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <SidebarPegawai />
        <main className="flex-1 p-8 flex justify-center items-center text-slate-500">
          <Loader2 className="animate-spin mr-3 text-blue-600" size={30} /> 
          <span className="font-semibold text-lg tracking-wide">Sinkronisasi Data Penugasan...</span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarPegawai />

      <main className="flex-1 p-8 text-slate-800">
        <div className={`transform transition-all duration-1000 ease-out ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          
          {/* BANNER HEADER */}
          <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[35px] p-10 text-white mb-8 shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
            {/* ... (Efek visual banner lu tetap sama) ... */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-[-30px] left-[20%] w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm mb-4">
                <Briefcase size={14} className="text-blue-200" />
                <p className="uppercase tracking-widest text-blue-100 text-xs font-bold">Workspace</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Penugasan Saat Ini</h1>
              <p className="text-blue-100/80 mt-4 max-w-2xl leading-relaxed font-medium">
                Pantau detail mandat proyek lapangan dari divisi Anda. Pastikan untuk selalu memeriksa kesesuaian waktu dan titik lokasi operasional.
              </p>
            </div>
          </div>

          {!projekData ? (
            /* STATE KOSONG */
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-[35px] p-16 flex flex-col items-center justify-center transition-all hover:bg-slate-100/50">
              <div className="bg-white p-5 rounded-full shadow-sm mb-5 border border-slate-100">
                <AlertCircle size={48} className="text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Standby Mode</h3>
              <p className="text-slate-500 text-center max-w-md font-medium leading-relaxed">
                Anda belum memiliki proyek aktif saat ini. Menunggu alokasi dan instruksi lebih lanjut dari Manager Divisi Anda.
              </p>
            </div>
          ) : (
            /* STATE TERISI */
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* KARTU DETAIL PROYEK */}
              <div className="bg-white border border-slate-200 rounded-[35px] p-8 flex flex-col justify-between shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-200">
                
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/80 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                      <Briefcase size={28} />
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <span className="px-3 py-1.5 rounded-xl font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
                        <Layers size={14} /> Divisi {projekData.position || "Umum"}
                      </span>
                      <span className="px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5 relative overflow-hidden">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Status: Aktif
                      </span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-black mb-3 text-slate-900 leading-tight">
                    {projekData.nama_proyek}
                  </h3>
                  
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-4 bg-slate-50 hover:bg-white transition-colors p-4 rounded-2xl border border-slate-100">
                      <div className="bg-white p-3 rounded-xl text-blue-600 shadow-sm border border-slate-100 shrink-0">
                        <CalendarDays size={22} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Periode Pengerjaan</p>
                        <p className="font-bold text-sm text-slate-800">
                          {projekData.tanggal_mulai && projekData.tanggal_selesai 
                            ? `${projekData.tanggal_mulai} s/d ${projekData.tanggal_selesai}` 
                            : <span className="text-slate-400 italic font-medium">Periode belum ditentukan admin</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-50 hover:bg-white transition-colors p-4 rounded-2xl border border-slate-100">
                      <div className="bg-white p-3 rounded-xl text-rose-500 shadow-sm border border-slate-100 shrink-0">
                        <MapPin size={22} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Lokasi Proyek</p>
                        <p className="font-bold text-sm text-slate-800 leading-snug">
                          {projekData.proyek_lokasi || <span className="text-slate-400 italic font-medium">Lokasi belum ditentukan</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KARTU UPLOAD HASIL KERJA (Baru) */}
              <div className="bg-white border border-slate-200 rounded-[35px] p-8 shadow-xl shadow-slate-200/50 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <UploadCloud className="text-blue-600" />
                    Upload Hasil Kerja
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">Unggah dokumen atau laporan akhir untuk proyek ini. Data akan tersimpan dalam arsip penugasan.</p>
                </div>

                {uploadSuccess && (
                  <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl flex items-center gap-3">
                    <CheckCircle size={20} className="text-emerald-500" />
                    <p className="text-sm font-semibold">Hasil kerja berhasil diunggah!</p>
                  </div>
                )}

                <form onSubmit={handleUpload} className="space-y-5">
                  <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-center">
                    <input 
                      type="file" 
                      onChange={(e) => setFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <div className="flex flex-col items-center gap-3 pointer-events-none">
                      <UploadCloud size={40} className={file ? "text-blue-500" : "text-slate-400"} />
                      {file ? (
                        <p className="font-semibold text-blue-700 text-sm truncate max-w-[200px]">{file.name}</p>
                      ) : (
                        <p className="text-slate-500 text-sm font-medium">Klik atau drag file ke sini untuk upload</p>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={!file || uploading}
                    className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex justify-center items-center gap-2 ${
                      !file || uploading 
                        ? "bg-slate-300 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Mengunggah...
                      </>
                    ) : (
                      "Kirim Hasil Kerja"
                    )}
                  </button>
                </form>
              </div>
              
            </div>
          )}
        </div>
      </main>
    </div>
  );
}