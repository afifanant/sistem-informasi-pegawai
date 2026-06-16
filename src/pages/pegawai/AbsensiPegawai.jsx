import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/PegawaiLayout";
import { supabase } from "../../supabaseClient"; 
import {
  CalendarCheck,
  Clock3,
  CheckCircle2,
  MapPin,
  Timer,
  Loader2,
  AlertCircle,
  FileText,
  UploadCloud,
  LocateFixed 
} from "lucide-react";

export default function AbsensiPegawai() {
  // PENGATURAN LOKASI KANTOR (UINSU TUNTUNGAN) & RADIUS
  const KANTOR_LAT = 3.4965;    
  const KANTOR_LNG = 98.5936;   
  const MAKS_RADIUS = 10000;    

  // 1. State Penampung Data
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // State Lokasi
  const [lokasi, setLokasi] = useState(null);
  const [jarak, setJarak] = useState(null);
  const [lokasiLoading, setLokasiLoading] = useState(true);

  // State Validasi Tombol
  const [statusHariIni, setStatusHariIni] = useState(null); 
  const [todayRecordId, setTodayRecordId] = useState(null);

  // State Izin
  const [showModalIzin, setShowModalIzin] = useState(false);
  const [kategoriIzin, setKategoriIzin] = useState("Sakit");
  const [keteranganIzin, setKeteranganIzin] = useState("");
  const [fileBukti, setFileBukti] = useState(null);

  // 2. Fungsi Hitung Jarak (Haversine Formula)
  const hitungJarak = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; 
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Mengubah Koordinat menjadi Nama Alamat via OpenStreetMap
  const dapatkanAlamat = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name || "Alamat tidak ditemukan";
    } catch (error) {
      console.error("Gagal menarik nama jalan:", error);
      return "Koordinat: " + lat + ", " + lng;
    }
  };

  // 3. FUNGSI BARU: Ambil/Refresh Lokasi Pegawai secara Manual & Otomatis
  const fetchLokasiSaatIni = () => {
    setLokasiLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLokasi({ lat: latitude, lng: longitude });
          const jarakMeter = hitungJarak(KANTOR_LAT, KANTOR_LNG, latitude, longitude);
          setJarak(jarakMeter);
          setLokasiLoading(false);
        },
        (error) => {
          console.error("Gagal mendapat lokasi:", error);
          setLokasiLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 0 } 
      );
    } else {
      setLokasiLoading(false);
    }
  };

  useEffect(() => {
    fetchLokasiSaatIni();
  }, []);

  // 4. Mengambil Data Absensi Hari Ini
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
        setTodayRecordId(absenHariIni.id);
        if (absenHariIni.status === "Izin") {
          setStatusHariIni("Izin");
        } else if (absenHariIni.waktu_pulang) {
          setStatusHariIni("Pulang");
        } else if (absenHariIni.status === "Telat") {
          setStatusHariIni("Telat");
        } else {
          setStatusHariIni("Hadir");
        }
      } else {
        setStatusHariIni(null);
      }
    } catch (error) {
      console.error("Gagal mengambil data absensi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAbsensi(); }, []);

  // 5. Eksekusi Hadir / Telat
  const handleHadir = async () => {
    if (jarak > MAKS_RADIUS) {
      return alert(`Jarak Anda ${(jarak/1000).toFixed(1)} km dari kampus. Anda harus berada di dalam radius ${(MAKS_RADIUS/1000)} km untuk absen Hadir!`);
    }

    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const hariIni = new Date().toISOString().split('T')[0];
      
      const sekarang = new Date();
      const jamSekarang = sekarang.toTimeString().split(' ')[0];

      const batasAbsen = new Date();
      batasAbsen.setHours(7, 0, 0, 0);

      let statusAbsen = "Hadir";
      if (sekarang > batasAbsen) {
        statusAbsen = "Telat";
      }
      
      const detailAlamat = await dapatkanAlamat(lokasi.lat, lokasi.lng);

      const { error } = await supabase.from('absensi').insert([
        { 
          user_id: user.id, 
          tanggal: hariIni, 
          waktu_masuk: jamSekarang, 
          status: statusAbsen, 
          lokasi_hadir: detailAlamat,
          lat: lokasi.lat, 
          lng: lokasi.lng 
        }
      ]);
      if (error) throw error;

      if (statusAbsen === "Telat") {
        alert("Absen tercatat, namun Anda Terlambat (Lewat dari jam 07:00)!");
      } else {
        alert("Berhasil Absen Hadir Tepat Waktu!");
      }
      
      fetchAbsensi(); 
    } catch (error) {
      alert("Gagal absen: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 6. Eksekusi Pulang
  const handlePulang = async () => {
    if (jarak > MAKS_RADIUS) {
      return alert("Anda harus berada di dalam jangkauan kampus untuk absen Pulang!");
    }
    
    setActionLoading(true);
    try {
      const jamSekarang = new Date().toTimeString().split(' ')[0];
      const { error } = await supabase.from('absensi')
        .update({ waktu_pulang: jamSekarang })
        .eq('id', todayRecordId);
      if (error) throw error;

      alert("Berhasil Absen Pulang!");
      fetchAbsensi(); 
    } catch (error) {
      alert("Gagal absen pulang: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 7. Eksekusi Izin (Ditambah penyimpanan Waktu Pengajuan Izin)
  const handleIzin = async () => {
    if (!keteranganIzin) return alert("Alasan izin harus diisi!");
    if (lokasiLoading) return alert("Sedang melacak lokasi Anda, mohon tunggu sebentar...");

    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const hariIni = new Date().toISOString().split('T')[0];
      
      // Ambil jam saat ini untuk disimpan ke database
      const jamSekarang = new Date().toTimeString().split(' ')[0];

      let fileUrl = null;

      if (fileBukti) {
        const fileExt = fileBukti.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('bukti_izin') 
          .upload(fileName, fileBukti);

        if (uploadError) throw new Error("Gagal mengupload bukti file: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from('bukti_izin')
          .getPublicUrl(fileName);

        fileUrl = publicUrlData.publicUrl;
      }

      const detailKeterangan = `[${kategoriIzin}] ${keteranganIzin}`;
      let detailAlamat = "Lokasi tidak terdeteksi";
      let izinLat = null;
      let izinLng = null;

      if (lokasi) {
        detailAlamat = await dapatkanAlamat(lokasi.lat, lokasi.lng);
        izinLat = lokasi.lat;
        izinLng = lokasi.lng;
      }

      const { error } = await supabase.from('absensi').insert([
        { 
          user_id: user.id, 
          tanggal: hariIni,
          waktu_masuk: jamSekarang, // <-- JAM IZIN DISIMPAN DI SINI
          status: "Izin", 
          keterangan: detailKeterangan,
          bukti_url: fileUrl,
          lokasi_hadir: detailAlamat, 
          lat: izinLat,
          lng: izinLng 
        }
      ]);
      
      if (error) throw error;

      alert("Pengajuan Izin Berhasil!");
      
      setShowModalIzin(false);
      setKeteranganIzin("");
      setKategoriIzin("Sakit");
      setFileBukti(null);
      fetchAbsensi(); 

    } catch (error) {
      alert("Gagal mengajukan izin: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div className="flex justify-center items-center h-full min-h-screen text-white"><Loader2 className="animate-spin mr-3" size={30} /> Memuat data...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white">
        <p className="uppercase tracking-[5px] text-blue-200 text-sm">Attendance Employee</p>
        <h1 className="text-5xl font-black mt-4">Absensi & Lokasi</h1>
        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Catat kehadiran Anda secara real-time. Jam maksimal masuk adalah pukul 07:00 WIB. Selebihnya sistem akan mencatat Anda terlambat.
        </p>
      </div>

      {/* CARD STATISTIK & LOKASI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-400">Total Kehadiran</p>
              <h2 className="text-5xl font-black mt-2">
                {riwayat.filter(r => r.status === "Hadir" || r.status === "Telat").length}
              </h2>
            </div>
            <div className="bg-green-500/20 p-4 rounded-2xl text-green-400"><CheckCircle2 size={28} /></div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-400">Status Hari Ini</p>
              <h2 className="text-3xl font-black mt-2">
                {statusHariIni === "Hadir" ? "Tepat Waktu" : statusHariIni === "Telat" ? "Terlambat" : statusHariIni === "Pulang" ? "Selesai" : statusHariIni === "Izin" ? "Izin" : "Belum Absen"}
              </h2>
            </div>
            <div className="bg-blue-500/20 p-4 rounded-2xl text-blue-400"><Clock3 size={28} /></div>
          </div>
        </div>

        {/* LOKASI CARD MINI */}
        <div className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 overflow-hidden relative">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400">Jarak ke Kantor</p>
              {lokasiLoading ? (
                <p className="text-lg font-bold mt-2 flex items-center text-yellow-500"><Loader2 className="animate-spin mr-2" size={16}/> Melacak...</p>
              ) : jarak !== null ? (
                <div>
                  <h2 className="text-3xl font-black mt-2">
                    {jarak >= 1000 ? `${(jarak / 1000).toFixed(1)} km` : `${jarak} m`}
                  </h2>
                  <p className={`text-sm mt-1 font-bold ${jarak <= MAKS_RADIUS ? 'text-green-400' : 'text-red-400'}`}>
                    {jarak <= MAKS_RADIUS ? `Dalam Radius (${MAKS_RADIUS/1000} km)` : "Di Luar Jangkauan"}
                  </p>
                </div>
              ) : (
                <p className="text-red-400 mt-2 text-sm font-bold flex items-center"><AlertCircle size={14} className="mr-1"/> Akses Lokasi Ditolak</p>
              )}
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-cyan-500/20 p-4 rounded-2xl text-cyan-400"><MapPin size={28} /></div>
              {/* TOMBOL REFRESH LOKASI MINI */}
              <button 
                onClick={fetchLokasiSaatIni} 
                disabled={lokasiLoading}
                className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-gray-800 hover:bg-gray-700 text-cyan-400 px-3 py-2 rounded-lg transition-all"
                title="Perbarui Titik Lokasi"
              >
                <LocateFixed size={14} className={lokasiLoading ? "animate-pulse" : ""} />
                Titik
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BUTTON ABSENSI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <button 
          onClick={handleHadir}
          disabled={statusHariIni !== null || actionLoading || lokasiLoading}
          className={`rounded-[35px] p-8 text-white transition-all flex flex-col items-center justify-center text-center border-2 
            ${statusHariIni !== null || lokasiLoading
              ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50' 
              : jarak <= MAKS_RADIUS 
                ? 'bg-[#111827] border-green-500 hover:bg-green-600 shadow-[0_0_20px_rgb(34,197,94,0.3)]' 
                : 'bg-[#111827] border-gray-700 opacity-60 cursor-not-allowed'}`}
        >
          {actionLoading ? <Loader2 className="animate-spin text-green-500" size={40} /> : <CalendarCheck className={jarak <= MAKS_RADIUS ? "text-green-500" : "text-gray-500"} size={40} />}
          <h2 className="text-3xl font-black mt-4">Hadir</h2>
        </button>

        <button 
          onClick={handlePulang}
          disabled={(statusHariIni !== "Hadir" && statusHariIni !== "Telat") || actionLoading || lokasiLoading}
          className={`rounded-[35px] p-8 text-white transition-all flex flex-col items-center justify-center text-center border-2
            ${(statusHariIni !== "Hadir" && statusHariIni !== "Telat") || lokasiLoading
              ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50' 
              : jarak <= MAKS_RADIUS
                ? 'bg-[#111827] border-red-500 hover:bg-red-600 shadow-[0_0_20px_rgb(239,68,68,0.3)]'
                : 'bg-[#111827] border-gray-700 opacity-60 cursor-not-allowed'}`}
        >
          {actionLoading ? <Loader2 className="animate-spin text-red-500" size={40} /> : <Timer className={(statusHariIni === "Hadir" || statusHariIni === "Telat") ? "text-red-500" : "text-gray-500"} size={40} />}
          <h2 className="text-3xl font-black mt-4">Pulang</h2>
        </button>

        <button 
          onClick={() => setShowModalIzin(true)}
          disabled={statusHariIni !== null || actionLoading}
          className={`rounded-[35px] p-8 text-white transition-all flex flex-col items-center justify-center text-center border-2
            ${statusHariIni !== null
              ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50' 
              : 'bg-[#111827] border-yellow-500 hover:bg-yellow-600 shadow-[0_0_20px_rgb(234,179,8,0.3)]'}`}
        >
          <FileText className={statusHariIni === null ? "text-yellow-500" : "text-gray-500"} size={40} />
          <h2 className="text-3xl font-black mt-4">Izin</h2>
        </button>
      </div>

      {/* --- PETA LOKASI INTERAKTIF LIVE --- */}
      <div className="bg-[#111827] border border-gray-800 rounded-[35px] p-8 mt-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="text-cyan-400" size={28} />
            <h2 className="text-3xl font-black">Lokasi Saat Ini</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* TOMBOL REFRESH LOKASI UTAMA */}
            <button
              onClick={fetchLokasiSaatIni}
              disabled={lokasiLoading}
              className="bg-gray-800 hover:bg-gray-700 text-cyan-400 px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-700 flex items-center justify-center gap-2 transition-all w-fit disabled:opacity-50"
            >
              {lokasiLoading ? <Loader2 className="animate-spin" size={18}/> : <LocateFixed size={18} />}
              Sesuaikan Titik
            </button>

            {lokasi && (
              <a
                href={`https://www.google.com/maps?q=$${lokasi.lat},${lokasi.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all w-fit"
              >
                Buka di Google Maps
              </a>
            )}
          </div>
        </div>

        {lokasiLoading ? (
          <div className="h-72 bg-gray-800 rounded-2xl animate-pulse flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin text-cyan-400 mb-3" size={32}/>
            Menyesuaikan Koordinat...
          </div>
        ) : lokasi ? (
          <div className="relative w-full h-80 md:h-[400px] rounded-2xl overflow-hidden border border-gray-700 bg-gray-900">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lokasi.lng-0.005},${lokasi.lat-0.005},${lokasi.lng+0.005},${lokasi.lat+0.005}&layer=mapnik&marker=${lokasi.lat},${lokasi.lng}`}
              className="rounded-2xl"
            ></iframe>
          </div>
        ) : (
          <div className="h-72 bg-gray-800 rounded-2xl flex flex-col items-center justify-center text-red-400 font-bold border border-red-500/20">
            <AlertCircle size={40} className="mb-3 opacity-50"/>
            Akses Lokasi Ditolak atau Tidak Ditemukan.
            <span className="text-xs text-gray-500 mt-2 font-normal">Pastikan GPS aktif dan Anda mengizinkan akses lokasi pada browser.</span>
          </div>
        )}
      </div>

      {/* RIWAYAT */}
      <div className="bg-[#111827] border border-gray-800 rounded-[35px] p-8 mt-8 text-white">
        <h2 className="text-3xl font-black mb-6">Riwayat Absensi</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="pb-4 min-w-[100px]">Tanggal</th>
                <th className="pb-4 min-w-[80px]">Hadir</th>
                <th className="pb-4 min-w-[80px]">Pulang</th>
                <th className="pb-4 min-w-[120px]">Status</th>
                <th className="pb-4 min-w-[200px]">Lokasi Absen</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((item) => (
                <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-4 font-semibold">{item.tanggal}</td>
                  <td className="py-4 text-gray-300">{item.waktu_masuk || "-"}</td>
                  <td className="py-4 text-gray-300">{item.waktu_pulang || "-"}</td>
                  <td className="py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 w-fit rounded-lg font-bold text-xs ${
                        item.status === "Hadir" ? "bg-green-500/20 text-green-400" : 
                        item.status === "Telat" ? "bg-red-500/20 text-red-400" : 
                        item.status === "Izin" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-gray-500/20 text-gray-400"
                      }`}>
                        {item.status}
                      </span>
                      {item.keterangan && <span className="text-gray-500 text-xs italic">"{item.keterangan}"</span>}
                    </div>
                  </td>
                  <td className="py-4 text-gray-400 text-xs leading-relaxed max-w-[250px] truncate" title={item.lokasi_hadir || "Tidak ada data"}>
                    {item.lokasi_hadir ? item.lokasi_hadir : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL IZIN DIPERBARUI */}
      {showModalIzin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-5">
          <div className="bg-[#111827] border border-gray-800 w-full max-w-md rounded-[30px] p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Form Pengajuan Izin</h3>
            <p className="text-gray-400 text-sm mb-6">Lengkapi formulir di bawah untuk mengajukan ketidakhadiran.</p>
            
            {/* Kategori Izin */}
            <label className="block text-sm font-semibold mb-2 text-gray-300">Kategori Izin</label>
            <select 
              className="w-full bg-[#1f2937] px-4 py-3 rounded-xl outline-none text-white text-sm mb-4 border border-gray-700 focus:border-yellow-500 transition-colors"
              value={kategoriIzin}
              onChange={(e) => setKategoriIzin(e.target.value)}
            >
              <option value="Sakit">Sakit</option>
              <option value="Cuti">Cuti</option>
              <option value="Keperluan Keluarga">Keperluan Keluarga</option>
              <option value="Dinas Luar">Dinas Luar</option>
              <option value="Lainnya">Lain-lain</option>
            </select>

            {/* Alasan / Detail */}
            <label className="block text-sm font-semibold mb-2 text-gray-300">Penjelasan / Alasan</label>
            <textarea 
              className="w-full bg-[#1f2937] px-4 py-3 rounded-xl outline-none text-white text-sm min-h-[100px] mb-4 border border-gray-700 focus:border-yellow-500 transition-colors"
              placeholder="Contoh: Demam tinggi, perlu istirahat berdasarkan anjuran dokter..."
              value={keteranganIzin}
              onChange={(e) => setKeteranganIzin(e.target.value)}
            />

            {/* Upload Bukti File */}
            <label className="block text-sm font-semibold mb-2 text-gray-300">Bukti Pendukung (Opsional)</label>
            <div className="mb-8 relative group">
              <input 
                type="file" 
                accept="image/*,.pdf"
                onChange={(e) => setFileBukti(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full bg-[#1f2937] border border-gray-700 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center group-hover:border-yellow-500 group-hover:bg-[#374151] transition-all">
                <UploadCloud className={`${fileBukti ? "text-yellow-500" : "text-gray-400"} mb-2`} size={28}/>
                <p className={`text-sm ${fileBukti ? "text-yellow-400 font-semibold" : "text-gray-300"}`}>
                  {fileBukti ? fileBukti.name : "Klik atau seret file ke sini"}
                </p>
                <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, atau PDF (Maks 2MB)</p>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowModalIzin(false);
                  setKategoriIzin("Sakit");
                  setKeteranganIzin("");
                  setFileBukti(null);
                }} 
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleIzin} 
                disabled={actionLoading} 
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 py-3 rounded-xl font-semibold text-black flex justify-center items-center transition-colors shadow-lg shadow-yellow-600/20"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Kirim Izin"}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}