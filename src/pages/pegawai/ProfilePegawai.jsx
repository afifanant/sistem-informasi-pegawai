import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/PegawaiLayout";
import { supabase } from "../../supabaseClient";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Save,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from "lucide-react";

export default function ProfilePegawai() {
  // 1. State untuk Form Data Karyawan
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  
  // State untuk Password Baru
  const [oldPassword, setOldPassword] = useState(""); // Hanya formalitas di sisi client untuk UI
  const [newPassword, setNewPassword] = useState("");

  // State untuk Atribut UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 2. Tarik Data Profil Saat Halaman Dimuat
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Ambil ID user dari sesi login aktif
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) throw new Error("Gagal mengambil data user.");

        setEmail(user.email);

        // Ambil detail profil dari tabel 'profiles'
        const { data: profile, error: dbError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFullName(profile.full_name || "");
          setPhone(profile.phone || "");
          setAddress(profile.address || "");
          setPosition(profile.position || "Pegawai");
        } else if (dbError) {
          // Jika data di tabel profiles belum ada, kita inisialisasi baris baru
          await supabase.from("profiles").insert([{ id: user.id, full_name: user.email.split("@")[0] }]);
          setFullName(user.email.split("@")[0]);
        }
      } catch (err) {
        setMessage({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // 3. Fungsi Aksi Simpan Perubahan
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // A. Update Informasi Pribadi ke tabel 'profiles'
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          phone: phone,
          address: address,
          position: position,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // B. Update Password jika kolom password baru diisi
      if (newPassword) {
        if (newPassword.length < 6) {
          throw new Error("Password baru minimal harus 6 karakter.");
        }
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (passwordError) throw passwordError;
        setNewPassword("");
      }

      setMessage({ type: "success", text: "Profil dan keamanan akun berhasil diperbarui!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-blue-500 mr-3" size={30} />
        <p className="text-lg font-semibold">Mengambil Data Profil...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-[35px] p-10 text-white">
          <p className="uppercase tracking-[5px] text-blue-200 text-sm">Employee Profile</p>
          <h1 className="text-5xl font-black mt-4">Profile Saya</h1>
          <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
            Kelola data pribadi dan keamanan akun Anda secara terpusat dengan database.
          </p>
        </div>

        {/* FEEDBACK BANNER */}
        {message.text && (
          <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 ${
            message.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        {/* CONTENT */}
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          
          {/* LEFT: AVATAR DISPLAY */}
          <div className="bg-[#111827] rounded-[35px] p-8 text-white text-center flex flex-col justify-center border border-gray-800 shadow-xl">
            <div className="relative w-[140px] h-[140px] mx-auto">
              <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-inner">
                <User size={70} />
              </div>
              <button type="button" className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 transition p-3 rounded-full shadow-lg">
                <Camera size={20} />
              </button>
            </div>

            <h2 className="text-3xl font-black mt-8 tracking-tight">{fullName || "Nama Belum Diatur"}</h2>
            <p className="text-gray-400 mt-2 font-medium">{position}</p>
            
            <div className="mt-4">
              <span className="bg-blue-500/20 text-blue-400 px-5 py-2 rounded-2xl inline-block font-bold text-xs uppercase tracking-wider">
                Employee Active
              </span>
            </div>
          </div>

          {/* RIGHT: ACCOUNT DETAILS FORM */}
          <div className="xl:col-span-2 bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-600 p-4 rounded-2xl">
                <Shield size={28} />
              </div>
              <div>
                <p className="uppercase tracking-[4px] text-gray-400 text-sm">Personal Information</p>
                <h2 className="text-4xl font-black tracking-tight">Informasi Pribadi</h2>
              </div>
            </div>

            {/* FIELD INPUT DATA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NAMA */}
              <div>
                <label className="text-gray-400 text-sm font-medium">Nama Lengkap</label>
                <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 transition-all">
                  <User size={20} className="text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-transparent outline-none w-full text-white"
                    placeholder="Nama Lengkap Karyawan"
                  />
                </div>
              </div>

              {/* EMAIL (READ-ONLY demi alasan integritas sistem akun) */}
              <div>
                <label className="text-gray-400 text-sm font-medium">Email Sistem (Sesi Aktif)</label>
                <div className="bg-[#1f2937]/50 opacity-60 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                  <Mail size={20} className="text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* TELEPON */}
              <div>
                <label className="text-gray-400 text-sm font-medium">Nomor Telepon</label>
                <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 transition-all">
                  <Phone size={20} className="text-gray-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-transparent outline-none w-full text-white"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
              </div>

              {/* JABATAN / DIVISI */}
              <div>
                <label className="text-gray-400 text-sm font-medium">Divisi Kerja / Posisi</label>
                <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 transition-all">
                  <Briefcase size={20} className="text-gray-400" />
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="bg-transparent outline-none w-full text-white"
                    placeholder="Contoh: Frontend Developer"
                  />
                </div>
              </div>

              {/* ALAMAT */}
              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm font-medium">Alamat Tempat Tinggal</label>
                <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 transition-all">
                  <MapPin size={20} className="text-gray-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-transparent outline-none w-full text-white"
                    placeholder="Alamat Lengkap Sekarang"
                  />
                </div>
              </div>
            </div>

            {/* PASSWORD SECURITY */}
            <div className="mt-10 pt-6 border-t border-gray-800">
              <h3 className="text-2xl font-black mb-2 tracking-tight">Update Password Security</h3>
              <p className="text-xs text-gray-400 mb-6">Kosongkan kolom password jika Anda tidak ingin mengubah kunci keamanan akun.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm font-medium">Password Lama</label>
                  <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 transition-all">
                    <Lock size={20} className="text-gray-400" />
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent outline-none w-full text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">Password Baru</label>
                  <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 transition-all">
                    <Lock size={20} className="text-gray-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="bg-transparent outline-none w-full text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="mt-10 flex justify-start">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}