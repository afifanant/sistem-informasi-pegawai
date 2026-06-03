import DashboardLayout from "../../layouts/AdminLayout";

import {
  CalendarCheck,
  Clock3,
  Search,
  CheckCircle2,
  XCircle,
  TimerReset,
} from "lucide-react";

export default function AbsensiAdmin() {

  const dataAbsensi = [
    {
      nama: "Budi Santoso",
      divisi: "IT Development",
      masuk: "08:00",
      pulang: "17:00",
      status: "Hadir",
    },
    {
      nama: "Siti Rahma",
      divisi: "Human Resource",
      masuk: "-",
      pulang: "-",
      status: "Izin",
    },
    {
      nama: "Andi Saputra",
      divisi: "Finance",
      masuk: "08:15",
      pulang: "17:10",
      status: "Terlambat",
    },
    {
      nama: "Rina Putri",
      divisi: "Marketing",
      masuk: "08:02",
      pulang: "17:00",
      status: "Hadir",
    },
  ];

  return (
    <DashboardLayout>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-[35px] p-10 text-white">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Attendance System
        </p>

        <h1 className="text-5xl font-black mt-4">
          Monitoring Absensi
        </h1>

        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Pantau absensi pegawai perusahaan secara realtime dan modern.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        {/* HADIR */}
        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Hadir Hari Ini
              </p>

              <h2 className="text-5xl font-black mt-3">
                92
              </h2>
            </div>

            <div className="bg-green-500 p-4 rounded-2xl">
              <CheckCircle2 size={28} />
            </div>
          </div>
        </div>

        {/* IZIN */}
        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Izin / Cuti
              </p>

              <h2 className="text-5xl font-black mt-3">
                8
              </h2>
            </div>

            <div className="bg-yellow-500 p-4 rounded-2xl">
              <TimerReset size={28} />
            </div>
          </div>
        </div>

        {/* TERLAMBAT */}
        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Terlambat
              </p>

              <h2 className="text-5xl font-black mt-3">
                5
              </h2>
            </div>

            <div className="bg-red-500 p-4 rounded-2xl">
              <XCircle size={28} />
            </div>
          </div>
        </div>

        {/* TOTAL */}
        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Total Absensi
              </p>

              <h2 className="text-5xl font-black mt-3">
                105
              </h2>
            </div>

            <div className="bg-blue-500 p-4 rounded-2xl">
              <CalendarCheck size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white">

        {/* TOPBAR */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <p className="uppercase tracking-[4px] text-gray-400 text-sm">
              Realtime Monitoring
            </p>

            <h2 className="text-4xl font-black mt-2">
              Data Absensi Pegawai
            </h2>
          </div>

          {/* SEARCH */}
          <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[350px]">

            <Search className="text-gray-400" size={22} />

            <input
              type="text"
              placeholder="Cari pegawai..."
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-gray-700 text-left text-gray-400">

                <th className="pb-5">Nama</th>
                <th className="pb-5">Divisi</th>
                <th className="pb-5">Jam Masuk</th>
                <th className="pb-5">Jam Pulang</th>
                <th className="pb-5">Status</th>
              </tr>
            </thead>

            <tbody>

              {dataAbsensi.map((item, index) => (

                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-[#1f2937] transition"
                >

                  <td className="py-5 font-semibold">
                    {item.nama}
                  </td>

                  <td className="py-5 text-gray-300">
                    {item.divisi}
                  </td>

                  <td className="py-5">

                    <div className="flex items-center gap-2">

                      <Clock3 size={18} />

                      {item.masuk}
                    </div>
                  </td>

                  <td className="py-5">

                    <div className="flex items-center gap-2">

                      <Clock3 size={18} />

                      {item.pulang}
                    </div>
                  </td>

                  <td className="py-5">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        item.status === "Hadir"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "Izin"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* ACTIVITY */}
        <div className="xl:col-span-2 bg-gradient-to-br from-blue-600 to-slate-950 rounded-[35px] p-8 text-white">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-blue-500 p-4 rounded-2xl">
              <CalendarCheck size={28} />
            </div>

            <div>

              <p className="uppercase tracking-[4px] text-blue-200 text-sm">
                Realtime
              </p>

              <h2 className="text-4xl font-black">
                Aktivitas Absensi
              </h2>
            </div>
          </div>

          <div className="space-y-5">

            {[
              "Pegawai melakukan check in",
              "Absensi realtime berhasil diperbarui",
              "Admin memonitor data absensi",
              "Laporan absensi berhasil dibuat",
              "Sistem absensi berjalan normal",
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

        {/* STATUS */}
        <div className="space-y-6">

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[35px] p-8 text-white">

            <p className="uppercase tracking-[4px] text-cyan-100 text-sm">
              Productivity
            </p>

            <h2 className="text-7xl font-black mt-5">
              96%
            </h2>

            <p className="mt-4 text-cyan-100 leading-relaxed">
              Tingkat kehadiran pegawai meningkat minggu ini.
            </p>
          </div>

          <div className="bg-[#111827] rounded-[35px] p-8 text-white">

            <p className="uppercase tracking-[4px] text-gray-400 text-sm">
              System Status
            </p>

            <h2 className="text-4xl font-black mt-4">
              Server Active
            </h2>

            <div className="flex items-center gap-3 mt-6">

              <div className="w-4 h-4 rounded-full bg-green-500"></div>

              <p className="font-semibold">
                Semua sistem absensi berjalan normal
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}