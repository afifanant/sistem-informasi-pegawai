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

  const fetchDivisiData = async () => {
    try {
      setLoading(true);
      const { data: divisi } = await supabase.from('divisi').select('*').order('created_at', { ascending: true });
      const { data: profiles } = await supabase.from('profiles').select('id, full_name, email, position, nama_proyek, proyek_lokasi, tanggal_mulai, tanggal_selesai');
      setDataDivisi(divisi || []);
      setDataPegawai(profiles || []);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    setIsMounted(true); 
    fetchDivisiData(); 
  }, []);

  // FUNGSI MANAJEMEN PENUGASAN (EDIT & HAPUS)
  const handleSimpanPenugasan = async () => {
    setActionLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        nama_proyek: editPenugasan.nama_proyek,
        proyek_lokasi: editPenugasan.proyek_lokasi,
        tanggal_mulai: editPenugasan.tanggal_mulai || null,
        tanggal_selesai: editPenugasan.tanggal_selesai || null
      }).eq('id', editPenugasan.id);
      if (error) throw error;
      alert("Penugasan diperbarui!");
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
      await supabase.from('profiles').update({ nama_proyek: null, proyek_lokasi: null, tanggal_mulai: null, tanggal_selesai: null }).eq('id', id);
      fetchDivisiData();
    } catch (err) { 
      alert(err.message); 
    }
  };

  // FUNGSI CRUD DIVISI (Tambah/Hapus)
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
        await supabase.from('divisi').delete().eq('id', id);
        fetchDivisiData();
    }
  };

  const filteredDivisi = dataDivisi.filter(item => item.nama.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <DashboardLayout><div className="flex justify-center items-center h-screen text-white"><Loader2 className="animate-spin" size={30} /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className={`transform transition-all duration-1000 ${isMounted ? "opacity-100" : "opacity-0"}`}>
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h1 className="text-5xl font-black">Data Divisi Perusahaan</h1>
            <p className="text-blue-100 mt-5">Kelola departemen dan penugasan personel secara terpusat.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all h-fit shadow-lg"
          >
            <Plus size={22} /> Tambah Divisi Baru
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[400px] border border-gray-700 mt-8">
          <Search className="text-gray-400" size={22} />
          <input
            type="text"
            placeholder="Cari nama divisi..."
            className="bg-transparent outline-none w-full text-white placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* DIVISI CARDS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {filteredDivisi.map((item) => {
            const anggota = dataPegawai.filter(p => p.position === item.nama);
            return (
              <div key={item.id} className="bg-[#1f2937] border border-gray-800 rounded-[30px] p-7 group flex flex-col justify-between shadow-lg">
                <div>
                  <h2 className="text-3xl font-black text-white">{item.nama}</h2>
                  <p className="text-gray-400 mt-1">Manager: <span className="text-blue-400 font-semibold">{item.manager}</span></p>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => { setSelectedDivisi(item); setShowDetailModal(true); }} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-white transition-colors">
                    Detail Personel ({anggota.length})
                  </button>
                  <button onClick={() => handleHapusDivisi(item.id, item.nama)} className="bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white px-6 rounded-xl transition-all">
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL TAMBAH DIVISI */}
{showModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-5">
    <div className="bg-[#111827] w-full max-w-md rounded-[35px] p-8 text-white border border-gray-800 shadow-2xl">
      <h2 className="text-2xl font-black mb-5">Tambah Divisi Baru</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 block mb-2">Nama Divisi</label>
          <input type="text" className="w-full bg-[#1f2937] px-4 py-3 rounded-xl outline-none text-white border border-transparent focus:border-blue-500"
            value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} placeholder="Contoh: Divisi Keuangan"/>
        </div>
        
        {/* --- BAGIAN INI YANG DIUBAH MENJADI DROPDOWN --- */}
        <div>
          <label className="text-sm text-gray-400 block mb-2">Nama Manager / Kepala</label>
          <select 
            className="w-full bg-[#1f2937] px-4 py-3 rounded-xl outline-none text-white border border-transparent focus:border-blue-500 cursor-pointer"
            value={form.manager} 
            onChange={(e) => setForm({...form, manager: e.target.value})}
          >
            <option value="" disabled>-- Pilih Manager dari Pegawai --</option>
            {dataPegawai.length > 0 ? (
              dataPegawai.map((pegawai) => (
                <option key={pegawai.id} value={pegawai.full_name}>
                  {pegawai.full_name} {pegawai.position ? `(${pegawai.position})` : ''}
                </option>
              ))
            ) : (
              <option value="" disabled>Memuat data pegawai...</option>
            )}
          </select>
        </div>
        {/* ------------------------------------------------ */}

      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 py-3 rounded-xl font-semibold">Batal</button>
        <button onClick={handleTambahDivisi} disabled={actionLoading} className="flex-1 bg-blue-600 py-3 rounded-xl font-semibold flex items-center justify-center">
          {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Simpan"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* MODAL DETAIL PERSONEL */}
      {showDetailModal && selectedDivisi && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-[#111827] w-full max-w-5xl rounded-[35px] p-10 text-white border border-gray-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-800 pb-5 mb-6">
              <div>
                <h2 className="text-3xl font-black">{selectedDivisi.nama}</h2>
                <p className="text-gray-400 text-sm">Daftar staf yang tergabung ke dalam divisi ini.</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800 text-sm">
                    <th className="pb-4 font-medium">Nama Pegawai</th>
                    <th className="pb-4 font-medium">Email</th>
                    <th className="pb-4 font-medium">Target Proyek</th> {/* Mengubah Proyek Aktif -> Target Proyek */}
                    <th className="pb-4 font-medium">Lokasi</th>
                    <th className="pb-4 text-center font-medium">Aksi Penugasan</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-800/50">
                  {dataPegawai.filter(p => p.position === selectedDivisi.nama).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500 italic">Belum ada pegawai di divisi ini.</td>
                    </tr>
                  ) : (
                    dataPegawai.filter(p => p.position === selectedDivisi.nama).map((pegawai) => (
                      <tr key={pegawai.id} className="hover:bg-gray-800/30">
                        <td className="py-4 font-bold text-white">{pegawai.full_name}</td>
                        <td className="py-4 text-gray-400">{pegawai.email}</td>
                        
                        {/* REFAKTOR: Menampilkan Nama Proyek beserta rentang waktu */}
                        <td className="py-4">
                          {pegawai.nama_proyek ? (
                            <div className="flex flex-col gap-1.5">
                              <span className="text-blue-300 font-semibold bg-blue-500/10 px-2 py-1 rounded text-xs w-fit">
                                {pegawai.nama_proyek}
                              </span>
                              {pegawai.tanggal_mulai && pegawai.tanggal_selesai ? (
                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                  <CalendarDays size={12} className="text-blue-500" />
                                  <span>{pegawai.tanggal_mulai} s/d {pegawai.tanggal_selesai}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-[11px] italic">Periode belum diatur</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-600 italic text-xs">Standby</span>
                          )}
                        </td>

                        <td className="py-4 text-gray-400">{pegawai.proyek_lokasi || "-"}</td>
                        <td className="py-4">
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
                              className="bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                            >
                              Atur Proyek
                            </button>
                            {pegawai.nama_proyek && (
                              <button 
                                onClick={() => handleHapusPenugasan(pegawai.id, pegawai.full_name)}
                                className="bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                              >
                                Lepas
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
          <div className="bg-[#111827] w-full max-w-md rounded-[30px] p-8 text-white border border-gray-800 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Pengaturan Penugasan Proyek</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Nama Proyek</label>
                <input type="text" className="w-full bg-[#1f2937] px-4 py-2.5 rounded-xl outline-none text-sm text-white"
                  value={editPenugasan.nama_proyek} onChange={(e) => setEditPenugasan({...editPenugasan, nama_proyek: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Lokasi Proyek</label>
                <input type="text" className="w-full bg-[#1f2937] px-4 py-2.5 rounded-xl outline-none text-sm text-white"
                  value={editPenugasan.proyek_lokasi} onChange={(e) => setEditPenugasan({...editPenugasan, proyek_lokasi: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tanggal Mulai</label>
                  <input type="date" className="w-full bg-[#1f2937] px-3 py-2 rounded-xl outline-none text-xs text-white [color-scheme:dark]"
                    value={editPenugasan.tanggal_mulai} onChange={(e) => setEditPenugasan({...editPenugasan, tanggal_mulai: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tanggal Selesai</label>
                  <input type="date" className="w-full bg-[#1f2937] px-3 py-2 rounded-xl outline-none text-xs text-white [color-scheme:dark]"
                    value={editPenugasan.tanggal_selesai} onChange={(e) => setEditPenugasan({...editPenugasan, tanggal_selesai: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditPenugasanModal(false)} className="flex-1 bg-gray-800 py-2.5 rounded-xl text-sm font-semibold">Batal</button>
              <button onClick={handleSimpanPenugasan} disabled={actionLoading} className="flex-1 bg-blue-600 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center">
                {actionLoading ? <Loader2 className="animate-spin" size={18} /> : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}