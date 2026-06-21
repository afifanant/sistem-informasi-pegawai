import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../layouts/PegawaiLayout";
import { supabase } from "../../supabaseClient";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Loader2,
  AlertCircle,
  Briefcase,
  Camera,
  CheckCircle2,
  Key,
  Lock
} from "lucide-react";

export default function ProfilePegawai() {
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef(null);
  
  // State untuk Data Karyawan (Read-Only)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);

  // State untuk Atribut UI
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // State untuk Ubah Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

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
          setPhone(profile.phone_number || "");
          setAddress(profile.address || "");
          setPosition(profile.position || "Pegawai");
          setAvatarUrl(profile.avatar_url || null);
        } else if (dbError && dbError.code === "PGRST116") {
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

  const handleAvatarUpload = async (event) => {
    try {
      setUploadingAvatar(true);
      setMessage({ type: "", text: "" });

      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("Ukuran foto terlalu besar! Maksimal 2MB.");
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`; 

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw new Error("Gagal upload gambar. Pastikan bucket 'avatars' sudah di-set Public.");

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const newAvatarUrl = publicUrlData.publicUrl;
      setAvatarUrl(newAvatarUrl);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage({ type: "success", text: "Foto profil berhasil diperbarui!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // FUNGSI UBAH PASSWORD (DENGAN VERIFIKASI KEAMANAN)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validasi Dasar
    if (!oldPassword || !newPassword || !confirmPassword) {
      return setMessage({ type: "error", text: "Semua kolom password wajib diisi!" });
    }
    if (newPassword !== confirmPassword) {
      return setMessage({ type: "error", text: "Password baru dan konfirmasi tidak cocok!" });
    }
    if (newPassword.length < 6) {
      return setMessage({ type: "error", text: "Password baru minimal 6 karakter!" });
    }

    setUpdatingPassword(true);

    try {
      // 1. Verifikasi Password Lama (Penting: Coba login diam-diam)
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: email,
        password: oldPassword,
      });

      if (verifyError) {
        throw new Error("Password lama yang Anda masukkan salah!");
      }

      // 2. Jika password lama benar, lakukan update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setMessage({ type: "success", text: "Password berhasil diperbarui! Gunakan password baru untuk login selanjutnya." });
      
      // Reset Form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdatingPassword(false);
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
              Berikut adalah informasi data diri dan keamanan akun Anda.
            </p>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {message.text && (
          <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 transition-all ${
            message.type === "success" 
              ? "bg-green-500/10 border-green-500/30 text-green-400" 
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={22} className="flex-shrink-0" /> : <AlertCircle size={22} className="flex-shrink-0" />}
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          
          {/* LEFT: AVATAR DISPLAY */}
          <div className="bg-[#111827] rounded-[35px] p-8 text-white text-center flex flex-col justify-center border border-gray-800 shadow-xl transition-all hover:border-gray-700 h-fit">
            
            <div 
              className="relative w-[140px] h-[140px] mx-auto group cursor-pointer"
              onClick={() => !uploadingAvatar && fileInputRef.current.click()}
            >
              <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-inner overflow-hidden border-4 border-slate-800 relative transition-all group-hover:border-blue-500">
                {uploadingAvatar ? (
                  <div className="flex flex-col items-center justify-center text-white">
                    <Loader2 className="animate-spin mb-2" size={30} />
                    <span className="text-[10px] font-bold">Uploading...</span>
                  </div>
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Karyawan" className="w-full h-full object-cover group-hover:blur-[2px] transition-all" />
                ) : (
                  <User size={70} className="text-white opacity-80 group-hover:blur-[2px] transition-all" />
                )}
                
                {!uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera size={26} className="text-white mb-1" />
                    <span className="text-white text-xs font-bold tracking-wide">Ubah Foto</span>
                  </div>
                )}
              </div>

              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload}
              />
            </div>

            <h2 className="text-3xl font-black mt-8 tracking-tight">{fullName || "Nama Belum Diatur"}</h2>
            <p className="text-gray-400 mt-2 font-medium">{position}</p>
            
            <div className="mt-4">
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-5 py-2 rounded-2xl inline-block font-bold text-xs uppercase tracking-wider shadow-sm">
                Pegawai
              </span>
            </div>
          </div>

          {/* RIGHT: DATA & PASSWORD */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* INFORMASI PRIBADI */}
            <div className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 shadow-xl transition-all hover:border-gray-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                  <Shield size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Personal Information</p>
                  <h2 className="text-3xl font-black tracking-tight">Informasi Pribadi</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm font-medium">Nama Lengkap</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <User size={20} className="text-gray-600" />
                    <input type="text" value={fullName} readOnly disabled className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">Email Sistem</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <Mail size={20} className="text-gray-600" />
                    <input type="email" value={email} readOnly disabled className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">Nomor Telepon</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <Phone size={20} className="text-gray-600" />
                    <input type="text" value={phone || "-"} readOnly disabled className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">Divisi Kerja</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <Briefcase size={20} className="text-gray-600" />
                    <input type="text" value={position || "-"} readOnly disabled className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm font-medium">Alamat Tempat Tinggal</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <MapPin size={20} className="text-gray-600" />
                    <input type="text" value={address || "-"} readOnly disabled className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </div>

            {/* GANTI PASSWORD CARD */}
            <div className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 shadow-xl transition-all hover:border-gray-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-rose-600 p-4 rounded-2xl shadow-lg shadow-rose-500/20">
                  <Key size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Security Settings</p>
                  <h2 className="text-3xl font-black tracking-tight">Ubah Password</h2>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="text-gray-400 text-sm font-medium">Password Lama</label>
                  <div className="bg-[#1f2937]/80 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-700 focus-within:border-blue-500 transition-colors">
                    <Lock size={20} className="text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="Masukkan password saat ini"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                      disabled={updatingPassword}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-400 text-sm font-medium">Password Baru</label>
                    <div className="bg-[#1f2937]/80 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-700 focus-within:border-blue-500 transition-colors">
                      <Lock size={20} className="text-gray-400" />
                      <input 
                        type="password" 
                        placeholder="Minimal 6 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                        disabled={updatingPassword}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm font-medium">Konfirmasi Password Baru</label>
                    <div className="bg-[#1f2937]/80 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-700 focus-within:border-blue-500 transition-colors">
                      <Lock size={20} className="text-gray-400" />
                      <input 
                        type="password" 
                        placeholder="Ulangi password baru"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                        disabled={updatingPassword}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={updatingPassword || !oldPassword || !newPassword || !confirmPassword}
                    className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                      updatingPassword || !oldPassword || !newPassword || !confirmPassword
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
                    }`}
                  >
                    {updatingPassword ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Memverifikasi & Menyimpan...
                      </>
                    ) : (
                      "Simpan Password Baru"
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}