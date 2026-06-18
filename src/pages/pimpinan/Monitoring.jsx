import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import PimpinanLayout from "../../layouts/PimpinanLayout";
import { supabase } from "../../supabaseClient";
import {
  Plus, Search, Pencil, Trash2, Users, UserCheck, 
  Briefcase, Loader2, UserPlus, Eye, EyeOff, Filter
} from "lucide-react";

export default function DataPegawai() {
  const [currentUserRole, setCurrentUserRole] = useState("admin");
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
    full_name: "", username: "", position: "", address: "", phone: "", role: "pegawai"
  });

  // State Modal Tambah
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    full_name: "", username: "", password: "", position: "", address: "", phone: "", role: "pegawai"
  });

  const initData = async () => {
    setLoading(true);
    try {
      // 1. CEK SIAPA YANG SEDANG LOGIN
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data: myProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .maybeSingle();
          
        if (myProfile) {
          setCurrentUserRole(myProfile.role);
        }
      }

      // 2. TARIK DATA PEGAWAI (PERBAIKAN: Membuang kolom email & password yang tidak eksis)
      const { data: dataPegawai, error: errorPegawai } = await supabase
        .from('profiles')
        .select('id, full_name, username, position, status, role, address, phone')
        .order('full_name', { ascending: true });

      if (errorPegawai) throw errorPegawai;
      setPegawai(dataPegawai || []);

      // 3. TARIK DATA DIVISI
      const { data: dataDivisi, error: errorDivisi } = await supabase
        .from('divisi')
        .select('nama')
        .order('nama', { ascending: true }); 

      if (errorDivisi) throw errorDivisi;
      const opsiDivisi = dataDivisi ? dataDivisi.map(d => d.nama) : [];
      setDaftarDivisi(opsiDivisi);

    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal menarik data skema: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  // ==========================================
  // FUNGSI CRUD TAMBAH PEGAWAI (RPC)
  // ==========================================
  const handleSimpanBaru = async (e) => {
    e.preventDefault();
    if (!addForm.full_name || !addForm.username || !addForm.password) {
      alert("Nama, Username, dan Password wajib diisi!");
      return;
    }
    if (addForm.password.length < 6) {
      alert("Password sementara minimal 6 karakter!");
      return;
    }

    setActionLoading(true);
    try {
      const cleanUsername = addForm.username.trim().toLowerCase();
      const generatedEmail = `${cleanUsername}@saadahdinar.internal`;

      // Memanggil RPC create_pegawai_baru yang sudah lu buat di PostgreSQL Supabase
      const { data, error } = await supabase.rpc('create_pegawai_baru', {
        p_full_name: addForm.full_name,
        p_username: cleanUsername,
        p_email: generatedEmail, 
        p_password: addForm.password,
        p_position: addForm.position || "Belum Ditugaskan", 
        p_address: addForm.address || "-",
        p_phone: addForm.phone || "-"
      });

      if (error) throw error;
      if (data && data.status === 'error') throw new Error(data.message);

      alert("Akun pegawai baru berhasil di-registrasi!");
      setShowAddModal(false);
      setAddForm({ full_name: "", username: "", password: "", position: "", address: "", phone: "", role: "pegawai" });
      initData();
    } catch (error) {
      alert("Gagal menambah pegawai: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FUNGSI CRUD EDIT PEGAWAI
  // ==========================================
  const handleEditClick = (item) => {
    setSelectedId(item.id);
    setEditForm({
      full_name: item.full_name || "",
      username: item.username || "",
      position: item.position || "",
      address: item.address || "",
      phone: item.phone || "",
      role: item.role || "pegawai"
    });
    setShowEditModal(true);
  };

  const handleSimpanEdit = async (e) => {
    e.preventDefault();
    if (!editForm.full_name || !editForm.username) {
      alert("Nama dan Username wajib diisi!");
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          username: editForm.username.trim().toLowerCase(),
          position: editForm.position,
          address: editForm.address,
          phone: editForm.phone,
          role: editForm.role
        })
        .eq('id', selectedId);

      if (error) throw error;

      alert("Profil pegawai berhasil diperbarui!");
      setShowEditModal(false);
      initData();
    } catch (error) {
      alert("Gagal memperbarui data: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // FUNGSI CRUD HAPUS PEGAWAI
  // ==========================================
  const handleHapus = async (id, nama) => {
    if (!window.confirm(`Hapus permanen profil "${nama}" dari sistem?`)) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      alert("Data profil berhasil dihapus.");
      initData();
    } catch (error) {
      alert("Gagal menghapus data: " + error.message);
    }
  };

  // MULTI FILTER: Filter Pencarian Global Teks + Dropdown Divisi
  const filteredPegawai = pegawai.filter((item) => {
    const currentSearch = search.toLowerCase();
    const matchSearch = (
      (item.full_name || "").toLowerCase().includes(currentSearch) ||
      (item.username || "").toLowerCase().includes(currentSearch) ||
      (item.position || "").toLowerCase().includes(currentSearch) ||
      (item.address || "").toLowerCase().includes(currentSearch) ||
      (item.role || "").toLowerCase().includes(currentSearch)
    );

    const matchDivisi = filterDivisi === "" || (item.position || "").toLowerCase() === filterDivisi.toLowerCase();

    return matchSearch && matchDivisi;
  });

  const totalPegawai = pegawai.length;
  const pegawaiAktif = pegawai.filter((item) => item.status === "Aktif" || !item.status).length;
  const totalDivisi = [...new Set(pegawai.map(item => item.position).filter(Boolean))].length;

  const LayoutWrapper = currentUserRole === "pimpinan" ? PimpinanLayout : AdminLayout;

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex justify-center items-center h-full min-h-screen text-white bg-[#0b0f19]">
          <Loader2 className="animate-spin mr-3" size={30} /> Sinkronisasi Database Karyawan...
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="animate-[fadeIn_0.5s_ease-out] p-8 bg-[#0b0f19] min-h-screen">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl border border-blue-900/30">
          <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">Human Resource</p>
          <h1 className="text-5xl font-black mt-4 tracking-tight">Data Pegawai & Pimpinan</h1>
          <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
            {currentUserRole === "pimpinan" 
              ? "Pantau data profil, divisi operasional, dan hak akses anggota secara terpusat." 
              : "Kelola data profil, divisi operasional, dan hak akses (Role) secara terpusat."}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Akun</p>
                <h2 className="text-5xl font-black mt-3">{totalPegawai}</h2>
              </div>
              <div className="bg-blue-500/10 text-blue-400 p-4 rounded-2xl border border-blue-500/20"><Users size={28} /></div>
            </div>
          </div>
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Akun Aktif</p>
                <h2 className="text-5xl font-black mt-3">{pegawaiAktif}</h2>
              </div>
              <div className="bg-green-500/10 text-green-400 p-4 rounded-2xl border border-green-500/20"><UserCheck size={28} /></div>
            </div>
          </div>
          <div className="bg-[#111827] rounded-[30px] p-7 text-white shadow-lg border border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-medium">Total Divisi</p>
                <h2 className="text-5xl font-black mt-3">{totalDivisi}</h2>
              </div>
              <div className="bg-purple-500/10 text-purple-400 p-4 rounded-2xl border border-purple-500/20"><Briefcase size={28} /></div>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white border border-gray-800 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto flex-1">
              {/* CARI DATA */}
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

              {/* DROPDOWN FILTER DIVISI */}
              <div className="bg-[#1f2937] px-4 py-4 rounded-2xl flex items-center gap-3 border border-gray-700 focus-within:border-blue-500 transition-all lg:w-[240px]">
                <Filter className="text-gray-400 flex-shrink-0" size={18} />
                <select
                  className="bg-transparent outline-none w-full text-slate-200 cursor-pointer text-sm font-semibold"
                  value={filterDivisi}
                  onChange={(e) => setFilterDivisi(e.target.value)}
                >
                  <option value="" className="bg-[#111827] text-gray-400">Semua Divisi</option>
                  {daftarDivisi.map((divisi) => (
                    <option key={divisi} value={divisi} className="bg-[#111827] text-white">{divisi}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {currentUserRole !== "pimpinan" && (
              <button
                onClick={() => {
                  setAddForm({ full_name: "", username: "", password: "", position: "", address: "", phone: "", role: "pegawai" }); 
                  setLihatPasswordTambah(false);
                  setShowAddModal(true); 
                }}
                className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap text-sm"
              >
                <Plus size={22} /> Tambah Akun Baru
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            {filteredPegawai.length === 0 ? (
              <div className="text-center py-16 text-gray-500">Belum ada data karyawan terdaftar.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 text-sm">
                    <th className="pb-5 font-semibold">Nama / ID Login / HP</th>
                    <th className="pb-5 font-semibold">Divisi & Hak Akses</th>
                    <th className="pb-5 font-semibold">Alamat Rumah</th>
                    {currentUserRole !== "pimpinan" && <th className="pb-5 text-center font-semibold">Action</th>}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredPegawai.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800 hover:bg-[#1f2937]/50 transition-colors">
                      <td className="py-5">
                        <p className="font-bold text-white text-base">{item.full_name || "Belum Diatur"}</p>
                        <p className="text-gray-400 mt-1">Username: <span className="text-cyan-400 font-mono">{item.username || "-"}</span></p>
                        <p className="text-blue-400 text-xs mt-0.5">{item.phone || "-"}</p>
                      </td>
                      <td className="py-5 align-top">
                        <p className="text-gray-300 text-base font-semibold">{item.position || "Belum Ditugaskan"}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-md text-xs font-bold uppercase ${item.role === 'pimpinan' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : item.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="py-5 text-gray-400 max-w-[200px] truncate align-top" title={item.address}>
                        {item.address || "-"}
                      </td>
                      
                      {currentUserRole !== "pimpinan" && (
                        <td className="py-5 align-top">
                          <div className="flex justify-center gap-3">
                            <button onClick={() => handleEditClick(item)} className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white p-3 rounded-xl transition-colors border border-blue-500/20">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleHapus(item.id, item.full_name)} className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white p-3 rounded-xl transition-colors border border-red-500/20">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL TAMBAH BARU */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
            <form onSubmit={handleSimpanBaru} className="bg-[#111827] w-full max-w-2xl rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-black mb-6">Registrasi Akun Baru</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Nama Lengkap *</label>
                    <input type="text" className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white" value={addForm.full_name} onChange={(e) => setAddForm({...addForm, full_name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Username Akses *</label>
                    <input type="text" placeholder="Cth: budi" className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white" value={addForm.username} onChange={(e) => setAddForm({...addForm, username: e.target.value})} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Password Sementara *</label>
                    <div className="relative">
                      <input type={lihatPasswordTambah ? "text" : "password"} className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white pr-12" value={addForm.password} onChange={(e) => setAddForm({...addForm, password: e.target.value})} required />
                      <button type="button" onClick={() => setLihatPasswordTambah(!lihatPasswordTambah)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {lihatPasswordTambah ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Divisi Penempatan</label>
                    <select className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white cursor-pointer" value={addForm.position} onChange={(e) => setAddForm({...addForm, position: e.target.value})}>
                      <option value="">-- Pilih Divisi --</option>
                      {daftarDivisi.map(d => <option key={divisi} value={d} className="bg-[#111827]">{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Nomor HP</label>
                  <input type="text" className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white" value={addForm.phone} onChange={(e) => setAddForm({...addForm, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Alamat Rumah</label>
                  <textarea rows="2" className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white resize-none" value={addForm.address} onChange={(e) => setAddForm({...addForm, address: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-800 py-4 rounded-xl font-bold">Batal</button>
                <button type="submit" disabled={actionLoading} className="flex-1 bg-blue-600 py-4 rounded-xl font-bold flex justify-center items-center">
                  {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Simpan Akun"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL EDIT */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
            <form onSubmit={handleSimpanEdit} className="bg-[#111827] w-full max-w-2xl rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-black mb-6">Perbarui Profil Pegawai</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Nama Lengkap *</label>
                    <input type="text" className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white" value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Username Karyawan *</label>
                    <input type="text" className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white" value={editForm.username} onChange={(e) => setEditForm({...editForm, username: e.target.value})} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Divisi / Posisi</label>
                    <select className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white cursor-pointer" value={editForm.position} onChange={(e) => setEditForm({...editForm, position: e.target.value})}>
                      <option value="">-- Pilih Divisi --</option>
                      {daftarDivisi.map(d => <option key={divisi} value={d} className="bg-[#111827]">{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Hak Akses Sistem (Role)</label>
                    <select className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white cursor-pointer" value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})}>
                      <option value="pegawai" className="bg-[#111827]">Pegawai (Staf Lapangan)</option>
                      <option value="pimpinan" className="bg-[#111827]">Pimpinan (Direksi)</option>
                      <option value="admin" className="bg-[#111827]">Admin (Sistem Utama)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Nomor HP</label>
                  <input type="text" className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Alamat Rumah</label>
                  <textarea rows="2" className="w-full bg-[#1f2937] p-4 rounded-xl outline-none border border-gray-700 text-white resize-none" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-800 py-4 rounded-xl font-bold">Batal</button>
                <button type="submit" disabled={actionLoading} className="flex-1 bg-blue-600 py-4 rounded-xl font-bold flex justify-center items-center">
                  {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </LayoutWrapper>
  );
}