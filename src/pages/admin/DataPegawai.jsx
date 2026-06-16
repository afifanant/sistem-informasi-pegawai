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
  UserPlus,
  Eye,     // Ditambahkan ikon mata untuk show password
  EyeOff   // Ditambahkan ikon mata silang untuk hide password
} from "lucide-react";

export default function DataPegawai() {
  const [search, setSearch] = useState("");
  const [pegawai, setPegawai] = useState([]);
  const [daftarDivisi, setDaftarDivisi] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // State untuk menyembunyikan/melihat password di modal
  const [lihatPasswordEdit, setLihatPasswordEdit] = useState(false);
  const [lihatPasswordTambah, setLihatPasswordTambah] = useState(false);

  // State Modal Edit (Ditambahkan field password, address, phone_number)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    position: "",
    password: "", 
    address: "",
    phone_number: "",
  });

  // State Modal Tambah Pegawai (Ditambahkan field address, phone_number)
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    full_name: "",
    email: "",
    password: "", 
    position: "",
    address: "",
    phone_number: "",
  });

const fetchPegawaiDanDivisi = async () => {
    setLoading(true);
    
    // 1. Tarik Data Pegawai (Tanpa try-catch global agar tidak mematikan fungsi divisi)
    const { data: dataPegawai, error: errorPegawai } = await supabase
      .from('profiles')
      .select('id, full_name, email, position, status, role, password, address, phone_number')
      .order('full_name', { ascending: true });

    if (errorPegawai) {
      console.error("Detail Error Pegawai:", errorPegawai);
      alert("Error dari tabel profiles: " + errorPegawai.message);
    } else {
      setPegawai(dataPegawai || []);
    }

    // 2. Tarik Data Divisi
    const { data: dataDivisi, error: errorDivisi } = await supabase
      .from('divisi')
      .select('*'); // Ambil semua dulu biar aman dari salah nama kolom

    if (errorDivisi) {
      console.error("Detail Error Divisi:", errorDivisi);
      alert("Error dari tabel divisi: " + errorDivisi.message);
    } else {
      // Antisipasi beda nama kolom (nama, name, nama_divisi, dll)
      const opsiDivisi = dataDivisi ? dataDivisi.map(d => d.nama || d.name || d.nama_divisi || d.divisi).filter(Boolean) : [];
      setDaftarDivisi(opsiDivisi);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPegawaiDanDivisi();
  }, []);

  // ==========================================
  // FUNGSI TAMBAH PEGAWAI
  // ==========================================
  const handleSimpanBaru = async () => {
    if (!addForm.full_name || !addForm.email || !addForm.password) {
      alert("Nama, Email, dan Password wajib diisi untuk membuat akun login!");
      return;
    }
    if (addForm.password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

    setActionLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: addForm.email,
        password: addForm.password,
      });

      if (authError) throw authError;
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: addForm.full_name,
            email: addForm.email,
            position: addForm.position,
            password: addForm.password, // Menyimpan plain password ke tabel profiles agar bisa dilihat admin
            address: addForm.address,   // Ditambahkan simpan alamat
            phone_number: addForm.phone_number, // Ditambahkan simpan nomor HP
            role: "pegawai",
            status: "Aktif"
          });

        if (profileError) throw profileError;
      }

      alert("Pegawai berhasil ditambahkan dan sudah bisa login!");
      setShowAddModal(false);
      setAddForm({ full_name: "", email: "", password: "", position: "", address: "", phone_number: "" });
      fetchPegawaiDanDivisi();
    } catch (error) {
      alert("Gagal menambahkan pegawai: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FUNGSI EDIT PEGAWAI
  // ==========================================
  const handleEditClick = (item) => {
    setSelectedId(item.id);
    setLihatPasswordEdit(false); // Reset mata menjadi tersembunyi tiap buka modal baru
    setEditForm({
      full_name: item.full_name || "",
      email: item.email || "",
      position: item.position || "",
      password: item.password || "", // Menampilkan data password lama dari database
      address: item.address || "",   // Menampilkan data alamat lama
      phone_number: item.phone_number || "", // Menampilkan data nomor HP lama
    });
    setShowEditModal(true);
  };

  const handleSimpanEdit = async () => {
    if (!editForm.full_name) {
      alert("Nama pegawai tidak boleh kosong!");
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          email: editForm.email,
          position: editForm.position,
          password: editForm.password, // Menyimpan kembali jika password ikut diubah admin
          address: editForm.address,   // Menyimpan kembali data alamat
          phone_number: editForm.phone_number, // Menyimpan kembali data nomor HP
        })
        .eq('id', selectedId);

      if (error) throw error;
      alert("Data pegawai berhasil diperbarui!");
      setShowEditModal(false);
      fetchPegawaiDanDivisi(); 
    } catch (error) {
      alert("Gagal memperbarui data: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FUNGSI HAPUS PEGAWAI
  // ==========================================
  const handleHapus = async (id, nama) => {
    const confirmDelete = window.confirm(`PERINGATAN: Menghapus profil ${nama} di sini hanya menghapus data profil, akun login mereka di Supabase Auth mungkin masih tertinggal. Lanjutkan?`);
    if (confirmDelete) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
        alert("Profil pegawai berhasil dihapus.");
        fetchPegawaiDanDivisi();
      } catch (error) {
        alert("Gagal menghapus data: " + error.message);
      }
    }
  };

  const filteredPegawai = pegawai.filter((item) =>
    (item.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.position || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.address || "").toLowerCase().includes(search.toLowerCase()) ||
    // PERBAIKAN: Dibungkus String() agar tidak error jika format di db adalah number
    String(item.phone_number || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPegawai = pegawai.length;
  const pegawaiAktif = pegawai.filter((item) => item.status === "Aktif").length;
  const totalDivisi = [...new Set(pegawai.map(item => item.position).filter(Boolean))].length;

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
          <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">Human Resource</p>
          <h1 className="text-5xl font-black mt-4 tracking-tight">Data Pegawai</h1>
          <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
            Kelola data profil dan divisi operasional pegawai secara terpusat.
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
              <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20"><Users size={28} /></div>
            </div>
          </div>
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Pegawai Aktif</p>
                <h2 className="text-5xl font-black mt-3">{pegawaiAktif}</h2>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/20"><UserCheck size={28} /></div>
            </div>
          </div>
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent hover:border-gray-800 transition-all">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Divisi</p>
                <h2 className="text-5xl font-black mt-3">{totalDivisi}</h2>
              </div>
              <div className="bg-purple-500 p-4 rounded-2xl shadow-lg shadow-purple-500/20"><Briefcase size={28} /></div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white border border-gray-800 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[400px] border border-gray-700 focus-within:border-blue-500 transition-all">
              <Search className="text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Cari nama, divisi, alamat, hp..."
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => {
                setAddForm({ full_name: "", email: "", password: "", position: "", address: "", phone_number: "" }); 
                setLihatPasswordTambah(false);
                setShowAddModal(true); 
              }}
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus size={22} /> Tambah Pegawai Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            {filteredPegawai.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Belum ada data pegawai.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 text-sm">
                    <th className="pb-5 font-semibold">Nama / Email / HP</th>
                    <th className="pb-5 font-semibold">Divisi / Posisi</th>
                    <th className="pb-5 font-semibold">Alamat</th>
                    <th className="pb-5 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredPegawai.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800 hover:bg-[#1f2937] transition-colors">
                      <td className="py-5">
                        <p className="font-bold text-white text-base">{item.full_name || "Belum Diatur"}</p>
                        <p className="text-gray-400 mt-1">{item.email || "-"}</p>
                        <p className="text-blue-400 text-xs mt-0.5">{item.phone_number || "-"}</p>
                      </td>
                      {/* PERBAIKAN: vertical-top diganti ke align-top */}
                      <td className="py-5 text-gray-300 text-base align-top">{item.position || "Belum Ditugaskan"}</td>
                      <td className="py-5 text-gray-400 max-w-[200px] truncate align-top" title={item.address}>
                        {item.address || "-"}
                      </td>
                      <td className="py-5 align-top">
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
                            className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white p-3 rounded-xl transition-colors border border-red-500/20"
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

        {/* MODAL TAMBAH PEGAWAI BARU */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[#111827] w-full max-w-2xl rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-5">
                <div className="bg-green-600 p-3 rounded-xl"><UserPlus size={24} /></div>
                <div>
                  <h2 className="text-3xl font-black">Registrasi Pegawai Baru</h2>
                  <p className="text-gray-400 text-sm mt-1">Buat akun login dan profil pegawai sekaligus.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl text-blue-300 text-sm mb-4">
                  Pastikan memberikan password ini kepada pegawai agar mereka bisa login ke sistem SIMPEG.
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Nama Lengkap *</label>
                    <input type="text" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors text-white"
                      value={addForm.full_name} onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Divisi / Posisi</label>
                    <select 
                      className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors appearance-none cursor-pointer text-white"
                      value={addForm.position} 
                      onChange={(e) => setAddForm({ ...addForm, position: e.target.value })}
                    >
                      <option value="">-- Pilih Divisi --</option>
                      {/* PERBAIKAN: Menggunakan properti unik (divisi) sebagai key */}
                      {daftarDivisi.map((divisi) => (
                        <option key={divisi} value={divisi}>{divisi}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Email Login *</label>
                    <input type="email" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors text-white"
                      value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Password Sementara *</label>
                    <div className="relative">
                      <input 
                        type={lihatPasswordTambah ? "text" : "password"} 
                        placeholder="Minimal 6 karakter" 
                        className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors pr-14 text-white"
                        value={addForm.password} 
                        onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} 
                      />
                      <button 
                        type="button"
                        onClick={() => setLihatPasswordTambah(!lihatPasswordTambah)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {lihatPasswordTambah ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Nomor HP</label>
                    <input type="text" placeholder="Contoh: 08123456789" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors text-white"
                      value={addForm.phone_number} onChange={(e) => setAddForm({ ...addForm, phone_number: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Alamat</label>
                    <textarea rows="2" placeholder="Alamat lengkap rumah..." className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors text-white resize-none"
                      value={addForm.address} onChange={(e) => setAddForm({ ...addForm, address: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowAddModal(false)} disabled={actionLoading} className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50">Batal</button>
                <button onClick={handleSimpanBaru} disabled={actionLoading} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50 flex justify-center items-center gap-2">
                  {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Daftarkan Pegawai"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDIT PEGAWAI */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[#111827] w-full max-w-2xl rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-5">
                <div className="bg-blue-600 p-3 rounded-xl"><Pencil size={24} /></div>
                <div>
                  <h2 className="text-3xl font-black">Edit Profil Pegawai</h2>
                  <p className="text-gray-400 text-sm mt-1">Perbarui data personal dan divisi.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Nama Lengkap</label>
                    <input type="text" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors text-white"
                      value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Email Pegawai</label>
                    <input type="email" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors text-white"
                      value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Divisi / Posisi</label>
                    <select 
                      className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors appearance-none cursor-pointer text-white"
                      value={editForm.position} 
                      onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    >
                      <option value="">-- Pilih Divisi --</option>
                      {/* PERBAIKAN: Menggunakan properti unik (divisi) sebagai key */}
                      {daftarDivisi.map((divisi) => (
                        <option key={divisi} value={divisi}>{divisi}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Password Pegawai</label>
                    <div className="relative">
                      <input 
                        type={lihatPasswordEdit ? "text" : "password"} 
                        className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors pr-14 text-white font-medium placeholder-gray-500"
                        placeholder="Belum diset"
                        value={editForm.password || ""} 
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} 
                      />
                      <button 
                        type="button"
                        onClick={() => setLihatPasswordEdit(!lihatPasswordEdit)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {lihatPasswordEdit ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Nomor HP</label>
                    <input type="text" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors text-white"
                      value={editForm.phone_number} onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Alamat</label>
                    <textarea rows="2" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-colors text-white resize-none"
                      value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowEditModal(false)} disabled={actionLoading} className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 py-4 rounded-2xl font-bold transition-colors disabled:opacity-50">Batal</button>
                <button onClick={handleSimpanEdit} disabled={actionLoading} className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex justify-center items-center gap-2">
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