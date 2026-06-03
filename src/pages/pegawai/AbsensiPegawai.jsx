import DashboardLayout from "../../layouts/PegawaiLayout";

import {
  CalendarCheck,
  Clock3,
  CheckCircle2,
  MapPin,
  Timer,
} from "lucide-react";

export default function AbsensiPegawai() {

  const riwayat = [
    {
      tanggal: "24 Mei 2026",
      masuk: "08:00",
      pulang: "17:00",
      status: "Hadir",
    },
    {
      tanggal: "23 Mei 2026",
      masuk: "08:10",
      pulang: "17:00",
      status: "Terlambat",
    },
    {
      tanggal: "22 Mei 2026",
      masuk: "-",
      pulang: "-",
      status: "Izin",
    },
  ];

  return (
    <DashboardLayout>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Attendance Employee
        </p>

        <h1 className="text-5xl font-black mt-4">
          Absensi Saya
        </h1>

        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Kelola absensi dan pantau kehadiran kerja Anda secara realtime.
        </p>
      </div>

      {/* CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-[#111827] rounded-[35px] p-8 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Kehadiran
              </p>

              <h2 className="text-5xl font-black mt-4">
                96%
              </h2>
            </div>

            <div className="bg-green-500 p-4 rounded-2xl">

              <CheckCircle2 size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[35px] p-8 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Jam Kerja
              </p>

              <h2 className="text-5xl font-black mt-4">
                8h
              </h2>
            </div>

            <div className="bg-blue-500 p-4 rounded-2xl">

              <Clock3 size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[35px] p-8 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Lokasi
              </p>

              <h2 className="text-2xl font-black mt-4">
                Kantor Pusat
              </h2>
            </div>

            <div className="bg-cyan-500 p-4 rounded-2xl">

              <MapPin size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* BUTTON ABSENSI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <button className="bg-green-600 hover:bg-green-700 rounded-[35px] p-10 text-white transition-all hover:scale-[1.02]">

          <CalendarCheck size={50} />

          <h2 className="text-4xl font-black mt-6">
            Check In
          </h2>

          <p className="mt-4 text-green-100">
            Masuk kerja hari ini
          </p>
        </button>

        <button className="bg-red-600 hover:bg-red-700 rounded-[35px] p-10 text-white transition-all hover:scale-[1.02]">

          <Timer size={50} />

          <h2 className="text-4xl font-black mt-6">
            Check Out
          </h2>

          <p className="mt-4 text-red-100">
            Pulang kerja hari ini
          </p>
        </button>
      </div>

      {/* RIWAYAT */}
      <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white">

        <div className="mb-8">

          <p className="uppercase tracking-[4px] text-gray-400 text-sm">
            Attendance History
          </p>

          <h2 className="text-4xl font-black mt-2">
            Riwayat Absensi
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-gray-700 text-left text-gray-400">

                <th className="pb-5">Tanggal</th>
                <th className="pb-5">Masuk</th>
                <th className="pb-5">Pulang</th>
                <th className="pb-5">Status</th>
              </tr>
            </thead>

            <tbody>

              {riwayat.map((item, index) => (

                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-[#1f2937]"
                >

                  <td className="py-5 font-semibold">
                    {item.tanggal}
                  </td>

                  <td className="py-5">
                    {item.masuk}
                  </td>

                  <td className="py-5">
                    {item.pulang}
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

    </DashboardLayout>
  );
}