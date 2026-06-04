import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/PegawaiLayout";
import { supabase } from "../../supabaseClient"; 
import {
  CalendarCheck,
  Clock3,
  CheckCircle2,
  MapPin,
  Timer,
  Loader2
} from "lucide-react";

export default function AbsensiPegawai() {
  // 1. State Penampung Data
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // State Validasi Tombol
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [hasCheckedOutToday, setHasCheckedOutToday] = useState(false);
  const [todayRecordId, setTodayRecordId] = useState(null);

  // 2. Mengambil Data Saat Halaman Dimuat
  const fetchAbsensi = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('absensi')
        .select('*')
        .eq('user_id', user.id)
        .order('tanggal', { ascending: false });

      if (error) throw error;
      
      setRiwayat(data || []);

      const hariIni = new Date().toISOString().split('T')[0]; 
      const absenHariIni = data?.find(item => item.tanggal === hariIni);

      if (absenHariIni) {
        setHasCheckedInToday(true);
        setTodayRecordId(absenHariIni.id);
        if (absenHariIni.waktu_pulang) {
          setHasCheckedOutToday(true);
        }
      }

    } catch (error) {
      console.error("Gagal mengambil data absensi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensi();
  }, []);

  // 3. Fungsi Eksekusi Check In
  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User tidak ditemukan");

      // FIX LOGIKA WAKTU: Menggunakan standar ISO agar formatnya pasti HH:MM:SS (dengan titik dua)
      const now = new Date();
      const hariIni = now.toISOString().split('T')[0];
      // toTimeString() akan menghasilkan string seperti "07:07:24 GMT+0700...", lalu kita potong di spasi pertama
      const jamSekarang = now.toTimeString().split(' ')[0]; 

      const { error } = await supabase
        .from('absensi')
        .insert([
          { 
            user_id: user.id, 
            tanggal: hariIni, 
            waktu_masuk: jamSekarang, 
            status: "Hadir" 
          }
        ]);

      if (error) throw error;

      alert("Berhasil Check In!");
      fetchAbsensi(); 

    } catch (error) {
      alert("Gagal Check In: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Fungsi Eksekusi Check Out
  const handleCheckOut = async () => {
    if (!todayRecordId) return alert("Anda belum Check In hari ini!");
    
    setActionLoading(true);
    try {
      // FIX LOGIKA WAKTU: Menggunakan standar ISO agar formatnya pasti HH:MM:SS
      const jamSekarang = new Date().toTimeString().split(' ')[0];

      const { error } = await supabase
        .from('absensi')
        .update({ waktu_pulang: jamSekarang })
        .eq('id', todayRecordId);

      if (error) throw error;

      alert("Berhasil Check Out!");
      fetchAbsensi(); 

    } catch (error) {
      alert("Gagal Check Out: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full min-h-screen text-white">
          <Loader2 className="animate-spin mr-3" size={30} /> Memuat data absensi...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white">
        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Attendance Employee
        </p>
        <h1 className="text-5xl font-black mt-4">Absensi Saya</h1>
        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Kelola absensi dan pantau kehadiran kerja Anda secara realtime yang tersinkronisasi dengan database.
        </p>
      </div>

      {/* CARD STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#111827] rounded-[35px] p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Total Kehadiran</p>
              <h2 className="text-5xl font-black mt-4">{riwayat.length}</h2>
            </div>
            <div className="bg-green-500 p-4 rounded-2xl">
              <CheckCircle2 size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[35px] p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Status Hari Ini</p>
              <h2 className="text-3xl font-black mt-4">
                {hasCheckedInToday ? (hasCheckedOutToday ? "Selesai" : "Bekerja") : "Belum Absen"}
              </h2>
            </div>
            <div className="bg-blue-500 p-4 rounded-2xl">
              <Clock3 size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[35px] p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Lokasi Sistem</p>
              <h2 className="text-2xl font-black mt-4">Kantor Pusat</h2>
            </div>
            <div className="bg-cyan-500 p-4 rounded-2xl">
              <MapPin size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* BUTTON ABSENSI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* Tombol Check In */}
        <button 
          onClick={handleCheckIn}
          disabled={hasCheckedInToday || actionLoading}
          className={`rounded-[35px] p-10 text-white transition-all flex flex-col items-center justify-center text-center
            ${hasCheckedInToday 
              ? 'bg-gray-700 cursor-not-allowed opacity-50' 
              : 'bg-green-600 hover:bg-green-700 hover:scale-[1.02] shadow-[0_10px_20px_rgb(22,163,74,0.2)]'
            }`}
        >
          {actionLoading ? <Loader2 className="animate-spin" size={50} /> : <CalendarCheck size={50} />}
          <h2 className="text-4xl font-black mt-6">
            {hasCheckedInToday ? "Sudah Check In" : "Check In"}
          </h2>
          <p className="mt-4 text-green-100">
            {hasCheckedInToday ? "Anda sudah mencatat kehadiran hari ini" : "Catat waktu masuk kerja hari ini"}
          </p>
        </button>

        {/* Tombol Check Out */}
        <button 
          onClick={handleCheckOut}
          disabled={!hasCheckedInToday || hasCheckedOutToday || actionLoading}
          className={`rounded-[35px] p-10 text-white transition-all flex flex-col items-center justify-center text-center
            ${(!hasCheckedInToday || hasCheckedOutToday)
              ? 'bg-gray-700 cursor-not-allowed opacity-50' 
              : 'bg-red-600 hover:bg-red-700 hover:scale-[1.02] shadow-[0_10px_20px_rgb(220,38,38,0.2)]'
            }`}
        >
          {actionLoading ? <Loader2 className="animate-spin" size={50} /> : <Timer size={50} />}
          <h2 className="text-4xl font-black mt-6">
            {hasCheckedOutToday ? "Sudah Check Out" : "Check Out"}
          </h2>
          <p className="mt-4 text-red-100">
            {!hasCheckedInToday ? "Harus Check In terlebih dahulu" : hasCheckedOutToday ? "Tugas hari ini selesai" : "Catat waktu pulang kerja hari ini"}
          </p>
        </button>
      </div>

      {/* RIWAYAT (Dinamis dari Database) */}
      <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white">
        <div className="mb-8">
          <p className="uppercase tracking-[4px] text-gray-400 text-sm">Attendance History</p>
          <h2 className="text-4xl font-black mt-2">Riwayat Absensi</h2>
        </div>

        <div className="overflow-x-auto">
          {riwayat.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Belum ada riwayat absensi.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-left text-gray-400">
                  <th className="pb-5 font-semibold">Tanggal</th>
                  <th className="pb-5 font-semibold">Jam Masuk</th>
                  <th className="pb-5 font-semibold">Jam Pulang</th>
                  <th className="pb-5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {riwayat.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800 hover:bg-[#1f2937] transition-colors">
                    <td className="py-5 font-medium">{item.tanggal}</td>
                    <td className="py-5">{item.waktu_masuk || "-"}</td>
                    <td className="py-5">{item.waktu_pulang || "-"}</td>
                    <td className="py-5">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                        item.status === "Hadir" ? "bg-green-500/20 text-green-400 border border-green-500/20" : 
                        "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </DashboardLayout>
  );
}