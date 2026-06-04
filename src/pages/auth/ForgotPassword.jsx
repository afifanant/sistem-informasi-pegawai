import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient"; 
import { 
  Mail, 
  ArrowLeft, 
  ShieldCheck, 
  Loader2, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";

export default function ForgotPassword() {
  // 1. State Animasi Halaman
  const [isMounted, setIsMounted] = useState(false);

  // 2. Inisialisasi State Penampung Data
  const [email, setEmail] = useState("");
  
  // 3. State untuk Status Proses
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Trigger Animasi saat komponen pertama kali di-render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 4. Fungsi Eksekutor Reset Password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: "error", text: "Email perusahaan wajib diisi." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/update-password", 
      });

      if (error) throw error;

      setMessage({ 
        type: "success", 
        text: "Link reset password telah dikirim. Silakan cek kotak masuk email Anda." 
      });
      
      setEmail("");

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
      
      {/* CONTAINER */}
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-[#111827] rounded-[40px] overflow-hidden shadow-2xl border border-gray-800 transition-all duration-500 hover:shadow-blue-500/10 hover:border-gray-700">
        
        {/* LEFT (HERO) */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-cyan-500 p-14 text-white relative overflow-hidden group">
          {/* Efek glow background sinematik */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform -translate-x-20 -translate-y-20 group-hover:translate-x-10 transition-transform duration-1000"></div>

          <div className="relative z-10">
            <div className="bg-white/20 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-inner backdrop-blur-md transform transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
              <ShieldCheck size={50} />
            </div>

            <p className="uppercase tracking-[6px] text-sm text-blue-100 font-semibold opacity-90">
              Security System
            </p>

            <h1 className="text-6xl font-black leading-tight mt-5 tracking-tight transform transition-transform duration-700 group-hover:translate-x-2">
              Forgot
              <br />
              Password
            </h1>

            <p className="mt-8 text-lg leading-relaxed text-blue-100 max-w-md opacity-90 transition-opacity duration-700 group-hover:opacity-100">
              Reset password akun perusahaan dengan sistem keamanan modern dan profesional.
            </p>
          </div>
        </div>

        {/* RIGHT (FORM) */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">
          
          <div className={`transition-all duration-700 delay-300 ${isMounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <Link
              to="/"
              className="flex items-center gap-2 text-blue-500 font-semibold mb-8 hover:text-blue-400 hover:-translate-x-1 transition-all duration-300 w-fit"
            >
              <ArrowLeft size={20} />
              Kembali ke Login
            </Link>

            <p className="uppercase tracking-[5px] text-blue-500 text-sm font-bold">
              Password Recovery
            </p>

            <h2 className="text-5xl font-black text-white mt-4 leading-tight tracking-tight">
              Lupa Password?
            </h2>

            <p className="text-gray-400 mt-5 leading-relaxed">
              Masukkan email perusahaan Anda dan sistem akan mengirim link reset password.
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
          <form onSubmit={handleSubmit} className={`mt-8 transition-all duration-700 delay-500 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            
            <div className="group">
              <label className="text-gray-400 block mb-3 text-sm font-semibold transition-colors group-focus-within:text-blue-400">
                Email Perusahaan
              </label>

              <div className="bg-[#0f172a] border border-gray-700 focus-within:border-blue-500 focus-within:-translate-y-1 focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.15)] rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-300 ease-out">
                <Mail className="text-gray-500 transition-colors group-focus-within:text-blue-500" size={22} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email perusahaan"
                  className="bg-transparent outline-none w-full text-white placeholder-gray-600"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all duration-300 py-5 rounded-2xl text-white font-bold text-lg shadow-[0_10px_20px_rgb(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgb(37,99,235,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-3" size={24} />
                  Memproses Permintaan...
                </>
              ) : (
                "Kirim Link Reset"
              )}
            </button>
          </form>

          {/* INFO */}
          <div className={`mt-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 transition-all duration-700 delay-700 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            <p className="text-blue-300 leading-relaxed text-sm">
              Pastikan email yang dimasukkan sesuai dengan akun perusahaan Anda yang terdaftar pada sistem database.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}