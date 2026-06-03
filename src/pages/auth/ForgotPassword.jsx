import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";

export default function ForgotPassword() {

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Link reset password berhasil dikirim!");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">

      {/* CONTAINER */}
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-[#111827] rounded-[40px] overflow-hidden shadow-2xl border border-gray-800">

        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-cyan-500 p-14 text-white">

          <div className="bg-white/20 w-24 h-24 rounded-3xl flex items-center justify-center mb-8">

            <ShieldCheck size={50} />
          </div>

          <p className="uppercase tracking-[6px] text-sm text-blue-100">
            Security System
          </p>

          <h1 className="text-6xl font-black leading-tight mt-5">
            Forgot
            <br />
            Password
          </h1>

          <p className="mt-8 text-lg leading-relaxed text-blue-100">
            Reset password akun perusahaan dengan sistem keamanan modern dan profesional.
          </p>
        </div>

        {/* RIGHT */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">

          <a
            href="/"
            className="flex items-center gap-2 text-blue-500 font-semibold mb-8"
          >
            <ArrowLeft size={20} />

            Kembali ke Login
          </a>

          <p className="uppercase tracking-[5px] text-blue-500 text-sm">
            Password Recovery
          </p>

          <h2 className="text-5xl font-black text-white mt-4 leading-tight">
            Lupa Password?
          </h2>

          <p className="text-gray-400 mt-5 leading-relaxed">
            Masukkan email perusahaan Anda dan sistem akan mengirim link reset password.
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-10"
          >

            <label className="text-gray-300 block mb-3">
              Email Perusahaan
            </label>

            <div className="bg-[#0f172a] border border-gray-700 rounded-2xl px-5 py-4 flex items-center gap-4">

              <Mail
                className="text-blue-500"
                size={22}
              />

              <input
                type="email"
                placeholder="Masukkan email perusahaan"
                className="bg-transparent outline-none w-full text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 transition-all py-5 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-600/20"
            >
              Kirim Link Reset
            </button>
          </form>

          {/* INFO */}
          <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">

            <p className="text-blue-300 leading-relaxed">
              Pastikan email yang dimasukkan sesuai dengan akun perusahaan Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}