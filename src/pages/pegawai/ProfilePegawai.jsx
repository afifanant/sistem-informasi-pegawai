import { useState, useEffect, useRef } from "react";
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
  // 1. State Animasi & Referensi
  const [isMounted, setIsMounted] = useState(false);
  
  // 2. State untuk Form Data Karyawan
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  // State untuk Password Baru
  const [oldPassword, setOldPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState("");

  // State untuk Atribut UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 3. Tarik Data Profil Saat Halaman Dimuat
  useEffect(() => {
    setIsMounted(true);

    const fetchProfileData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Gagal mengambil data user.");

        setEmail(user.email);

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
          setAvatarUrl(profile.avatar_url || null);
        } else if (dbError && dbError.code === "PGRST116") {
          // Jika row belum ada, buat baru
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

  // 4. Fungsi Upload Foto Profil (Langsung tersimpan saat dipilih)
  const uploadAvatar = async (event) => {
    try {
      setUploadingAvatar(true);
      setMessage({ type: "", text: "" });

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Anda harus memilih gambar untuk diupload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      
      // Buat nama file unik: IDUser-Waktu.Ekstensi
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // A. Upload fisik gambar ke Supabase Storage (bucket: 'avatars')
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // B. Dapatkan URL Publik dari gambar tersebut
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // C. Simpan URL tersebut ke tabel profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update UI
      setAvatarUrl(publicUrl);
      setMessage({ type: "success", text: "Foto profil berhasil diperbarui!" });
      
    } catch (error) {
      setMessage({ type: "error", text: "Gagal upload: " + error.message });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 5. Fungsi Aksi Simpan Perubahan Teks & Password
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const { data: { user } } = await supabase.auth.getUser();

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

      if (newPassword) {
        if (newPassword.length < 6) throw new Error("Password baru minimal harus 6 karakter.");
        
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (passwordError) throw passwordError;
        setNewPassword("");
        setOldPassword("");
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
        <p className="text-lg font-semibold tracking-wide">Mengambil Data Profil...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className={`p-6 transform transition-all duration-1000 ease-out ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}>
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-[35px] p-10 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 transition-transform duration-1000 group-hover:translate-x-10"></div>
          <div className="relative z-10">
            <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold">Employee Profile</p>
            <h1 className="text-5xl font-black mt-4 tracking-tight">Profile Saya</h1>
            <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
              Kelola data pribadi, foto, dan keamanan akun Anda secara terpusat dengan database sistem.
            </p>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {message.text && (
          <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 animate-[pulse_2s_ease-in-out_infinite] ${
            message.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={22} className="flex-shrink-0" /> : <AlertCircle size={22} className="flex-shrink-0" />}
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          
          {/* LEFT: AVATAR DISPLAY & UPLOAD */}
          <div className="bg-[#111827] rounded-[35px] p-8 text-white text-center flex flex-col justify-center border border-gray-800 shadow-xl transition-all hover:border-gray-700">
            <div className="relative w-[140px] h-[140px] mx-auto group">
              
              {/* Gambar Avatar atau Default User Icon */}
              <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-inner overflow-hidden border-4 border-slate-800 transition-all duration-300 group-hover:border-blue-500">
                {uploadingAvatar ? (
                  <Loader2 className="animate-spin text-white" size={40} />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Karyawan" className="w-full h-full object-cover" />
                ) : (
                  <User size={70} className="text-white opacity-80" />
                )}
              </div>
              
              {/* Tombol Kamera Terhubung ke Input File */}
              <label 
                htmlFor="avatarUpload" 
                className={`absolute bottom-0 right-0 p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300
                  ${uploadingAvatar ? "bg-gray-600 pointer-events-none" : "bg-cyan-500 hover:bg-cyan-400 hover:scale-110 active:scale-95"}`}
              >
                <Camera size={20} className="text-slate-900" />
              </label>
              
              {/* Input File Tersembunyi */}
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                className="hidden"
                onChange={uploadAvatar}
                disabled={uploadingAvatar}
              />
            </div>

            <h2 className="text-3xl font-black mt-8 tracking-tight">{fullName || "Nama Belum Diatur"}</h2>
            <p className="text-gray-400 mt-2 font-medium">{position}</p>
            
            <div className="mt-4">
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-5 py-2 rounded-2xl inline-block font-bold text-xs uppercase tracking-wider shadow-sm">
                Employee Active
              </span>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">Klik icon kamera untuk mengubah foto.</p>
          </div>

          {/* RIGHT: ACCOUNT DETAILS FORM */}
          <div className="xl:col-span-2 bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 shadow-xl transition-all hover:border-gray-700">
            <form onSubmit={handleUpdateProfile}>
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                  <Shield size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Personal Information</p>
                  <h2 className="text-4xl font-black tracking-tight">Informasi Pribadi</h2>
                </div>
              </div>

              {/* FIELD INPUT DATA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-gray-400 text-sm font-medium transition-colors group-focus-within:text-blue-400">Nama Lengkap</label>
                  <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 focus-within:-translate-y-1 transition-all duration-300">
                    <User size={20} className="text-gray-500 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                      placeholder="Nama Lengkap Karyawan"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-gray-400 text-sm font-medium">Email Sistem (Sesi Aktif)</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <Mail size={20} className="text-gray-600" />
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="bg-transparent outline-none w-full text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-gray-400 text-sm font-medium transition-colors group-focus-within:text-blue-400">Nomor Telepon</label>
                  <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 focus-within:-translate-y-1 transition-all duration-300">
                    <Phone size={20} className="text-gray-500 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-gray-400 text-sm font-medium transition-colors group-focus-within:text-blue-400">Divisi Kerja / Posisi</label>
                  <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 focus-within:-translate-y-1 transition-all duration-300">
                    <Briefcase size={20} className="text-gray-500 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                      placeholder="Contoh: Frontend Developer"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 group">
                  <label className="text-gray-400 text-sm font-medium transition-colors group-focus-within:text-blue-400">Alamat Tempat Tinggal</label>
                  <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-blue-500 focus-within:-translate-y-1 transition-all duration-300">
                    <MapPin size={20} className="text-gray-500 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                      placeholder="Alamat Lengkap Sekarang"
                    />
                  </div>
                </div>
              </div>

              {/* PASSWORD SECURITY */}
              <div className="mt-10 pt-8 border-t border-gray-800">
                <h3 className="text-2xl font-black mb-2 tracking-tight">Update Password Security</h3>
                <p className="text-sm text-gray-400 mb-6 font-medium">Kosongkan kolom password jika Anda tidak ingin mengubah kunci keamanan akun.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="text-gray-400 text-sm font-medium transition-colors group-focus-within:text-red-400">Password Lama</label>
                    <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-red-500 focus-within:-translate-y-1 transition-all duration-300">
                      <Lock size={20} className="text-gray-500 transition-colors group-focus-within:text-red-500" />
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-gray-400 text-sm font-medium transition-colors group-focus-within:text-red-400">Password Baru</label>
                    <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-transparent focus-within:border-red-500 focus-within:-translate-y-1 transition-all duration-300">
                      <Lock size={20} className="text-gray-500 transition-colors group-focus-within:text-red-500" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="mt-10 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-500 active:scale-95 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 shadow-[0_10px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgb(37,99,235,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-white w-full md:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={22} />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={22} />
                      Simpan Perubahan Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}