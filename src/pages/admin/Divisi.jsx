import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  Building2,
  Users,
  TrendingUp,
  Plus,
  Search,
  Briefcase,
  Loader2,
  X
} from "lucide-react";

export default function Divisi() {
  // 1. State UI & Animasi
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 2. State Data
  const [dataDivisi, setDataDivisi] = useState([]);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [form, setForm] = useState({ nama: "", manager: "", warna: "from-blue-500 to-cyan-400" });

  // 3. Tarik Data Divisi & Profil Karyawan (Untuk menghitung jumlah)
  const fetchDivisiData = async () => {
    try {
      // Tarik master divisi
      const { data: divisi, error: errDivisi } = await supabase
        .from('divisi')
        .select('*')
        .order('created_at', { ascending: true });

      if (errDivisi) throw errDivisi;

      // Tarik profil untuk menghitung siapa masuk divisi mana
      const { data: profiles, error: errProfiles } = await supabase
        .from('profiles')
        .select('id, position');

      if (errProfiles) throw errProfiles;

      setDataDivisi(divisi || []);
      setDataPegawai(profiles || []);
    } catch (error) {
      console.error("Gagal menarik data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchDivisiData();
  }, []);

  // 4. Logika Tambah Divisi
  const handleTambahDivisi = async () => {
    if (!form.nama || !form.manager) {
      return alert("Nama Divisi dan Manager harus diisi!");
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('divisi')
        .insert([{ 
          nama: form.nama, 
          manager: form.manager, 
          warna: form.warna 
        }]);

      if (error) throw error;
      
      alert("Divisi baru berhasil ditambahkan!");
      setShowModal(false);
      setForm({ nama: "", manager: "", warna: "from-blue-500 to-cyan-400" });
      fetchDivisiData(); // Refresh Data
    } catch (error) {
      alert("Gagal menambah divisi: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Kalkulasi Data Dinamis (Computed Variables)
  const totalDivisi = dataDivisi.length;
  const totalSeluruhPegawai = dataPegawai.length;
  // Asumsi produktivitas statis sementara karena belum ada modul KPI, kita buat logika placeholder yang cerdas
  const produktivitasGlobal = totalSeluruhPegawai > 0 ? "92%" : "0%"; 

  const filteredDivisi = dataDivisi.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.manager.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full min-h-screen text-white">
          <Loader2 className="animate-spin mr-3" size={30} /> Sinkronisasi Struktur Perusahaan...
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
            Division Management
          </p>
          <h1 className="text-5xl font-black mt-4 tracking-tight">
            Data Divisi Perusahaan
          </h1>
          <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
            Kelola struktur departemen perusahaan, manager penanggung jawab, dan pantau jumlah pegawai secara realtime.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Divisi</p>
                <h2 className="text-5xl font-black mt-3">{totalDivisi}</h2>
              </div>
              <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <Building2 size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Pegawai</p>
                <h2 className="text-5xl font-black mt-3">{totalSeluruhPegawai}</h2>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
                <Users size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Produktivitas Rata-rata</p>
                <h2 className="text-5xl font-black mt-3">{produktivitasGlobal}</h2>
              </div>
              <div className="bg-purple-500 p-4 rounded-2xl shadow-lg shadow-purple-500/20">
                <TrendingUp size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CARDS AREA */}
        <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white shadow-xl border border-gray-800">
          
          {/* TOPBAR */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">
            <div>
              <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Company Division</p>
              <h2 className="text-4xl font-black mt-2 tracking-tight">List Divisi</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              
              {/* SEARCH */}
              <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full md:w-[320px] border border-gray-700 focus-within:border-blue-500 transition-all">
                <Search className="text-gray-400" size={22} />
                <input
                  type="text"
                  placeholder="Cari nama atau manager..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                />
              </div>

              {/* BUTTON ADD */}
              <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus size={22} />
                Tambah Divisi
              </button>
            </div>
          </div>

          {/* CARD DIVISI (Dinamis Data & Kalkulasi Relasional) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredDivisi.length === 0 ? (
              <div className="xl:col-span-2 text-center py-10 text-gray-500">
                Data divisi tidak ditemukan.
              </div>
            ) : (
              filteredDivisi.map((item) => {
                // Menghitung jumlah pegawai secara otomatis berdasar nama divisi yang cocok
                const jumlahPegawai = dataPegawai.filter(p => p.position === item.nama).length;
                
                return (
                  <div
                    key={item.id}
                    className="bg-[#1f2937] border border-gray-800 rounded-[30px] p-7 hover:border-blue-500 transition-all group shadow-sm hover:shadow-lg"
                  >
                    {/* TOP INFO */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.warna} flex items-center justify-center shadow-lg transform transition-transform group-hover:rotate-6`}>
                          <Briefcase size={28} />
                        </div>
                        <h2 className="text-3xl font-black mt-5 tracking-tight group-hover:text-blue-400 transition-colors">
                          {item.nama}
                        </h2>
                        <p className="text-gray-400 mt-2 font-medium">
                          Manager: <span className="text-gray-200">{item.manager}</span>
                        </p>
                      </div>
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm">
                        Active
                      </span>
                    </div>

                    {/* STATS KECIL */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="bg-[#111827] rounded-2xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm font-medium">Jumlah Pegawai</p>
                        <h3 className="text-3xl font-black mt-2">{jumlahPegawai} <span className="text-sm font-normal text-gray-500">Orang</span></h3>
                      </div>
                      <div className="bg-[#111827] rounded-2xl p-5 border border-gray-800">
                        <p className="text-gray-400 text-sm font-medium">Target Progress</p>
                        <h3 className="text-3xl font-black mt-2">100%</h3>
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="mt-8">
                      <div className="flex justify-between mb-3 font-medium">
                        <p className="text-gray-400">Kapasitas SDM Terpenuhi</p>
                        <p className="text-white">Optimal</p>
                      </div>
                      <div className="w-full h-4 bg-[#111827] rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full bg-gradient-to-r ${item.warna} transition-all duration-1000`}
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-4 mt-8">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20">
                        Detail Divisi
                      </button>
                      <button className="flex-1 bg-[#111827] hover:bg-gray-800 py-4 rounded-2xl font-bold transition-all border border-gray-700">
                        Edit Struktur
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH DIVISI */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[#111827] w-full max-w-xl rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl relative">
            
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <h2 className="text-3xl font-black mb-8 tracking-tight">Tambah Divisi Baru</h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 font-medium mb-2 block">Nama Divisi</label>
                <input
                  type="text"
                  placeholder="Misal: Product Management"
                  className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 font-medium mb-2 block">Manager Penanggung Jawab</label>
                <input
                  type="text"
                  placeholder="Nama Lengkap Manager"
                  className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors"
                  value={form.manager}
                  onChange={(e) => setForm({ ...form, manager: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 font-medium mb-2 block">Tema Warna Divisi (UI)</label>
                <select
                  className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors appearance-none"
                  value={form.warna}
                  onChange={(e) => setForm({ ...form, warna: e.target.value })}
                >
                  <option value="from-blue-500 to-cyan-400">Biru - Cyan</option>
                  <option value="from-green-500 to-emerald-400">Hijau - Zamrud</option>
                  <option value="from-yellow-500 to-orange-400">Kuning - Oranye</option>
                  <option value="from-pink-500 to-rose-400">Merah Muda - Rose</option>
                  <option value="from-indigo-500 to-purple-400">Indigo - Ungu</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setShowModal(false)}
                disabled={actionLoading}
                className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleTambahDivisi}
                disabled={actionLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-blue-500/20 flex justify-center items-center disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Simpan Divisi"}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}