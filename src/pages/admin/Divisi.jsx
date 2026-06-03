import DashboardLayout from "../../layouts/AdminLayout";

import {
  Building2,
  Users,
  TrendingUp,
  Plus,
  Search,
  Briefcase,
} from "lucide-react";

export default function Divisi() {

  const dataDivisi = [
    {
      nama: "IT Development",
      manager: "Budi Santoso",
      pegawai: 25,
      progress: "92%",
      warna: "from-blue-500 to-cyan-400",
    },
    {
      nama: "Human Resource",
      manager: "Siti Rahma",
      pegawai: 18,
      progress: "87%",
      warna: "from-green-500 to-emerald-400",
    },
    {
      nama: "Finance",
      manager: "Andi Saputra",
      pegawai: 14,
      progress: "80%",
      warna: "from-yellow-500 to-orange-400",
    },
    {
      nama: "Marketing",
      manager: "Rina Putri",
      pegawai: 20,
      progress: "95%",
      warna: "from-pink-500 to-rose-400",
    },
  ];

  return (
    <DashboardLayout>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-[35px] p-10 text-white">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Division Management
        </p>

        <h1 className="text-5xl font-black mt-4">
          Data Divisi Perusahaan
        </h1>

        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Kelola seluruh divisi perusahaan secara modern dan realtime.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Total Divisi
              </p>

              <h2 className="text-5xl font-black mt-3">
                8
              </h2>
            </div>

            <div className="bg-blue-500 p-4 rounded-2xl">
              <Building2 size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Total Pegawai
              </p>

              <h2 className="text-5xl font-black mt-3">
                120
              </h2>
            </div>

            <div className="bg-green-500 p-4 rounded-2xl">
              <Users size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Produktivitas
              </p>

              <h2 className="text-5xl font-black mt-3">
                91%
              </h2>
            </div>

            <div className="bg-purple-500 p-4 rounded-2xl">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white">

        {/* TOPBAR */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">

          <div>

            <p className="uppercase tracking-[4px] text-gray-400 text-sm">
              Company Division
            </p>

            <h2 className="text-4xl font-black mt-2">
              List Divisi
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4">

            {/* SEARCH */}
            <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full md:w-[320px]">

              <Search className="text-gray-400" size={22} />

              <input
                type="text"
                placeholder="Cari divisi..."
                className="bg-transparent outline-none w-full"
              />
            </div>

            {/* BUTTON */}
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-[1.02]">

              <Plus size={22} />

              Tambah Divisi
            </button>
          </div>
        </div>

        {/* CARD DIVISI */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {dataDivisi.map((item, index) => (

            <div
              key={index}
              className="bg-[#1f2937] border border-gray-800 rounded-[30px] p-7 hover:border-blue-500 transition-all"
            >

              {/* TOP */}
              <div className="flex justify-between items-start">

                <div>

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.warna} flex items-center justify-center`}>

                    <Briefcase size={28} />
                  </div>

                  <h2 className="text-3xl font-black mt-5">
                    {item.nama}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Manager:
                    {" "}
                    {item.manager}
                  </p>
                </div>

                <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full font-bold text-sm">
                  Active
                </span>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-4 mt-8">

                <div className="bg-[#111827] rounded-2xl p-5">

                  <p className="text-gray-400 text-sm">
                    Pegawai
                  </p>

                  <h3 className="text-3xl font-black mt-2">
                    {item.pegawai}
                  </h3>
                </div>

                <div className="bg-[#111827] rounded-2xl p-5">

                  <p className="text-gray-400 text-sm">
                    Progress
                  </p>

                  <h3 className="text-3xl font-black mt-2">
                    {item.progress}
                  </h3>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-8">

                <div className="flex justify-between mb-3">

                  <p className="text-gray-400">
                    Kinerja Divisi
                  </p>

                  <p className="font-bold">
                    {item.progress}
                  </p>
                </div>

                <div className="w-full h-4 bg-[#111827] rounded-full overflow-hidden">

                  <div
                    className={`h-full bg-gradient-to-r ${item.warna}`}
                    style={{ width: item.progress }}
                  ></div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex gap-4 mt-8">

                <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold transition-all">
                  Detail
                </button>

                <button className="flex-1 bg-[#111827] hover:bg-black py-4 rounded-2xl font-bold transition-all border border-gray-700">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* LEFT */}
        <div className="xl:col-span-2 bg-gradient-to-br from-blue-600 to-slate-950 rounded-[35px] p-8 text-white">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-blue-500 p-4 rounded-2xl">
              <Building2 size={28} />
            </div>

            <div>

              <p className="uppercase tracking-[4px] text-blue-200 text-sm">
                Realtime Activity
              </p>

              <h2 className="text-4xl font-black">
                Aktivitas Divisi
              </h2>
            </div>
          </div>

          <div className="space-y-5">

            {[
              "Divisi IT menyelesaikan project baru",
              "HR memperbarui data pegawai",
              "Finance membuat laporan bulanan",
              "Marketing menjalankan campaign baru",
              "Monitoring divisi realtime aktif",
            ].map((item, index) => (

              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg border border-white/10 p-5 rounded-2xl"
              >

                <div className="flex items-center gap-4">

                  <div className="w-4 h-4 rounded-full bg-green-400"></div>

                  <p className="font-semibold">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[35px] p-8 text-white">

            <p className="uppercase tracking-[4px] text-cyan-100 text-sm">
              Productivity
            </p>

            <h2 className="text-7xl font-black mt-5">
              91%
            </h2>

            <p className="mt-4 text-cyan-100 leading-relaxed">
              Produktivitas seluruh divisi meningkat bulan ini.
            </p>
          </div>

          <div className="bg-[#111827] rounded-[35px] p-8 text-white">

            <p className="uppercase tracking-[4px] text-gray-400 text-sm">
              System Status
            </p>

            <h2 className="text-4xl font-black mt-4">
              All Division Active
            </h2>

            <div className="flex items-center gap-3 mt-6">

              <div className="w-4 h-4 rounded-full bg-green-500"></div>

              <p className="font-semibold">
                Semua divisi berjalan normal
              </p>
            </div>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}