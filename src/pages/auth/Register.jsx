import { User, Mail, Lock, Building2 } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">

      {/* BOX */}
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-[#111827] rounded-[40px] overflow-hidden shadow-2xl border border-gray-800">

        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-cyan-500 p-14 text-white">

          <div className="bg-white/20 w-24 h-24 rounded-3xl flex items-center justify-center mb-8">
            <Building2 size={50} />
          </div>

          <p className="uppercase tracking-[6px] text-sm text-blue-100">
            Company System
          </p>

          <h1 className="text-6xl font-black leading-tight mt-5">
            SIMPEG
            <br />
            Modern
          </h1>

          <p className="mt-8 text-lg leading-relaxed text-blue-100">
            Sistem Informasi Manajemen Pegawai modern
            untuk monitoring realtime perusahaan,
            absensi digital, statistik, dan produktivitas.
          </p>
        </div>

        {/* RIGHT */}
        <div className="p-10 lg:p-14">

          <p className="uppercase tracking-[5px] text-blue-500 text-sm">
            Register Account
          </p>

          <h2 className="text-5xl font-black text-white mt-4">
            Buat Akun
          </h2>

          <p className="text-gray-400 mt-4">
            Daftarkan akun pegawai perusahaan.
          </p>

          {/* FORM */}
          <form className="mt-10 space-y-6">

            {/* NAMA */}
            <div>

              <label className="text-gray-300 block mb-3">
                Nama Lengkap
              </label>

              <div className="bg-[#0f172a] border border-gray-700 rounded-2xl px-5 py-4 flex items-center gap-4">

                <User className="text-blue-500" size={22} />

                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="bg-transparent outline-none w-full text-white"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>

              <label className="text-gray-300 block mb-3">
                Email
              </label>

              <div className="bg-[#0f172a] border border-gray-700 rounded-2xl px-5 py-4 flex items-center gap-4">

                <Mail className="text-blue-500" size={22} />

                <input
                  type="email"
                  placeholder="Masukkan email"
                  className="bg-transparent outline-none w-full text-white"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-gray-300 block mb-3">
                Password
              </label>

              <div className="bg-[#0f172a] border border-gray-700 rounded-2xl px-5 py-4 flex items-center gap-4">

                <Lock className="text-blue-500" size={22} />

                <input
                  type="password"
                  placeholder="Masukkan password"
                  className="bg-transparent outline-none w-full text-white"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-5 rounded-2xl text-white font-bold text-lg shadow-lg"
            >
              Register Sekarang
            </button>
          </form>

          {/* LOGIN */}
          <div className="mt-8 text-center">

            <p className="text-gray-400">
              Sudah punya akun?
            </p>

            <a
              href="/"
              className="text-blue-500 font-bold mt-2 inline-block"
            >
              Login di sini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}