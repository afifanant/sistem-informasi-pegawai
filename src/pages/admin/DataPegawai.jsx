import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  Briefcase,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function DataPegawai() {
  const [search, setSearch] = useState("");
  const [pegawai, setPegawai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // State untuk Modal Edit
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    position: "",
    status: "Aktif",
  });

  // 1. Fetch Data Pegawai dari Database
  const fetchPegawai = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, position, status, role')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setPegawai(data || []);
    } catch (error) {
      console.error("Gagal menarik data pegawai:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // 2. Fungsi Buka Modal Edit
  const handleEditClick = (item) => {
    setSelectedId(item.id);
    setForm({
      full_name: item.full_name || "",
      email: item.email || "",
      position: item.position || "",
      status: item.status || "Aktif",
    });
    setShowModal(true);
  };

  // 3. Fungsi Simpan Perubahan Edit ke Supabase
  const handleSimpanEdit = async () => {
    if (!form.full_name) {
      alert("Nama pegawai tidak boleh kosong!");
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          email: form.email,
          position: form.position,
          status: form.status
        })
        .eq('id', selectedId);

      if (error) throw error;

      alert("Data pegawai berhasil diperbarui!");
      setShowModal(false);
      fetchPegawai(); // Refresh data di tabel
    } catch (error) {
      alert("Gagal memperbarui data: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Fungsi Hapus Pegawai
  const handleHapus = async (id, nama) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus profil ${nama}?`);
    
    if (confirmDelete) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        alert("Profil pegawai berhasil dihapus.");
        fetchPegawai();
      } catch (error) {
        alert("Gagal menghapus data: " + error.message);
      }
    }
  };

  // Alert untuk tombol Tambah Pegawai (Karena ini butuh flow Register Auth)
  const handleTambahPeringatan = () => {
    alert("Untuk menjaga keamanan sistem, pegawai baru harus membuat akun melalui halaman Register perusahaan. Anda bisa mengedit divisi dan status mereka di sini setelah mereka mendaftar.");
  };

  // FILTER SEARCH
  const filteredPegawai = pegawai.filter((item) =>
    (item.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.position || "").toLowerCase().includes(search.toLowerCase())
  );

  // Kalkulasi Statistik
  const totalPegawai = pegawai.length;
  const pegawaiAktif = pegawai.filter((item) => item.status === "Aktif").length;
  
  // Mengambil daftar divisi unik
  const divisiUnik = [...new Set(pegawai.map(item => item.position).filter(Boolean))];
  const totalDivisi = divisiUnik.length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full min-h-screen text-white">
          <Loader2 className="animate-spin mr-3" size={30} /> Sinkronisasi Database Karyawan...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-[fadeIn_0.5s_ease-out]">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl">
          <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">
            Human Resource
          </p>
          <h1 className="text-5xl font-black mt-4 tracking-tight">
            Data Pegawai
          </h1>
          <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
            Kelola data profil, divisi, dan status keaktifan seluruh pegawai perusahaan secara terpusat.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Pegawai</p>
                <h2 className="text-5xl font-black mt-3">{totalPegawai}</h2>
              </div>
              <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                <Users size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Pegawai Aktif</p>
                <h2 className="text-5xl font-black mt-3">{pegawaiAktif}</h2>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20">
                <UserCheck size={28} />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Divisi</p>
                <h2 className="text-5xl font-black mt-3">{totalDivisi}</h2>
              </div>
              <div className="bg-purple-500 p-4 rounded-2xl shadow-lg shadow-purple-500/20">
                <Briefcase size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white border border-gray-800 shadow-xl">
          
          {/* TOP */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            {/* SEARCH */}
            <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[400px] border border-gray-700 focus-within:border-blue-500 transition-all">
              <Search className="text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Cari nama atau divisi..."
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* BUTTON ADD (Dengan peringatan arsitektur) */}
            <button
              onClick={handleTambahPeringatan}
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus size={22} />
              Tambah Pegawai Baru
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            {filteredPegawai.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Belum ada data pegawai.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-5 font-semibold">Nama</th>
                    <th className="pb-5 font-semibold">Email</th>
                    <th className="pb-5 font-semibold">Divisi / Posisi</th>
                    <th className="pb-5 font-semibold">Status</th>
                    <th className="pb-5 font-semibold">Role Sistem</th>
                    <th className="pb-5 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPegawai.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-800 hover:bg-[#1f2937] transition-colors"
                    >
                      <td className="py-5 font-bold text-white">
                        {item.full_name || "Belum Diatur"}
                      </td>
                      <td className="py-5 text-gray-400 text-sm">
                        {item.email || "-"}
                      </td>
                      <td className="py-5 text-gray-300">
                        {item.position || "Belum Ditugaskan"}
                      </td>
                      <td className="py-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            item.status === "Aktif"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : item.status === "Cuti"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {item.status || "Aktif"}
                        </span>
                      </td>
                      <td className="py-5">
                        <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                          {item.role || "pegawai"}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white p-3 rounded-xl transition-colors border border-blue-500/20"
                            title="Edit Data"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handleHapus(item.id, item.full_name)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-colors border border-red-500/20"
                            title="Hapus Profil"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL EDIT (Dirombak dari Modal Tambah) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[#111827] w-full max-w-xl rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl">
              
              <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-5">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Pencil size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black">Edit Pegawai</h2>
                  <p className="text-gray-400 text-sm mt-1">Perbarui informasi divisi dan status kerja.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-400 font-medium mb-2 block">Nama Lengkap</label>
                  <input
                    type="text"
                    className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 font-medium mb-2 block">Email Pegawai</label>
                  <input
                    type="email"
                    className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 font-medium mb-2 block">Divisi / Posisi</label>
                  <input
                    type="text"
                    className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 font-medium mb-2 block">Status Keaktifan</label>
                  <select
                    className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Aktif">Aktif Bekerja</option>
                    <option value="Cuti">Cuti</option>
                    <option value="Resign">Resign / Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={actionLoading}
                  className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSimpanEdit}
                  disabled={actionLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}