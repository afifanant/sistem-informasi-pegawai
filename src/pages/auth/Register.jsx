import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  // 1. State Animasi Halaman
  const [isMounted, setIsMounted] = useState(false);

  // 2. Inisialisasi State Penampung Data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 3. State untuk Status Proses
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Trigger Animasi saat komponen pertama kali di-render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 4. Fungsi Eksekutor Registrasi
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!fullName || !email || !password) {
      setMessage({ type: "error", text: "Semua kolom wajib diisi." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      setMessage({ 
        type: "success", 
        text: "Registrasi berhasil! Silakan login menggunakan akun Anda." 
      });
      
      setFullName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Penambahan transisi fade-in dan slide-up saat halaman di-load
    <div className={`min-h-screen bg-[#0f172a] flex items-center justify-center p-6 transform transition-all duration-1000 ease-out ${
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    }`}>
      
      {/* BOX CONTAINER */}
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-[#111827] rounded-[40px] overflow-hidden shadow-2xl border border-gray-800 transition-all duration-500 hover:shadow-blue-500/10 hover:border-gray-700">
        
        {/* LEFT (HERO) */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-cyan-500 p-14 text-white relative overflow-hidden group">
          {/* Efek glow background sinematik */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 group-hover:translate-x-10 transition-transform duration-1000"></div>

          <div className="relative z-10">
            <div className="bg-white/20 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-inner backdrop-blur-md transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
              <Building2 size={50} />
            </div>
            
            <p className="uppercase tracking-[6px] text-sm text-blue-100 font-semibold opacity-90">
              Company System
            </p>
            
            <h1 className="text-6xl font-black leading-tight mt-5 tracking-tight transform transition-transform duration-700 group-hover:translate-x-2">
              SIMPEG
              <br />
              Modern
            </h1>
            
            <p className="mt-8 text-lg leading-relaxed text-blue-100 max-w-md opacity-90 transition-opacity duration-700 group-hover:opacity-100">
              Sistem Informasi Manajemen Pegawai modern
              untuk monitoring realtime perusahaan,
              absensi digital, statistik, dan produktivitas.
            </p>
          </div>
        </div>

        {/* RIGHT (FORM) */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">
          <div className={`transition-all duration-700 delay-300 ${isMounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <p className="uppercase tracking-[5px] text-blue-500 text-sm font-bold">
              Register Account
            </p>
            <h2 className="text-5xl font-black text-white mt-4 tracking-tight">
              Buat Akun
            </h2>
            <p className="text-gray-400 mt-4 leading-relaxed">
              Daftarkan akun pegawai perusahaan Anda di sini.
            </p>
          </div>

          {/* Notifikasi Pesan */}
          {message.text && (
            <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 animate-[pulse_2s_ease-in-out_infinite] ${
              message.type === "success" 
                ? "bg-green-500/10 border-green-500/30 text-green-400" 
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}>
              {message.type === "success" ? <CheckCircle2 size={24} className="flex-shrink-0" /> : <AlertCircle size={24} className="flex-shrink-0" />}
              <p className="font-medium text-sm">{message.text}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleRegister} className={`mt-8 space-y-6 transition-all duration-700 delay-500 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            
            {/* NAMA */}
            <div className="group">
              <label className="text-gray-400 block mb-3 text-sm font-semibold transition-colors group-focus-within:text-blue-400">
                Nama Lengkap
              </label>
              {/* Penambahan efek elevate dan glow saat kolom di-klik (focus) */}
              <div className="bg-[#0f172a] border border-gray-700 focus-within:border-blue-500 focus-within:-translate-y-1 focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.15)] rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-300 ease-out">
                <User className="text-gray-500 transition-colors group-focus-within:text-blue-500" size={22} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                  disabled={loading}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="group">
              <label className="text-gray-400 block mb-3 text-sm font-semibold transition-colors group-focus-within:text-blue-400">
                Email
              </label>
              <div className="bg-[#0f172a] border border-gray-700 focus-within:border-blue-500 focus-within:-translate-y-1 focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.15)] rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-300 ease-out">
                <Mail className="text-gray-500 transition-colors group-focus-within:text-blue-500" size={22} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="group">
              <label className="text-gray-400 block mb-3 text-sm font-semibold transition-colors group-focus-within:text-blue-400">
                Password
              </label>
              <div className="bg-[#0f172a] border border-gray-700 focus-within:border-blue-500 focus-within:-translate-y-1 focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.15)] rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-300 ease-out">
                <Lock className="text-gray-500 transition-colors group-focus-within:text-blue-500" size={22} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                  disabled={loading}
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all duration-300 py-5 rounded-2xl text-white font-bold text-lg shadow-[0_10px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgb(37,99,235,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-3" size={24} />
                  Memproses Pendaftaran...
                </>
              ) : (
                "Register Sekarang"
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className={`mt-8 text-center transition-all duration-700 delay-700 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <p className="text-gray-400">
              Sudah punya akun?
            </p>
            <Link
              to="/"
              className="text-blue-500 font-bold mt-2 inline-block hover:text-blue-400 hover:-translate-y-0.5 transition-all duration-300"
            >
              Login di sini
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}