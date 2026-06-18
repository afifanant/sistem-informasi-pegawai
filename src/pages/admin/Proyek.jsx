import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/AdminLayout";
import { supabase } from "../../supabaseClient";
import {
  Plus, Search, Pencil, Trash2, Briefcase, MapPin, 
  CalendarDays, Loader2, DollarSign, CheckCircle2, Clock, AlertCircle, X, FileText
} from "lucide-react";

export default function Proyek() {
  const [search, setSearch] = useState("");
  const [proyekList, setProyekList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // State Modal Tambah & Edit
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [form, setForm] = useState({
    nama_proyek: "",
    deskripsi: "", // Penambahan field deskripsi di state form
    lokasi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    budget: "",
    status: "Berjalan"
  });

  const fetchProyekData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("proyek")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProyekList(data || []);
    } catch (error) {
      console.error("Error Muat Data Proyek:", error.message);
      alert("Gagal memuat data proyek: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProyekData();
  }, []);

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setSelectedId(null);
    setForm({
      nama_proyek: "",
      deskripsi: "", // Bersihkan deskripsi saat tambah baru
      lokasi: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      budget: "",
      status: "Berjalan"
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEdit(true);
    setSelectedId(item.id);
    setForm({
      nama_proyek: item.nama_proyek || "",
      deskripsi: item.deskripsi || "", // Muat deskripsi proyek lama ke modal edit
      lokasi: item.lokasi || "",
      tanggal_mulai: item.tanggal_mulai || "",
      tanggal_selesai: item.tanggal_selesai || "",
      budget: item.budget || "",
      status: item.status || "Berjalan"
    });
    setShowModal(true);
  };

  const handleSimpanProyek = async (e) => {
    e.preventDefault();
    if (!form.nama_proyek || !form.lokasi) {
      alert("Nama Proyek dan Lokasi wajib diisi!");
      return;
    }

    setActionLoading(true);
    try {
      if (isEdit) {
        // Logika UPDATE
        const { error } = await supabase
          .from("proyek")
          .update({
            nama_proyek: form.nama_proyek,
            deskripsi: form.deskripsi, // Simpan pembaruan deskripsi
            lokasi: form.lokasi,
            tanggal_mulai: form.tanggal_mulai || null,
            tanggal_selesai: form.tanggal_selesai || null,
            budget: form.budget ? parseInt(form.budget) : 0,
            status: form.status
          })
          .eq("id", selectedId);

        if (error) throw error;
        alert("Data proyek berhasil diperbarui!");
      } else {
        // Logika INSERT NEW
        const { error } = await supabase
          .from("proyek")
          .insert([
            {
              nama_proyek: form.nama_proyek,
              deskripsi: form.deskripsi, // Masukkan data deskripsi baru
              lokasi: form.lokasi,
              tanggal_mulai: form.tanggal_mulai || null,
              tanggal_selesai: form.tanggal_selesai || null,
              budget: form.budget ? parseInt(form.budget) : 0,
              status: form.status
            }
          ]);

        if (error) throw error;
        alert("Proyek baru berhasil ditambahkan!");
      }

      setShowModal(false);
      fetchProyekData();
    } catch (error) {
      alert("Gagal menyimpan proyek: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleHapusProyek = async (id, nama) => {
    if (!window.confirm(`Hapus permanen proyek "${nama}" dari sistem?`)) return;

    try {
      const { error } = await supabase.from("proyek").delete().eq("id", id);
      if (error) throw error;
      alert("Proyek berhasil dihapus.");
      fetchProyekData();
    } catch (error) {
      alert("Gagal menghapus proyek: " + error.message);
    }
  };

  const filteredProyek = proyekList.filter((item) =>
    (item.nama_proyek || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.deskripsi || "").toLowerCase().includes(search.toLowerCase()) || // Masukkan filter pencarian ke deskripsi
    (item.lokasi || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.status || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalProyek = proyekList.length;
  const proyekBerjalan = proyekList.filter(p => p.status === "Berjalan").length;
  const totalAnggaran = proyekList.reduce((acc, curr) => acc + (curr.budget || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Selesai":
        return <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"><CheckCircle2 size={14} /> Selesai</span>;
      case "Tertunda":
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"><AlertCircle size={14} /> Tertunda</span>;
      default:
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"><Clock size={14} /> Berjalan</span>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-white">
          <Loader2 className="animate-spin text-blue-500 mr-3" size={30} />
          <span className="font-semibold text-lg">Sinkronisasi Target Konstruksi Lapangan...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-[fadeIn_0.5s_ease-out]">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">Project Management</p>
            <h1 className="text-5xl font-black mt-4 tracking-tight">Manajemen Proyek</h1>
            <p className="text-blue-100 mt-4 max-w-xl leading-relaxed">
              Pantau progress pembangunan fisik konstruksi, kendalikan anggaran finansial, dan plot penugasan lokasi secara presisi.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg text-white h-fit w-full md:w-auto border border-blue-400/30"
          >
            <Plus size={22} /> Tambah Proyek Baru
          </button>
        </div>

        {/* METRICS STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#111827] rounded-[30px] p-7 text-white border border-gray-800 shadow-lg">
            <p className="text-gray-400 font-medium text-sm">Total Proyek Terdaftar</p>
            <h2 className="text-4xl font-black mt-3">{totalProyek} <span className="text-sm font-normal text-gray-500">Kontrak</span></h2>
          </div>
          <div className="bg-[#111827] rounded-[30px] p-7 text-white border border-gray-800 shadow-lg">
            <p className="text-gray-400 font-medium text-sm">Proyek Aktif (Berjalan)</p>
            <h2 className="text-4xl font-black mt-3 text-blue-400">{proyekBerjalan} <span className="text-sm font-normal text-gray-500">Lokasi</span></h2>
          </div>
          <div className="bg-[#111827] rounded-[30px] p-7 text-white border border-gray-800 shadow-lg">
            <p className="text-gray-400 font-medium text-sm">Total Alokasi Anggaran</p>
            <h2 className="text-3xl font-black mt-3 text-emerald-400">Rp {totalAnggaran.toLocaleString("id-ID")}</h2>
          </div>
        </div>

        {/* CONTROLS & TABLE */}
        <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white border border-gray-800 shadow-xl">
          <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[400px] border border-gray-700 focus-within:border-blue-500 transition-all mb-8">
            <Search className="text-gray-400" size={22} />
            <input
              type="text"
              placeholder="Cari nama proyek, deskripsi, lokasi..."
              className="bg-transparent outline-none w-full text-white placeholder-gray-500 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            {filteredProyek.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Briefcase size={40} className="mx-auto mb-3 opacity-20" />
                Belum ada data proyek konstruksi aktif atau data tidak cocok dengan kata kunci.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 text-sm">
                    <th className="pb-5 font-semibold">Detail Proyek / Anggaran</th>
                    <th className="pb-5 font-semibold">Lokasi Lapangan</th>
                    <th className="pb-5 font-semibold">Masa Kontrak Kerja</th>
                    <th className="pb-5 font-semibold">Status Progress</th>
                    <th className="pb-5 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-800/40">
                  {filteredProyek.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1f2937]/40 transition-colors">
                      <td className="py-5 max-w-[300px]">
                        <p className="font-bold text-white text-base">{item.nama_proyek}</p>
                        {/* RENDER DESKRIPSI: Ditampilkan di bawah nama proyek dengan warna muted agar rapi */}
                        <p className="text-gray-400 text-xs mt-1 font-medium leading-relaxed whitespace-pre-line">
                          {item.deskripsi || "Tidak ada deskripsi pekerjaan."}
                        </p>
                        <p className="text-emerald-400 font-mono text-xs mt-2 flex items-center gap-1 font-bold">
                          <DollarSign size={12} /> Rp {(item.budget || 0).toLocaleString("id-ID")}
                        </p>
                      </td>
                      <td className="py-5 text-gray-300 font-medium align-top">
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin size={14} className="text-red-400" />
                          {item.lokasi}
                        </div>
                      </td>
                      <td className="py-5 text-gray-400 font-medium align-top">
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <CalendarDays size={14} className="text-blue-400" />
                          <span>{item.tanggal_mulai || "-"}</span>
                          <span className="text-gray-600">s/d</span>
                          <span>{item.tanggal_selesai || "-"}</span>
                        </div>
                      </td>
                      <td className="py-5 align-top pt-6">{getStatusBadge(item.status)}</td>
                      <td className="py-5 align-top pt-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white p-2.5 rounded-xl transition-colors border border-blue-500/20"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleHapusProyek(item.id, item.nama_proyek)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white p-2.5 rounded-xl transition-colors border border-red-500/20"
                          >
                            <Trash2 size={16} />
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

        {/* MODAL INPUT & EDIT PROYEK */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-5">
            <div className="bg-[#111827] w-full max-w-md rounded-[35px] p-8 text-white border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Briefcase className="text-blue-500" /> {isEdit ? "Perbarui Proyek" : "Rilis Proyek Baru"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSimpanProyek} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Nama Proyek Konstruksi *</label>
                  <input type="text" className="w-full bg-[#1f2937] px-4 py-3 rounded-xl outline-none text-sm border border-gray-700 focus:border-blue-500 text-white"
                    value={form.nama_proyek} onChange={(e) => setForm({ ...form, nama_proyek: e.target.value })} placeholder="Cth: Paving Block Pemasangan Area Meraya" required />
                </div>

                {/* INPUT DESKRIPSI PROYEK BARU */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Deskripsi Detail Pekerjaan Proyek</label>
                  <div className="flex items-start bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
                    <FileText size={16} className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <textarea 
                      rows="3" 
                      className="w-full bg-transparent outline-none text-sm text-white resize-none"
                      value={form.deskripsi} 
                      onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} 
                      placeholder="Jelaskan ruang lingkup proyek, target hasil, pakan/material alternatif, atau rincian operasional lapangan..." 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Lokasi Penugasan Lapangan *</label>
                  <input type="text" className="w-full bg-[#1f2937] px-4 py-3 rounded-xl outline-none text-sm border border-gray-700 focus:border-blue-500 text-white"
                    value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} placeholder="Cth: Medan Denai, Sumatera Utara" required />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Alokasi Anggaran Kontrak (Rp)</label>
                  <input type="number" className="w-full bg-[#1f2937] px-4 py-3 rounded-xl outline-none text-sm border border-gray-700 focus:border-blue-500 text-white font-mono"
                    value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="Cth: 45000000" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-2">Tanggal Mulai</label>
                    <input type="date" className="w-full bg-[#1f2937] px-3 py-3 rounded-xl outline-none text-xs border border-gray-700 focus:border-blue-500 text-white [color-scheme:dark]"
                      value={form.tanggal_mulai} onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-2">Tanggal Selesai</label>
                    <input type="date" className="w-full bg-[#1f2937] px-3 py-3 rounded-xl outline-none text-xs border border-gray-700 focus:border-blue-500 text-white [color-scheme:dark]"
                      value={form.tanggal_selesai} onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">Status Progress</label>
                  <select className="w-full bg-[#1f2937] px-4 py-3 rounded-xl outline-none text-sm border border-gray-700 focus:border-blue-500 text-white cursor-pointer"
                    value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Berjalan" className="bg-[#111827]">Berjalan (Aktif)</option>
                    <option value="Selesai" className="bg-[#111827]">Selesai (Sempurna)</option>
                    <option value="Tertunda" className="bg-[#111827]">Tertunda (Interupsi)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-sm font-bold transition-colors">Batal</button>
                  <button type="submit" disabled={actionLoading} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-colors text-white">
                    {actionLoading ? <Loader2 className="animate-spin" size={18} /> : "Simpan Data Proyek"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}