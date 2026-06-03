import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  // 1. Inisialisasi State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 2. Fungsi Utama Login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setLoading(false);
      setErrorMsg("Email atau password salah.");
      return;
    }

    navigate("/pegawai"); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 px-6 transition-all duration-500">
      
      {/* CARD LOGIN */}
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-[40px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-blue-500/10">
        
        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-center p-14 text-white relative overflow-hidden">
          <div className="absolute w-72 h-72 bg-blue-500/30 rounded-full blur-3xl top-0 -left-10 animate-pulse duration-[4000ms]"></div>
          <div className="absolute w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse duration-[6000ms]"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-blue-500 flex items-center justify-center shadow-lg mb-8 transform hover:rotate-6 transition-transform duration-300">
              <Building2 size={40} />
            </div>

            <h1 className="text-6xl font-black leading-tight tracking-tight">SIMPEG</h1>

            <p className="text-blue-100 mt-6 text-lg leading-relaxed">
              Sistem Informasi Manajemen Pegawai modern untuk monitoring karyawan, absensi, dan aktivitas perusahaan realtime.
            </p>

            <div className="mt-10 flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-white/15">
              <ShieldCheck className="text-cyan-300 animate-bounce" size={35} style={{ animationDuration: '3s' }} />
              <div>
                <h3 className="font-bold text-lg">Secure Company System</h3>
                <p className="text-blue-100 text-sm">Data perusahaan terenkripsi dan aman.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-10 lg:p-14 flex flex-col justify-center">
          <div className="mb-10">
            <p className="uppercase tracking-[5px] text-gray-400 text-sm font-medium">Welcome Back</p>
            <h2 className="text-5xl font-black mt-3 text-slate-900 tracking-tight">Login</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Masuk ke sistem perusahaan untuk mengakses dashboard.
            </p>
          </div>

          {/* Form Utama */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3 animate-headShake">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                <p className="text-red-700 text-sm font-medium">{errorMsg}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className="w-full mt-2 bg-gray-100 border border-gray-200 text-slate-900 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-50"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full mt-2 bg-gray-100 border border-gray-200 text-slate-900 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-50"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end mb-6">
              <a href="/forgot-password" className="text-blue-500 text-sm font-semibold hover:text-blue-600 transition-colors duration-200 mr-1">
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Memproses...
                </>
              ) : (
                "Masuk ke Sistem"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">Belum punya akun?</p>
            <a href="/register" className="text-blue-500 font-bold mt-2 inline-block hover:text-blue-600 transition-colors duration-200">
              Daftar sekarang
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}