import { useState, useEffect } from "react";
// Import kedua layout
import AdminLayout from "../../layouts/AdminLayout";
import PimpinanLayout from "../../layouts/PimpinanLayout";
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
  EyeOff   
} from "lucide-react";

export default function DataPegawai() {
  // --- STATE BARU UNTUK HAK AKSES ---
  const [currentUserRole, setCurrentUserRole] = useState("admin"); // Default

  const [search, setSearch] = useState("");
  const [pegawai, setPegawai] = useState([]);
  const [daftarDivisi, setDaftarDivisi] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [lihatPasswordEdit, setLihatPasswordEdit] = useState(false);
  const [lihatPasswordTambah, setLihatPasswordTambah] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: "", email: "", position: "", password: "", address: "", phone_number: "", role: "pegawai",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    full_name: "", email: "", password: "", position: "", address: "", phone_number: "", role: "pegawai",
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
          .single();
          
        if (myProfile) {
          setCurrentUserRole(myProfile.role);
        }
      }

      // 2. TARIK DATA PEGAWAI
      const { data: dataPegawai, error: errorPegawai } = await supabase
        .from('profiles')
        .select('id, full_name, email, position, status, role, password, address, phone_number')
        .order('full_name', { ascending: true });

      if (errorPegawai) throw errorPegawai;
      setPegawai(dataPegawai || []);

      // 3. TARIK DATA DIVISI
      const { data: dataDivisi, error: errorDivisi } = await supabase
        .from('divisi')
        .select('*'); 

      if (errorDivisi) throw errorDivisi;
      const opsiDivisi = dataDivisi ? dataDivisi.map(d => d.nama || d.name || d.nama_divisi || d.divisi).filter(Boolean) : [];
      setDaftarDivisi(opsiDivisi);

    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal menarik data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  // ==========================================
  // FUNGSI CRUD (Hanya bisa dipakai jika bukan Pimpinan, tapi tetap kita biarkan di sini)
  // ==========================================
  const handleSimpanBaru = async () => { /* ... Logika Aslimu ... */ };
  const handleEditClick = (item) => { /* ... Logika Aslimu ... */ };
  const handleSimpanEdit = async () => { /* ... Logika Aslimu ... */ };
  const handleHapus = async (id, nama) => { /* ... Logika Aslimu ... */ };

  const filteredPegawai = pegawai.filter((item) =>
    (item.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.position || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.address || "").toLowerCase().includes(search.toLowerCase()) ||
    String(item.phone_number || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.role || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPegawai = pegawai.length;
  const pegawaiAktif = pegawai.filter((item) => item.status === "Aktif").length;
  const totalDivisi = [...new Set(pegawai.map(item => item.position).filter(Boolean))].length;

  // --- PEMILIHAN LAYOUT OTOMATIS ---
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
            <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[400px] border border-gray-700 focus-within:border-blue-500 transition-all">
              <Search className="text-gray-400" size={22} />
              <input
                type="text"
                placeholder="Cari nama, divisi, alamat, role..."
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* HANYA MUNCUL JIKA BUKAN PIMPINAN */}
            {currentUserRole !== "pimpinan" && (
              <button
                onClick={() => {
                  setAddForm({ full_name: "", email: "", password: "", position: "", address: "", phone_number: "", role: "pegawai" }); 
                  setLihatPasswordTambah(false);
                  setShowAddModal(true); 
                }}
                className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus size={22} /> Tambah Akun Baru
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            {filteredPegawai.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Belum ada data.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 text-sm">
                    <th className="pb-5 font-semibold">Nama / Email / HP</th>
                    <th className="pb-5 font-semibold">Divisi & Akses</th>
                    <th className="pb-5 font-semibold">Alamat</th>
                    {/* HIDE KOLOM ACTION JIKA PIMPINAN */}
                    {currentUserRole !== "pimpinan" && <th className="pb-5 text-center font-semibold">Action</th>}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredPegawai.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800 hover:bg-[#1f2937]/50 transition-colors">
                      <td className="py-5">
                        <p className="font-bold text-white text-base">{item.full_name || "Belum Diatur"}</p>
                        <p className="text-gray-400 mt-1">{item.email || "-"}</p>
                        <p className="text-blue-400 text-xs mt-0.5">{item.phone_number || "-"}</p>
                      </td>
                      <td className="py-5 align-top">
                        <p className="text-gray-300 text-base font-semibold">{item.position || "Belum Ditugaskan"}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase ${item.role === 'pimpinan' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          {item.role === 'pimpinan' ? 'Pimpinan' : 'Pegawai'}
                        </span>
                      </td>
                      <td className="py-5 text-gray-400 max-w-[200px] truncate align-top" title={item.address}>
                        {item.address || "-"}
                      </td>
                      
                      {/* HIDE TOMBOL EDIT/HAPUS JIKA PIMPINAN */}
                      {currentUserRole !== "pimpinan" && (
                        <td className="py-5 align-top">
                          <div className="flex justify-center gap-3">
                            <button onClick={() => handleEditClick(item)} className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white p-3 rounded-xl transition-colors border border-blue-500/20" title="Edit Data">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleHapus(item.id, item.full_name)} className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white p-3 rounded-xl transition-colors border border-red-500/20" title="Hapus Profil">
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

        {/* MODAL TAMBAH BARU & MODAL EDIT (KODEMU TETAP ADA DI SINI) */}
        {/* ... (Pertahankan kode modal Add & Edit milikmu sebelumnya di sini) ... */}

      </div>
    </LayoutWrapper>
  );
}