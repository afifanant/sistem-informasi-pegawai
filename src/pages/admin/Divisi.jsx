import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  Building2, Users, TrendingUp, Plus, Search, Briefcase, Loader2,
  X, Pencil, Trash2, MapPin, CalendarDays, UserPlus, Contact
} from "lucide-react";

export default function Divisi() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // State Modal Divisi
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: "", manager: "", warna: "from-blue-500 to-cyan-400" });

  // State Modal Detail & Penugasan
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState(null);
  const [showEditPenugasanModal, setShowEditPenugasanModal] = useState(false);
  const [editPenugasan, setEditPenugasan] = useState({ id: null, nama_proyek: "", proyek_lokasi: "", tanggal_mulai: "", tanggal_selesai: "" });

  const [dataDivisi, setDataDivisi] = useState([]);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [masterProyek, setMasterProyek] = useState([]);

  const fetchDivisiData = async () => {
    try {
      setLoading(true);
      const { data: divisi, error: errorDivisi } = await supabase.from('divisi').select('*').order('created_at', { ascending: true });
      if (errorDivisi) throw errorDivisi;

      const { data: profiles, error: errorProfiles } = await supabase.from('profiles').select('id, full_name, username, position, nama_proyek, proyek_lokasi, tanggal_mulai, tanggal_selesai');
      if (errorProfiles) throw errorProfiles;

      const { data: proyek, error: errorProyek } = await supabase.from('proyek').select('nama_proyek, lokasi');
      if (errorProyek) throw errorProyek;

      setDataDivisi(divisi || []);
      setDataPegawai(profiles || []);
      setMasterProyek(proyek || []);
    } catch (error) { 
      console.error("Detail Error Muat Divisi/Profiles/Proyek:", error.message);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    setIsMounted(true); 
    fetchDivisiData(); 
  }, []);

  const handleProyekChange = (namaProyekTerpilih) => {
    const proyekCocok = masterProyek.find(p => p.nama_proyek === namaProyekTerpilih);
    setEditPenugasan({
      ...editPenugasan,
      nama_proyek: namaProyekTerpilih,
      proyek_lokasi: proyekCocok ? proyekCocok.lokasi : ""
    });
  };

  const handleSimpanPenugasan = async () => {
    setActionLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').update({
        nama_proyek: editPenugasan.nama_proyek,
        proyek_lokasi: editPenugasan.proyek_lokasi,
        tanggal_mulai: editPenugasan.tanggal_mulai || null,
        tanggal_selesai: editPenugasan.tanggal_selesai || null
      }).eq('id', editPenugasan.id).select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("⛔ Update diblokir Supabase! RLS profiles belum dikonfigurasi.");
      }

      alert("Penugasan berhasil diperbarui di database!");
      setShowEditPenugasanModal(false);
      fetchDivisiData();
    } catch (err) { 
      alert(err.message); 
    } finally { 
      setActionLoading(false); 
    }
  };

  const handleHapusPenugasan = async (id, nama) => {
    if (!window.confirm(`Yakin ingin melepas penugasan ${nama}?`)) return;
    try {
      const { data, error } = await supabase.from('profiles').update({ 
        nama_proyek: null, 
        proyek_lokasi: null, 
        tanggal_mulai: null, 
        tanggal_selesai: null 
      }).eq('id', id).select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("⛔ Hapus diblokir Supabase! RLS belum dibuka.");
      }

      fetchDivisiData();
    } catch (err) { 
      alert(err.message); 
    }
  };

  const handleTambahDivisi = async () => {
    if (!form.nama || !form.manager) return alert("Isi semua field!");
    setActionLoading(true);
    try {
      const { error } = await supabase.from('divisi').insert([{ nama: form.nama, manager: form.manager, warna: form.warna }]);
      if (error) throw error;
      setShowModal(false); 
      setForm({ nama: "", manager: "", warna: "from-blue-500 to-cyan-400" });
      fetchDivisiData();
    } catch (error) {
      alert("Gagal menambah divisi: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleHapusDivisi = async (id, nama) => {
    if (window.confirm(`Hapus ${nama}? Pegawai di divisi ini tidak terhapus, namun status divisi mereka akan kosong.`)) {
      try {
        const { error } = await supabase.from('divisi').delete().eq('id', id);
        if (error) throw error;
        fetchDivisiData();
      } catch (error) {
        alert("Gagal menghapus divisi: " + error.message);
      }
    }
  };

  const filteredDivisi = dataDivisi.filter(item => (item.nama || "").toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-slate-800">
          <Loader2 className="animate-spin text-blue-600 mr-3" size={30} />
          <span className="font-semibold text-lg">Memuat Data Divisi...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`transform transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-blue-900 via-slate-800 to-slate-900 rounded-[35px] p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-400/30">
              <Building2 size={36} className="text-blue-300" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight">Data Divisi</h1>
              <p className="text-blue-200 mt-2 text-sm lg:text-base font-medium">Kelola departemen, manager, dan penugasan personel secara terpusat.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="relative z-10 bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all h-fit shadow-lg border border-blue-400/50"
          >
            <Plus size={22} /> Tambah Divisi
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[450px] border border-gray-700 mt-8 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-md">
          <Search className="text-gray-400" size={22} />
          <input
            type="text"
            placeholder="Cari nama divisi..."
            className="bg-transparent outline-none w-full text-white placeholder-gray-500 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-500 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {/* EMPTY STATE PENCARIAN */}
        {filteredDivisi.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <Building2 size={60} className="mb-4 opacity-20" />
            <p className="text-xl font-semibold text-gray-400">Divisi tidak ditemukan.</p>
            <p className="text-sm mt-2">Coba gunakan kata kunci pencarian lain.</p>
          </div>
        )}

        {/* DIVISI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {filteredDivisi.map((item) => {
            const anggota = dataPegawai.filter(p => p.position === item.nama);
            return (
              <div key={item.id} className="bg-[#111827] border border-gray-800 rounded-[30px] flex flex-col justify-between shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden group">
                <div className={`h-2 w-full bg-gradient-to-r ${item.warna || 'from-blue-500 to-cyan-400'}`}></div>
                
                <div className="p-7">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-black text-white leading-tight">{item.nama}</h2>
                    <div className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-gray-700">
                      <Users size={12} /> {anggota.length}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-5 text-gray-400 bg-[#1f2937]/50 p-3 rounded-xl border border-gray-800/50">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">Manager</p>
                      <p className="font-bold text-gray-200">{item.manager}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-7 pt-0 mt-2">
                  <button onClick={() => { setSelectedDivisi(item); setShowDetailModal(true); }} className="bg-[#1f2937] hover:bg-blue-600 border border-gray-700 hover:border-transparent py-3 rounded-xl font-bold text-gray-300 hover:text-white transition-all text-sm flex justify-center items-center gap-2">
                    <Contact size={18} /> Detail Staf
                  </button>
                  <button onClick={() => handleHapusDivisi(item.id, item.nama)} className="bg-[#1f2937] hover:bg-red-600 border border-gray-700 hover:border-transparent text-gray-400 hover:text-white py-3 rounded-xl transition-all flex justify-center items-center gap-2 font-bold text-sm">
                    <Trash2 size={18}/> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL TAMBAH DIVISI */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-[#111827] w-full max-w-md rounded-[35px] p-8 text-white border border-gray-700 shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <Building2 className="text-blue-500" /> Tambah Divisi
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-400 block mb-2">Nama Divisi</label>
                <input type="text" className="w-full bg-[#1f2937] px-4 py-3.5 rounded-xl outline-none text-white border border-gray-700 focus:border-blue-500 transition-colors"
                  value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} placeholder="Contoh: Divisi Keuangan"/>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-400 block mb-2 flex items-center gap-2">
                  Manager / Kepala <UserPlus size={14} className="text-blue-400"/>
                </label>
                <select 
                  className="w-full bg-[#1f2937] px-4 py-3.5 rounded-xl outline-none text-white border border-gray-700 focus:border-blue-500 cursor-pointer transition-colors"
                  value={form.manager} 
                  onChange={(e) => setForm({...form, manager: e.target.value})}
                >
                  <option value="" disabled>-- Pilih Manager --</option>
                  {dataPegawai.length > 0 ? (
                    dataPegawai.map((pegawai) => (
                      <option key={pegawai.id} value={pegawai.full_name}>
                        {pegawai.full_name} {pegawai.position ? `— ${pegawai.position}` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Memuat data...</option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-3.5 rounded-xl font-bold transition-colors">Batal</button>
              <button onClick={handleTambahDivisi} disabled={actionLoading} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3.5 rounded-xl font-bold flex items-center justify-center transition-colors">
                {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Simpan Divisi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PERSONEL */}
      {showDetailModal && selectedDivisi && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-5 overflow-y-auto py-10">
          <div className="bg-[#111827] w-full max-w-6xl rounded-[35px] text-white border border-gray-700 shadow-2xl flex flex-col my-auto max-h-[90vh]">
            
            <div className="p-8 border-b border-gray-800 flex justify-between items-center shrink-0 bg-[#1f2937]/30 rounded-t-[35px]">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
                  <Users size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">{selectedDivisi.nama}</h2>
                  <p className="text-blue-400 font-medium text-sm mt-1">Manager: {selectedDivisi.manager}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 hover:text-white text-gray-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1 p-8 rounded-b-[35px] custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#111827] z-10 shadow-sm">
                  <tr className="text-gray-400 border-b border-gray-800 text-sm">
                    <th className="pb-4 font-semibold uppercase tracking-wider">Nama Pegawai</th>
                    <th className="pb-4 font-semibold uppercase tracking-wider">Target Proyek</th>
                    <th className="pb-4 font-semibold uppercase tracking-wider">Lokasi</th>
                    <th className="pb-4 text-center font-semibold uppercase tracking-wider">Aksi Penugasan</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-800/50">
                  {dataPegawai.filter(p => p.position === selectedDivisi.nama).length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-16 text-gray-500">
                        <Users size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="font-semibold text-lg">Belum ada staf</p>
                        <p className="text-xs mt-1">Staf dengan jabatan {selectedDivisi.nama} akan otomatis muncul di sini.</p>
                      </td>
                    </tr>
                  ) : (
                    dataPegawai.filter(p => p.position === selectedDivisi.nama).map((pegawai) => (
                      <tr key={pegawai.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-5">
                          <p className="font-bold text-white text-base">{pegawai.full_name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">ID: <span className="text-cyan-400 font-mono">{pegawai.username || "-"}</span></p>
                        </td>
                        
                        <td className="py-5">
                          {pegawai.nama_proyek ? (
                            <div className="flex flex-col gap-1.5 items-start">
                              <span className="text-blue-300 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs">
                                {pegawai.nama_proyek}
                              </span>
                              {pegawai.tanggal_mulai && pegawai.tanggal_selesai ? (
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                                  <CalendarDays size={12} className="text-blue-400" />
                                  <span>{pegawai.tanggal_mulai} <span className="text-gray-600 mx-1">s/d</span> {pegawai.tanggal_selesai}</span>
                                </div>
                              ) : (
                                <span className="text-yellow-500/80 text-[11px] italic bg-yellow-500/10 px-2 py-0.5 rounded">Periode belum diatur</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 bg-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold">Standby / Available</span>
                          )}
                        </td>

                        <td className="py-5 text-gray-300 font-medium">
                          {pegawai.proyek_lokasi ? (
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-red-400" />
                              {pegawai.proyek_lokasi}
                            </div>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}
                        </td>
                        
                        <td className="py-5">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => {
                                setEditPenugasan({
                                  id: pegawai.id,
                                  nama_proyek: pegawai.nama_proyek || "",
                                  proyek_lokasi: pegawai.proyek_lokasi || "",
                                  tanggal_mulai: pegawai.tanggal_mulai || "",
                                  tanggal_selesai: pegawai.tanggal_selesai || ""
                                });
                                setShowEditPenugasanModal(true);
                              }}
                              className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                            >
                              <Pencil size={12} /> {pegawai.nama_proyek ? 'Edit' : 'Tugaskan'}
                            </button>
                            {pegawai.nama_proyek && (
                              <button 
                                onClick={() => handleHapusPenugasan(pegawai.id, pegawai.full_name)}
                                className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                              >
                                <X size={14} /> Lepas
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT PENUGASAN PROYEK */}
      {showEditPenugasanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-5">
          <div className="bg-[#1f2937] w-full max-w-md rounded-[30px] p-8 text-white border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-500" /> Penugasan Proyek
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-2">Nama Target Proyek</label>
                <select 
                  className="w-full bg-[#111827] px-4 py-3 rounded-xl outline-none text-sm text-white border border-gray-700 focus:border-blue-500 transition-colors cursor-pointer"
                  value={editPenugasan.nama_proyek} 
                  onChange={(e) => handleProyekChange(e.target.value)}
                >
                  <option value="" className="text-gray-500">-- Pilih Proyek Terdaftar --</option>
                  {masterProyek.map((proyek) => (
                    <option key={proyek.nama_proyek} value={proyek.nama_proyek}>
                      {proyek.nama_proyek}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-2">Lokasi Penugasan</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" className="w-full bg-[#111827] pl-10 pr-4 py-3 rounded-xl outline-none text-sm text-gray-400 border border-gray-700 opacity-60 cursor-not-allowed"
                    value={editPenugasan.proyek_lokasi} placeholder="Pilih proyek terlebih dahulu" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Tanggal Mulai</label>
                  <input type="date" className="w-full bg-[#111827] px-3 py-3 rounded-xl outline-none text-sm text-white border border-gray-700 focus:border-blue-500 [color-scheme:dark]"
                    value={editPenugasan.tanggal_mulai} onChange={(e) => setEditPenugasan({...editPenugasan, tanggal_mulai: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Tanggal Selesai</label>
                  <input type="date" className="w-full bg-[#111827] px-3 py-3 rounded-xl outline-none text-sm text-white border border-gray-700 focus:border-blue-500 [color-scheme:dark]"
                    value={editPenugasan.tanggal_selesai} onChange={(e) => setEditPenugasan({...editPenugasan, tanggal_selesai: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowEditPenugasanModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-sm font-bold transition-colors">Batal</button>
              <button onClick={handleSimpanPenugasan} disabled={actionLoading} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-colors">
                {actionLoading ? <Loader2 className="animate-spin" size={18} /> : "Simpan Target"}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}