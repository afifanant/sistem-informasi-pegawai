import DashboardLayout from "../../layouts/PegawaiLayout";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Save,
  Shield,
} from "lucide-react";

export default function ProfilePegawai() {
  return (
    <DashboardLayout>
      <div className="p-6">

        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-[35px] p-10 text-white">

          <p className="uppercase tracking-[5px] text-blue-200 text-sm">
            Employee Profile
          </p>

          <h1 className="text-5xl font-black mt-4">
            Profile Saya
          </h1>

          <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
            Kelola data pribadi dan keamanan akun Anda.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

          {/* LEFT */}
          <div className="bg-[#111827] rounded-[35px] p-8 text-white text-center">

            <div className="relative w-[140px] h-[140px] mx-auto">

              <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center">
                <User size={70} />
              </div>

              <button className="absolute bottom-0 right-0 bg-cyan-500 p-3 rounded-full">
                <Camera size={20} />
              </button>
            </div>

            <h2 className="text-4xl font-black mt-8">
              Budi Santoso
            </h2>

            <p className="text-gray-400 mt-3">
              Frontend Developer
            </p>

            <div className="bg-blue-500/20 text-blue-400 px-5 py-3 rounded-2xl mt-8 inline-block font-bold">
              Employee Active
            </div>
          </div>

          {/* RIGHT */}
          <div className="xl:col-span-2 bg-[#111827] rounded-[35px] p-8 text-white">

            <div className="flex items-center gap-4 mb-8">

              <div className="bg-blue-600 p-4 rounded-2xl">
                <Shield size={28} />
              </div>

              <div>
                <p className="uppercase tracking-[4px] text-gray-400 text-sm">
                  Personal Information
                </p>

                <h2 className="text-4xl font-black">
                  Informasi Pribadi
                </h2>
              </div>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAMA */}
              <div>
                <label className="text-gray-400 text-sm">
                  Nama Lengkap
                </label>

                <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3">

                  <User size={20} className="text-gray-400" />

                  <input
                    type="text"
                    defaultValue="Budi Santoso"
                    className="bg-transparent outline-none w-full"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-gray-400 text-sm">
                  Email
                </label>

                <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3">

                  <Mail size={20} className="text-gray-400" />

                  <input
                    type="email"
                    defaultValue="budi@gmail.com"
                    className="bg-transparent outline-none w-full"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="text-gray-400 text-sm">
                  Nomor Telepon
                </label>

                <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3">

                  <Phone size={20} className="text-gray-400" />

                  <input
                    type="text"
                    defaultValue="08123456789"
                    className="bg-transparent outline-none w-full"
                  />
                </div>
              </div>

              {/* ALAMAT */}
              <div>
                <label className="text-gray-400 text-sm">
                  Alamat
                </label>

                <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3">

                  <MapPin size={20} className="text-gray-400" />

                  <input
                    type="text"
                    defaultValue="Medan, Indonesia"
                    className="bg-transparent outline-none w-full"
                  />
                </div>
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mt-10">

              <h3 className="text-2xl font-black mb-6">
                Update Password
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                  <label className="text-gray-400 text-sm">
                    Password Lama
                  </label>

                  <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3">

                    <Lock size={20} className="text-gray-400" />

                    <input
                      type="password"
                      placeholder="••••••••"
                      className="bg-transparent outline-none w-full"
                    />
                  </div>
                </div>

                <div>

                  <label className="text-gray-400 text-sm">
                    Password Baru
                  </label>

                  <div className="bg-[#1f2937] rounded-2xl px-5 py-4 flex items-center gap-4 mt-3">

                    <Lock size={20} className="text-gray-400" />

                    <input
                      type="password"
                      placeholder="••••••••"
                      className="bg-transparent outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition">

              <Save size={22} />

              Simpan Perubahan
            </button>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}