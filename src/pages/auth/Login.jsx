import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { Building2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  // 1. State Animasi Halaman
  const [isMounted, setIsMounted] = useState(false);

  // 2. Inisialisasi State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Trigger Animasi saat komponen pertama kali di-render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. Fungsi Utama Login dengan Logika RBAC (Role-Based Access Control)
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // A. Buka Pintu (Autentikasi Email & Password)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // B. Cek KTP / Role di tabel profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError; 
      }

      // C. Routing Cerdas berdasarkan Role
      const userRole = profile?.role || 'pegawai'; 

      if (userRole === 'admin') {
        navigate("/admin"); 
      } else if (userRole === 'pimpinan') {
        navigate("/pimpinan"); 
      } else {
        navigate("/pegawai"); 
      }

    } catch (error) {
      setLoading(false);
      // PERBAIKAN MUTLAK: Menampilkan error asli langsung dari mesin Supabase
      setErrorMsg("Sistem Database: " + error.message);
    } 
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 px-6 transform transition-all duration-1000 ease-out ${
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    }`}>
      
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-[40px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-blue-500/20">
        
        {/* LEFT (HERO) */}
        <div className="hidden lg:flex flex-col justify-center p-14 text-white relative overflow-hidden group">
          <div className="absolute w-72 h-72 bg-blue-500/30 rounded-full blur-3xl top-0 -left-10 animate-pulse duration-[4000ms]"></div>
          <div className="absolute w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse duration-[6000ms]"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-blue-500 flex items-center justify-center shadow-lg mb-8 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
              <Building2 size={40} />
            </div>

            <h1 className="text-6xl font-black leading-tight tracking-tight transform transition-transform duration-700 group-hover:translate-x-2">
              SIMPEG
            </h1>

            <p className="text-blue-100 mt-6 text-lg leading-relaxed opacity-90 transition-opacity duration-700 group-hover:opacity-100">
              Sistem Informasi Manajemen Pegawai modern untuk monitoring karyawan, absensi, dan aktivitas perusahaan realtime.
            </p>

            <div className="mt-10 flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02]">
              <ShieldCheck className="text-cyan-300 animate-bounce" size={35} style={{ animationDuration: '3s' }} />
              <div>
                <h3 className="font-bold text-lg">Secure Company System</h3>
                <p className="text-blue-100 text-sm">Akses ruangan disesuaikan dengan pangkat dan divisi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT (FORM - VERSI TERANG) */}
        <div className="bg-white p-10 lg:p-14 flex flex-col justify-center">
          
          <div className={`transition-all duration-700 delay-300 ${isMounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <p className="uppercase tracking-[5px] text-gray-400 text-sm font-medium">Welcome Back</p>
            <h2 className="text-5xl font-black mt-3 text-slate-900 tracking-tight">Login</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Masuk ke sistem perusahaan menggunakan identitas terdaftar.
            </p>
          </div>

          <form onSubmit={handleLogin} className={`mt-8 space-y-6 transition-all duration-700 delay-500 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3 animate-[pulse_2s_ease-in-out_infinite]">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                {/* Menampilkan pesan error mentah untuk proses investigasi */}
                <p className="text-red-700 text-sm font-bold break-words w-full">{errorMsg}</p>
              </div>
            )}

            <div className="group">
              <label className="text-sm font-semibold text-gray-600 transition-colors group-focus-within:text-blue-600">
                Email
              </label>
              <div className="mt-2 transition-transform duration-300 ease-out group-focus-within:-translate-y-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full bg-gray-100 border border-gray-200 text-slate-900 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-50 shadow-sm group-focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.15)]"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="group">
              <label className="text-sm font-semibold text-gray-600 transition-colors group-focus-within:text-blue-600">
                Password
              </label>
              <div className="mt-2 transition-transform duration-300 ease-out group-focus-within:-translate-y-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-gray-100 border border-gray-200 text-slate-900 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-50 shadow-sm group-focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.15)]"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <Link 
                to="/forgot-password" 
                className="text-blue-500 text-sm font-semibold hover:text-blue-700 hover:-translate-x-1 transition-all duration-300 mr-1 inline-block"
              >
                Lupa Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-5 rounded-2xl font-bold transition-all duration-300 shadow-[0_10px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgb(37,99,235,0.4)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Memverifikasi Akses...
                </>
              ) : (
                "Masuk ke Sistem"
              )}
            </button>
          </form>

          <div className={`mt-8 text-center transition-all duration-700 delay-700 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <p className="text-gray-500">Belum punya akun?</p>
            <Link 
              to="/register" 
              className="text-blue-600 font-bold mt-2 inline-block hover:text-blue-800 hover:-translate-y-0.5 transition-all duration-300"
            >
              Daftar sekarang
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}