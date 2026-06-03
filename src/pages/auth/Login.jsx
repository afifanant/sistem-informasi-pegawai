import { useNavigate } from "react-router-dom";
import { Building2, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (role) => {

  localStorage.setItem(
    "user",
    JSON.stringify({
      role,
    })
  );

  if (role === "admin") {
    navigate("/admin");
  }

  if (role === "pegawai") {
    navigate("/pegawai");
  }

  if (role === "pimpinan") {
    navigate("/pimpinan");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 px-6">

      {/* CARD LOGIN */}
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">

        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-center p-14 text-white relative overflow-hidden">

          <div className="absolute w-72 h-72 bg-blue-500/30 rounded-full blur-3xl top-0 -left-10"></div>
          <div className="absolute w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl bottom-0 right-0"></div>

          <div className="relative z-10">

            <div className="w-20 h-20 rounded-3xl bg-blue-500 flex items-center justify-center shadow-lg mb-8">
              <Building2 size={40} />
            </div>

            <h1 className="text-6xl font-black leading-tight">
              SIMPEG
            </h1>

            <p className="text-blue-100 mt-6 text-lg leading-relaxed">
              Sistem Informasi Manajemen Pegawai modern
              untuk monitoring karyawan, absensi,
              dan aktivitas perusahaan realtime.
            </p>

            <div className="mt-10 flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl p-5">
              <ShieldCheck className="text-cyan-300" size={35} />

              <div>
                <h3 className="font-bold text-lg">
                  Secure Company System
                </h3>

                <p className="text-blue-100 text-sm">
                  Data perusahaan terenkripsi dan aman.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-10 lg:p-14 flex flex-col justify-center">

          <div className="mb-10">
            <p className="uppercase tracking-[5px] text-gray-400 text-sm">
              Welcome Back
            </p>

            <h2 className="text-5xl font-black mt-3 text-slate-900">
              Login
            </h2>

            <p className="text-gray-500 mt-4 leading-relaxed">
              Masuk ke sistem perusahaan untuk
              mengakses dashboard pegawai.
            </p>
          </div>

          {/* INPUT */}
          <div className="space-y-6">

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email
              </label>

              <input
                type="email"
                placeholder="Masukkan email"
                className="w-full mt-2 bg-gray-100 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Password
              </label>

              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full mt-2 bg-gray-100 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* FORGOT PASSWORD */}
<div className="flex justify-end mb-6">

  <a
    href="/forgot-password"
    className="text-blue-500 font-semibold hover:text-blue-400 transition mr-1"
  >
    Lupa Password?
  </a>
</div>

          {/* BUTTON */}
          <div className="grid grid-cols-1 gap-4 mt-10">

            <button
              onClick={() => handleLogin("admin")}
              className="bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all"
            >
              Login Sebagai Admin
            </button>

            <button
              onClick={() => handleLogin("pegawai")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all"
            >
              Login Sebagai Pegawai
            </button>

            <button
              onClick={() => handleLogin("pimpinan")}
              className="bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-2xl font-bold transition-all"
            >
              Login Sebagai Pimpinan
            </button>
          </div>

          {/* REGISTER */}
          <div className="mt-8 text-center">

            <p className="text-gray-400">
              Belum punya akun?
            </p>

            <a
              href="/register"
              className="text-blue-500 font-bold mt-2 inline-block"
            >
              Daftar sekarang
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}