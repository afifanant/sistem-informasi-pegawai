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
  Eye,     
  EyeOff,
  Filter
} from "lucide-react";

export default function DataPegawai() {
  const [search, setSearch] = useState("");
  const [filterDivisi, setFilterDivisi] = useState(""); 
  const [pegawai, setPegawai] = useState([]);
  const [daftarDivisi, setDaftarDivisi] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [lihatPasswordTambah, setLihatPasswordTambah] = useState(false);

  // State Modal Edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    username: "", 
    position: "",
    address: "",
    phone: "", 
  });

  // State Modal Tambah Pegawai
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    full_name: "",
    username: "", 
    password: "", 
    position: "",
    address: "",
    phone: "", 
  });

  const fetchPegawaiDanDivisi = async () => {
    setLoading(true);
    try {
      const { data: dataPegawai, error: errorPegawai } = await supabase
        .from('profiles')
        .select('id, full_name, username, position, status, role, address, phone')
        .order('full_name', { ascending: true });

      if (errorPegawai) throw errorPegawai;
      setPegawai(dataPegawai || []);

      const { data: dataDivisi, error: errorDivisi } = await supabase
        .from('divisi')
        .select('nama') 
        .order('nama', { ascending: true });

      if (errorDivisi) throw errorDivisi;
      
      const opsiDivisi = dataDivisi ? dataDivisi.map(d => d.nama) : [];
      setDaftarDivisi(opsiDivisi);

    } catch (error) {
      console.error("Detail Error Sinkronisasi Karyawan:", error.message);
      alert("Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawaiDanDivisi();
  }, []);

  // ==========================================
  // PERBAIKAN MUTLAK: FUNGSI TAMBAH PEGAWAI (MENGGUNAKAN SIGN UP STANDAR)
  // ==========================================
  const handleSimpanBaru = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!addForm.full_name || !addForm.username || !addForm.password) {
      alert("Nama, Username, dan Password wajib diisi!");
      return;
    }
    if (addForm.password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

    setActionLoading(true);
    try {
      const cleanUsername = addForm.username.trim().toLowerCase();
      const generatedEmail = `${cleanUsername}@saadahdinar.internal`;

      // Eksekusi pendaftaran via auth bawaan Supabase agar enkripsi password legal dan aman
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: generatedEmail,
        password: addForm.password,
        options: {
          // Metadata dikirim agar ditangkap oleh Trigger Database `handle_new_user` yang kita buat di Supabase
          data: {
            full_name: addForm.full_name,
            role: "pegawai",
            position: addForm.position || "Belum Ditugaskan",
            address: addForm.address || "-",
            phone: addForm.phone || "-"
          }
        }
      });

      if (signUpError) throw signUpError;

      alert("Pegawai berhasil ditambahkan dan disinkronisasikan!");
      
      setShowAddModal(false);
      setAddForm({ full_name: "", username: "", password: "", position: "", address: "", phone: "" });
      await fetchPegawaiDanDivisi();
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
    setEditForm({
      full_name: item.full_name || "",
      username: item.username || "", 
      position: item.position || "", 
      address: item.address || "",   
      phone: item.phone || "", 
    });
    setShowEditModal(true);
  };

  const handleSimpanEdit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!editForm.full_name || !editForm.username) {
      alert("Nama dan Username tidak boleh kosong!");
      return;
    }

    setActionLoading(true);
    try {
      const cleanUsername = editForm.username.trim().toLowerCase();

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          username: cleanUsername, 
          position: editForm.position,
          address: editForm.address,   
          phone: editForm.phone, 
        })
        .eq('id', selectedId);

      if (error) throw error;
      alert("Data pegawai berhasil diperbarui!");
      setShowEditModal(false);
      await fetchPegawaiDanDivisi(); 
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
    const confirmDelete = window.confirm(`Hapus profil ${nama}?`);
    if (confirmDelete) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
        alert("Profil pegawai berhasil dihapus.");
        await fetchPegawaiDanDivisi();
      } catch (error) {
        alert("Gagal menghapus data: " + error.message);
      }
    }
  };

  // LOGIKA MULTI-FILTER SINKRON
  const filteredPegawai = pegawai.filter((item) => {
    const fullName = (item.full_name || "").toLowerCase();
    const username = (item.username || "").toLowerCase();
    const position = (item.position || "").toLowerCase();
    const address = (item.address || "").toLowerCase();
    const phone = String(item.phone || "").toLowerCase();
    const currentSearch = search.toLowerCase();

    const matchSearch = (
      fullName.includes(currentSearch) ||
      username.includes(currentSearch) ||
      position.includes(currentSearch) ||
      address.includes(currentSearch) ||
      phone.includes(currentSearch)
    );

    const matchDivisi = filterDivisi === "" || position === filterDivisi.toLowerCase();

    return matchSearch && matchDivisi;
  });

  const totalPegawai = pegawai.length;
  const pegawaiAktif = pegawai.filter((item) => (item.status || "").toLowerCase() === "aktif" || !item.status).length;
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
            Kelola data profil, akun login username, dan divisi operasional pegawai secara terpusat.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Pegawai</p>
                <h2 className="text-5xl font-black mt-3">{totalPegawai}</h2>
              </div>
              <div className="bg-blue-500 p-4 rounded-2xl"><Users size={28} /></div>
            </div>
          </div>
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Pegawai Aktif</p>
                <h2 className="text-5xl font-black mt-3">{pegawaiAktif}</h2>
              </div>
              <div className="bg-green-500 p-4 rounded-2xl"><UserCheck size={28} /></div>
            </div>
          </div>
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-transparent">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Divisi</p>
                <h2 className="text-5xl font-black mt-3">{totalDivisi}</h2>
              </div>
              <div className="bg-purple-500 p-4 rounded-2xl"><Briefcase size={28} /></div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white border border-gray-800 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto flex-1">
              <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 flex-1 lg:max-w-[380px] border border-gray-700 focus-within:border-blue-500 transition-all">
                <Search className="text-gray-400" size={22} />
                <input
                  type="text"
                  placeholder="Cari nama, username, alamat..."
                  className="bg-transparent outline-none w-full text-white placeholder-gray-500 font-medium text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="bg-[#1f2937] px-4 py-4 rounded-2xl flex items-center gap-3 border border-gray-700 focus-within:border-blue-500 transition-all lg:w-[240px]">
                <Filter className="text-gray-400 flex-shrink-0" size={18} />
                <select
                  className="bg-transparent outline-none w-full text-slate-200 cursor-pointer text-sm font-semibold appearance-none pr-4"
                  value={filterDivisi}
                  onChange={(e) => setFilterDivisi(e.target.value)}
                >
                  <option value="" className="bg-[#111827] text-gray-400">Semua Divisi</option>
                  {daftarDivisi.map((namaDivisi) => (
                    <option key={namaDivisi} value={namaDivisi} className="bg-[#111827] text-white">
                      {namaDivisi}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={() => {
                setAddForm({ full_name: "", username: "", password: "", position: "", address: "", phone: "" }); 
                setLihatPasswordTambah(false);
                setShowAddModal(true); 
              }}
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg text-sm whitespace-nowrap"
            >
              <Plus size={22} /> Tambah Pegawai Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            {filteredPegawai.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Users className="mx-auto mb-3 opacity-20" size={40} />
                Tidak ada data pegawai yang cocok dengan filter atau kata kunci pencarian.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 text-sm">
                    <th className="pb-5 font-semibold">Nama / Username / HP</th>
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
                        <p className="text-gray-400 mt-1">ID: <span className="text-cyan-400 font-mono">{item.username || "-"}</span></p>
                        <p className="text-blue-400 text-xs mt-0.5">{item.phone || "-"}</p>
                      </td>
                      <td className="py-5 text-gray-300 text-base align-top">{item.position || "Belum Ditugaskan"}</td>
                      <td className="py-5 text-gray-400 max-w-[200px] truncate align-top" title={item.address}>
                        {item.address || "-"}
                      </td>
                      <td className="py-5 align-top">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white p-3 rounded-xl transition-colors border border-blue-500/20"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleHapus(item.id, item.full_name)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white p-3 rounded-xl transition-colors border border-red-500/20"
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
            <div className="bg-[#111827] w-full max-w-2xl rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-5">
                <div className="bg-green-600 p-3 rounded-xl"><UserPlus size={24} /></div>
                <div>
                  <h2 className="text-3xl font-black">Registrasi Pegawai Baru</h2>
                  <p className="text-gray-400 text-sm mt-1">Buat akun login dan profil pegawai sekaligus.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Nama Lengkap *</label>
                    <input type="text" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none text-white border border-transparent focus:border-blue-500"
                      value={addForm.full_name} onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Divisi / Posisi</label>
                    <div className="flex items-center bg-[#1f2937] border border-gray-700 rounded-2xl px-5">
                      <Briefcase size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                      <select 
                        className="w-full bg-transparent py-4 outline-none text-slate-200 cursor-pointer font-medium"
                        value={addForm.position} 
                        onChange={(e) => setAddForm({ ...addForm, position: e.target.value })}
                      >
                        <option value="" className="text-gray-500 bg-[#111827]">-- Pilih Divisi --</option>
                        {daftarDivisi.map((namaDivisi) => (
                          <option key={namaDivisi} value={namaDivisi} className="text-white bg-[#111827]">
                            {namaDivisi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Username Login *</label>
                    <input type="text" placeholder="Contoh: budi" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none text-white border border-transparent focus:border-blue-500"
                      value={addForm.username} onChange={(e) => setAddForm({ ...addForm, username: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Password Sementara *</label>
                    <div className="relative">
                      <input 
                        type={lihatPasswordTambah ? "text" : "password"} 
                        placeholder="Minimal 6 karakter" 
                        className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none pr-14 text-white border border-transparent focus:border-blue-500"
                        value={addForm.password} 
                        onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} 
                      />
                      <button 
                        type="button"
                        onClick={() => setLihatPasswordTambah(!lihatPasswordTambah)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {lihatPasswordTambah ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Nomor HP</label>
                    <input type="text" placeholder="Contoh: 0812" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none text-white border border-transparent focus:border-blue-500"
                      value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Alamat</label>
                    <textarea rows="2" placeholder="Alamat lengkap rumah..." className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none text-white resize-none border border-transparent focus:border-blue-500"
                      value={addForm.address} onChange={(e) => setAddForm({ ...addForm, address: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} disabled={actionLoading} className="flex-1 bg-transparent border border-gray-600 py-4 rounded-2xl font-bold disabled:opacity-50">Batal</button>
                <button type="button" onClick={handleSimpanBaru} disabled={actionLoading} className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold disabled:opacity-50 flex justify-center items-center gap-2">
                  {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Daftarkan Pegawai"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDIT PEGAWAI */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
            <div className="bg-[#111827] w-full max-w-2xl rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-5">
                <div className="bg-blue-600 p-3 rounded-xl"><Pencil size={24} /></div>
                <div>
                  <h2 className="text-3xl font-black">Edit Profil Pegawai</h2>
                  <p className="text-gray-400 text-sm mt-1">Perbarui data personal, username, dan divisi.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Nama Lengkap</label>
                    <input type="text" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none text-white border border-transparent focus:border-blue-500"
                      value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Username Pegawai</label>
                    <input type="text" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none text-white border border-transparent focus:border-blue-500"
                      value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Divisi / Posisi</label>
                    <div className="flex items-center bg-[#1f2937] border border-gray-700 rounded-2xl px-5">
                      <Briefcase size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                      <select 
                        className="w-full bg-transparent py-4 outline-none text-slate-200 cursor-pointer font-medium"
                        value={editForm.position} 
                        onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                      >
                        <option value="" className="text-gray-500 bg-[#111827]">-- Pilih Divisi --</option>
                        {daftarDivisi.map((namaDivisi) => (
                          <option key={namaDivisi} value={namaDivisi} className="text-white bg-[#111827]">
                            {namaDivisi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Nomor HP</label>
                    <input type="text" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none text-white border border-transparent focus:border-blue-500"
                      value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Alamat</label>
                    <textarea rows="2" className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none text-white resize-none border border-transparent focus:border-blue-500"
                      value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowEditModal(false)} disabled={actionLoading} className="flex-1 bg-transparent border border-gray-600 py-4 rounded-2xl font-bold disabled:opacity-50">Batal</button>
                <button type="button" onClick={handleSimpanEdit} disabled={actionLoading} className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold disabled:opacity-50 flex justify-center items-center gap-2">
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