import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Building2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState(""); // Dikembalikan ke nama state yang spesifik
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setErrorMsg("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const targetUsername = username.trim().toLowerCase();
      
      // LOGIKA KUNCI: Otomatis bungkus username menjadi format email internal perusahaan
      const targetEmail = `${targetUsername}@saadahdinar.internal`; 

      // LANGKAH 1: Ambil data profile murni berdasarkan username untuk memvalidasi ROLE
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('id, role, username')
        .eq('username', targetUsername)
        .maybeSingle();

      if (userError) {
        console.error("Gagal SELECT profiles:", userError.message);
        throw new Error("Gagal querying schema database: " + userError.message);
      }

      if (!userProfile) {
        throw new Error("Username tidak terdaftar dalam sistem perusahaan.");
      }

      // LANGKAH 2: Eksekusi Sign-In murni ke Supabase Auth Core menggunakan email manipulasi internal
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: password,
      });

      if (authError) {
        console.error("Gagal Authenticate Supabase Auth:", authError.message);
        if (authError.message === "Invalid login credentials") {
          throw new Error("Username tidak ditemukan atau password salah.");
        }
        throw authError;
      }

      // LANGKAH 3: Routing Dinamis Akurat Berdasarkan Role
      const userRole = userProfile.role || 'pegawai'; 

      if (userRole === 'admin') {
        navigate("/admin"); 
      } else if (userRole === 'pimpinan') {
        navigate("/pimpinan"); 
      } else {
        navigate("/pegawai"); 
      }

    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message);
    } 
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 px-6 transform transition-all duration-1000 ease-out ${
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    }`}>
      
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
        
        {/* LEFT PANEL (HERO) */}
        <div className="hidden lg:flex flex-col justify-center p-14 text-white relative overflow-hidden group">
          <div className="absolute w-72 h-72 bg-blue-500/30 rounded-full blur-3xl top-0 -left-10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-blue-500 flex items-center justify-center shadow-lg mb-8">
              <Building2 size={40} />
            </div>
            <p className="uppercase tracking-[4px] text-cyan-300 text-sm font-bold mb-3">
              Sistem Informasi Manajemen Pegawai
            </p>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              PT. SA'ADAH DINAR
            </h1>
            <div className="mt-10 flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl p-5">
              <ShieldCheck className="text-cyan-300" size={35} />
              <div>
                <h3 className="font-bold text-lg">Secure Access Control</h3>
                <p className="text-blue-100 text-sm">Masuk menggunakan ID Username Karyawan yang telah divalidasi HRD.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (FORM) */}
        <div className="bg-white p-10 lg:p-14 flex flex-col justify-center">
          <div>
            <p className="uppercase tracking-[5px] text-gray-400 text-sm font-medium">Portal Log In</p>
            <h2 className="text-5xl font-black mt-3 text-slate-900 tracking-tight">Sign In</h2>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                <p className="text-red-700 text-sm font-bold break-words w-full">{errorMsg}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Username Karyawan
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan nama username (Cth: afif)"
                  className="w-full bg-gray-100 border border-gray-200 text-slate-900 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-sm"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Password Akses
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-gray-100 border border-gray-200 text-slate-900 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Memverifikasi Akun Personel...
                </>
              ) : (
                "Masuk ke Sistem"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}