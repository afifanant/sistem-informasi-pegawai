import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; 
import {
  Briefcase,
  Calendar,
  MapPin,
  Loader2,
  AlertCircle
} from "lucide-react";

import SidebarPegawai from "../../components/sidebar/SidebarPegawai"; 
// Kita komentari dulu topbar untuk tes apakah dia penyebab blank screen
// import TopbarPegawai from "../../components/topbar/TopbarPegawai";   

export default function ProjekPegawai() {
  const [projekList, setProjekList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjek = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setLoading(false);
        return;
      }

      // Mengambil data projek dari database Supabase
      const { data, error } = await supabase
        .from("projek")
        .select("*")
        .eq("user_id", user.id)
        .order("tanggal", { ascending: false });

      if (error) throw error;
      setProjekList(data || []);
    } catch (error) {
      console.error("Gagal mengambil data projek:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjek();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {/* 1. SIDEBAR PEGAWAI */}
      <SidebarPegawai />

      {/* 2. KONTEN UTAMA */}
      <main className="flex-1 p-8 text-white">
        
        {/* BANNER HEADER */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white mb-8 shadow-xl mt-4">
          <p className="uppercase tracking-[5px] text-blue-200 text-sm">Employee Projects</p>
          <h1 className="text-5xl font-black mt-4">Projek Saya</h1>
          <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
            Pantau seluruh daftar manajemen projek lapangan yang ditugaskan kepada Anda saat ini. Periksa detail waktu pengerjaan beserta lokasi tempat projek secara berkala.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            <Loader2 className="animate-spin mr-3" size={30} /> Memuat data projek...
          </div>
        ) : projekList.length === 0 ? (
          /* JIKA DATA KOSONG */
          <div className="bg-[#1e293b] border border-gray-800 rounded-[35px] p-16 text-center text-gray-400 flex flex-col items-center justify-center">
            <AlertCircle size={50} className="text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-white">Belum Ada Projek</h3>
            <p className="text-sm mt-1">Anda belum memiliki daftar penugasan projek aktif untuk saat ini.</p>
          </div>
        ) : (
          /* GRID CARDS PROJEK */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projekList.map((projek) => (
              <div 
                key={projek.id} 
                className="bg-[#1e293b] border border-gray-800 hover:border-blue-500/50 transition-all rounded-[35px] p-6 flex flex-col justify-between shadow-xl text-white group"
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Briefcase size={22} />
                    </div>
                    <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      projek.status === "Selesai" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {projek.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black mb-2 truncate" title={projek.nama_projek}>
                    {projek.nama_projek}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {projek.deskripsi || "Tidak ada rincian deskripsi untuk projek ini."}
                  </p>
                </div>

                <div className="border-t border-gray-700/50 pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <Calendar size={16} className="text-blue-400 shrink-0" />
                    <span className="font-medium">{projek.tanggal}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <MapPin size={16} className="text-red-400 shrink-0" />
                    <span className="truncate font-medium" title={projek.tempat}>
                      {projek.tempat}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}