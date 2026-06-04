import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/PegawaiLayout";
import { supabase } from "../../supabaseClient";
import {
  Briefcase,
  Clock3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2
} from "lucide-react";

export default function TugasSaya() {
  // 1. State Animasi & Loading
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 2. State Data
  const [tugasList, setTugasList] = useState([]);

  // 3. Menarik Data dari Supabase
  const fetchTugas = async () => {
    try {
      // Menarik data dari tabel 'tugas' yang sudah lu buat sebelumnya
      const { data, error } = await supabase
        .from('tugas')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setTugasList(data || []);
    } catch (error) {
      console.error("Gagal menarik data tugas:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchTugas();
  }, []);

  // 4. Kalkulasi Statistik Dinamis (Computed Variables)
  const totalTugas = tugasList.length;
  const tugasSelesai = tugasList.filter(item => item.status === "Selesai").length;
  // Menghindari pembagian dengan nol (NaN) jika array kosong
  const persentaseProgress = totalTugas === 0 ? 0 : Math.round((tugasSelesai / totalTugas) * 100);

  // Cek apakah ada tugas yang "Progress" atau "Pending" untuk logika Alert
  const adaTugasMendesak = tugasList.some(item => item.status === "Progress" || item.status === "Pending");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full min-h-screen text-white">
          <Loader2 className="animate-spin mr-3" size={30} /> Memuat data tugas...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Transisi masuk seragam */}
      <div className={`transform transition-all duration-1000 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}>
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl">
          <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">
            Employee Task
          </p>
          <h1 className="text-5xl font-black mt-4 tracking-tight">
            Tugas Saya
          </h1>
          <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
            Pantau dan kelola seluruh pekerjaan Anda secara modern. Data tersinkronisasi langsung dengan sistem pusat.
          </p>
        </div>

        {/* STATS (Dinamis) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          
          <div className="bg-[#111827] rounded-[35px] p-8 text-white transition-all duration-300 hover:shadow-blue-500/10 border border-transparent hover:border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Tugas</p>
                <h2 className="text-5xl font-black mt-4">{totalTugas}</h2>
              </div>
              <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <Briefcase size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[35px] p-8 text-white transition-all duration-300 hover:shadow-green-500/10 border border-transparent hover:border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Selesai</p>
                <h2 className="text-5xl font-black mt-4">{tugasSelesai}</h2>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
                <CheckCircle2 size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[35px] p-8 text-white transition-all duration-300 hover:shadow-purple-500/10 border border-transparent hover:border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Progress</p>
                <h2 className="text-5xl font-black mt-4">{persentaseProgress}%</h2>
              </div>
              <div className="bg-purple-500 p-4 rounded-2xl shadow-lg shadow-purple-500/20">
                <TrendingUp size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* TASK LIST (Mapping Data Asli) */}
        <div className="space-y-6 mt-8">
          {tugasList.length === 0 ? (
             <div className="bg-[#111827] rounded-[35px] p-14 text-center text-gray-400 border border-gray-800">
               Belum ada tugas yang diberikan kepada Anda.
             </div>
          ) : (
            tugasList.map((item) => (
              <div
                key={item.id}
                className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 transition-all duration-300 hover:bg-[#151f32] hover:border-gray-700 group"
              >
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-4 text-gray-400 font-medium">
                      <Clock3 size={18} className="text-blue-500" />
                      Deadline: {item.deadline}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-5 py-3 rounded-full font-bold text-sm shadow-sm ${
                        item.status === "Selesai"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : item.status === "Progress"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {item.status}
                    </span>

                    <button className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/20">
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ALERT (Tampil Dinamis) */}
        {adaTugasMendesak && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-[35px] p-8 mt-8 text-white shadow-lg shadow-orange-500/10 animate-[pulse_3s_ease-in-out_infinite]">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-sm">
                <AlertCircle size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black">
                  Perhatian: Tugas Menunggu
                </h2>
                <p className="mt-3 text-yellow-100 font-medium">
                  Anda memiliki tugas yang masih berstatus Progress atau Pending. Harap perhatikan deadline.
                </p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </DashboardLayout>
  );
}