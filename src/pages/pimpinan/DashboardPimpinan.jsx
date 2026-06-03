import DashboardLayout from "../../layouts/PimpinanLayout";

import {
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Bell,
} from "lucide-react";

export default function DashboardPimpinan() {
  return (
    <DashboardLayout role="pimpinan">

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#0f172a] rounded-[35px] p-10 text-white shadow-2xl">

        <p className="uppercase tracking-[6px] text-blue-200 text-sm">
          Dashboard
        </p>

        <h1 className="text-6xl font-black leading-tight mt-4">
          Monitoring
          <br />
          Pegawai Proyek
        </h1>

        <p className="text-blue-100 mt-6 max-w-2xl leading-relaxed">
          Monitoring performa pegawai, statistik perusahaan,
          laporan realtime, dan aktivitas operasional perusahaan.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        {[
          {
            title: "Total Pegawai",
            value: "120",
            icon: <Users size={28} />,
            color: "bg-yellow-500/20 text-yellow-400",
          },
          {
            title: "Tugas Aktif",
            value: "45",
            icon: <Briefcase size={28} />,
            color: "bg-blue-500/20 text-blue-400",
          },
          {
            title: "Produktivitas",
            value: "91%",
            icon: <TrendingUp size={28} />,
            color: "bg-green-500/20 text-green-400",
          },
          {
            title: "Efisiensi",
            value: "$24K",
            icon: <DollarSign size={28} />,
            color: "bg-orange-500/20 text-orange-400",
          },
        ].map((item, index) => (

          <div
            key={index}
            className="bg-[#111827] border border-gray-800 rounded-3xl p-7"
          >

            <p className="text-gray-400">
              {item.title}
            </p>

            <div className="flex justify-between items-center mt-5">

              <h2 className="text-5xl font-black text-white">
                {item.value}
              </h2>

              <div className={`${item.color} p-4 rounded-2xl`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* LEFT */}
        <div className="xl:col-span-2 bg-[#0f172a] border border-gray-800 rounded-[35px] p-8">

          <div className="flex justify-between items-center mb-8">

            <div>

              <p className="uppercase tracking-[4px] text-gray-500 text-sm">
                Monitoring
              </p>

              <h2 className="text-4xl font-black text-white mt-2">
                Statistik Pegawai
              </h2>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl text-white font-bold">
              Download
            </button>
          </div>

          <div className="space-y-6">

            {[
              {
                nama: "Kehadiran Pegawai",
                value: "98%",
              },
              {
                nama: "Produktivitas Pegawai",
                value: "87%",
              },
              {
                nama: "Penyelesaian Tugas",
                value: "92%",
              },
            ].map((item, index) => (

              <div
                key={index}
                className="bg-[#111827] border border-gray-800 p-6 rounded-3xl"
              >

                <div className="flex justify-between items-center mb-4">

                  <h3 className="text-xl font-bold text-white">
                    {item.nama}
                  </h3>

                  <span className="bg-blue-600 px-4 py-2 rounded-xl text-white font-bold">
                    {item.value}
                  </span>
                </div>

                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: item.value }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-black rounded-[35px] border border-gray-800 p-8">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-yellow-500 p-4 rounded-2xl text-black">
              <Bell size={28} />
            </div>

            <div>

              <p className="uppercase tracking-[4px] text-gray-500 text-sm">
                Realtime
              </p>

              <h2 className="text-4xl font-black text-white">
                Aktivitas
              </h2>
            </div>
          </div>

          <div className="space-y-4">

            {[
              "Admin memperbarui data pegawai",
              "Pegawai melakukan absensi",
              "Laporan harian berhasil dikirim",
              "Monitoring realtime aktif",
            ].map((item, index) => (

              <div
                key={index}
                className="bg-[#111827] border border-gray-800 rounded-2xl p-5"
              >

                <p className="font-bold text-white">
                  {item}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  Baru saja diperbarui
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}