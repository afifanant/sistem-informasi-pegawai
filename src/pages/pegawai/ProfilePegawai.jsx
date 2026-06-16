import { useState, useEffect } from "react";
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
  Briefcase
} from "lucide-react";

export default function ProfilePegawai() {
  // 1. State Animasi & Referensi
  const [isMounted, setIsMounted] = useState(false);
  
  // 2. State untuk Data Karyawan (Hanya untuk ditampilkan)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);

  // State untuk Atribut UI
  const [loading, setLoading] = useState(true);
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
          setPhone(profile.phone_number || "");
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
              Berikut adalah informasi data diri dan posisi Anda di perusahaan. Jika terdapat kesalahan data, silakan hubungi pihak HR/Admin.
            </p>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {message.text && (
          <div className="mt-6 p-4 rounded-2xl border flex items-center gap-3 bg-red-500/10 border-red-500/30 text-red-400">
            <AlertCircle size={22} className="flex-shrink-0" />
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          
          {/* LEFT: AVATAR DISPLAY (Read-Only) */}
          <div className="bg-[#111827] rounded-[35px] p-8 text-white text-center flex flex-col justify-center border border-gray-800 shadow-xl transition-all hover:border-gray-700">
            <div className="relative w-[140px] h-[140px] mx-auto">
              {/* Gambar Avatar atau Default User Icon */}
              <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-inner overflow-hidden border-4 border-slate-800">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Karyawan" className="w-full h-full object-cover" />
                ) : (
                  <User size={70} className="text-white opacity-80" />
                )}
              </div>
            </div>

            <h2 className="text-3xl font-black mt-8 tracking-tight">{fullName || "Nama Belum Diatur"}</h2>
            <p className="text-gray-400 mt-2 font-medium">{position}</p>
            
            <div className="mt-4">
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-5 py-2 rounded-2xl inline-block font-bold text-xs uppercase tracking-wider shadow-sm">
                Employee Active
              </span>
            </div>
          </div>

          {/* RIGHT: ACCOUNT DETAILS (Read-Only) */}
          <div className="xl:col-span-2 bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 shadow-xl transition-all hover:border-gray-700">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                  <Shield size={28} />
                </div>
                <div>
                  <p className="uppercase tracking-[4px] text-gray-400 text-sm font-semibold">Personal Information</p>
                  <h2 className="text-4xl font-black tracking-tight">Informasi Pribadi</h2>
                </div>
              </div>

              {/* FIELD DATA (Disabled / Read-Only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm font-medium">Nama Lengkap</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <User size={20} className="text-gray-600" />
                    <input
                      type="text"
                      value={fullName}
                      readOnly
                      disabled
                      className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">Email Sistem (Sesi Aktif)</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <Mail size={20} className="text-gray-600" />
                    <input
                      type="email"
                      value={email}
                      readOnly
                      disabled
                      className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">Nomor Telepon</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <Phone size={20} className="text-gray-600" />
                    <input
                      type="text"
                      value={phone || "-"}
                      readOnly
                      disabled
                      className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium">Divisi Kerja / Posisi</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <Briefcase size={20} className="text-gray-600" />
                    <input
                      type="text"
                      value={position || "-"}
                      readOnly
                      disabled
                      className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm font-medium">Alamat Tempat Tinggal</label>
                  <div className="bg-[#1f2937]/40 rounded-2xl px-5 py-4 flex items-center gap-4 mt-3 border border-gray-800 cursor-not-allowed">
                    <MapPin size={20} className="text-gray-600" />
                    <input
                      type="text"
                      value={address || "-"}
                      readOnly
                      disabled
                      className="bg-transparent outline-none w-full text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}