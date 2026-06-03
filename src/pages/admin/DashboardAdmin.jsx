import AdminLayout from "../../layouts/AdminLayout";
import {
  Users,
  UserCheck,
  Activity,
  TrendingUp,
  Briefcase,
  Clock3,
} from "lucide-react";

export default function DashboardAdmin() {

  const stats = [
    {
      title: "Total Pegawai",
      value: "120",
      icon: <Users size={28} />,
      color: "bg-blue-500",
    },

    {
      title: "Pegawai Aktif",
      value: "98",
      icon: <UserCheck size={28} />,
      color: "bg-green-500",
    },

    {
      title: "Absensi Hari Ini",
      value: "87%",
      icon: <Activity size={28} />,
      color: "bg-orange-500",
    },

    {
      title: "Produktivitas",
      value: "91%",
      icon: <TrendingUp size={28} />,
      color: "bg-purple-500",
    },
  ];

  const aktivitas = [
    "Pegawai melakukan absensi",
    "Admin memperbarui data pegawai",
    "Monitoring realtime aktif",
    "Laporan perusahaan berhasil dibuat",
    "Sistem berjalan normal",
  ];

  const proyek = [
    {
      nama: "Pembangunan Gedung",
      progress: "90%",
      width: "90%",
    },

    {
      nama: "Monitoring Gudang",
      progress: "75%",
      width: "75%",
    },

    {
      nama: "Pengelolaan SDM",
      progress: "85%",
      width: "85%",
    },
  ];

  return (
    <AdminLayout>

      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-[40px] p-10 text-white mb-8 overflow-hidden relative">

        <div className="absolute w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl top-[-100px] right-[-100px]"></div>

        <div className="relative z-10">

          <p className="uppercase tracking-[5px] text-blue-200 text-sm">
            Dashboard Perusahaan
          </p>

          <h1 className="text-5xl lg:text-7xl font-black mt-5 leading-tight">
            Sistem Informasi
            <br />
            Pegawai Modern
          </h1>

          <p className="text-blue-100 mt-6 max-w-[700px] text-lg leading-relaxed">
            Monitoring realtime pegawai,
            absensi digital,
            statistik perusahaan,
            dan aktivitas operasional dalam satu sistem.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-[35px] p-8 shadow-sm hover:-translate-y-1 transition-all"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  {item.title}
                </p>

                <h2 className="text-5xl font-black mt-4">
                  {item.value}
                </h2>
              </div>

              <div className={`${item.color} text-white p-4 rounded-2xl shadow-lg`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CONTENT */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* AKTIVITAS */}
          <div className="bg-gradient-to-b from-blue-400 to-black rounded-[35px] p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-8">

              <div className="bg-blue-500 text-white p-4 rounded-2xl">
                <Clock3 size={28} />
              </div>

              <div>

                <p className="uppercase tracking-[4px] text-blu-100 text-sm">
                  Realtime
                </p>

                <h2 className="text-4xl font-black">
                  Aktivitas Perusahaan
                </h2>
              </div>
            </div>

            <div className="space-y-5">

              {aktivitas.map((item, index) => (

                <div
                  key={index}
                  className="bg-white/90 rounded-2xl p-5 flex items-center gap-4 border border-white/30"
                >

                  <div className="w-4 h-4 rounded-full bg-green-500"></div>

                  <p className="font-semibold text-gray-800">
  {item}
                    </p>
                </div>
              ))}
            </div>
          </div>

          {/* PROGRESS */}
          <div className="bg-gradient-to-br from-slate-800 to-blue-950 rounded-[35px] p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-10">

              <div className="bg-purple-500 text-white p-4 rounded-2xl">
                <Briefcase size={28} />
              </div>

              <div>

                <p className="uppercase tracking-[4px] text-gray-500 text-sm">
                  Monitoring
                </p>

                <h2 className="text-4xl font-black">
                  Progress Proyek
                </h2>
              </div>
            </div>

            <div className="space-y-8">

              {proyek.map((item, index) => (

                <div key={index}>

                  <div className="flex justify-between mb-3">

                    <h3 className="font-bold text-lg">
                      {item.nama}
                    </h3>

                    <span className="font-black">
                      {item.progress}
                    </span>
                  </div>

                  <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: item.width }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* CARD */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-[35px] p-8 shadow-xl">

            <p className="text-blue-100">
              Statistik Mingguan
            </p>

            <h2 className="text-7xl font-black mt-6">
              91%
            </h2>

            <p className="mt-6 leading-relaxed text-blue-100">
              Produktivitas perusahaan meningkat
              dibanding minggu sebelumnya.
            </p>
          </div>

          {/* CARD */}
          <div className="bg-slate-900 text-white rounded-[35px] p-8 shadow-xl">

            <p className="uppercase tracking-[4px] text-gray-400 text-sm">
              Sistem
            </p>

            <h2 className="text-4xl font-black mt-4">
              Status Server
            </h2>

            <div className="flex items-center gap-3 mt-8">

              <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse"></div>

              <p className="text-xl font-bold">
                Semua sistem berjalan normal
              </p>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}