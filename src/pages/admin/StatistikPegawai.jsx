import {
  Users,
  UserCheck,
  UserX,
  Briefcase,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function StatistikPegawai() {

  const stats = [
    {
      title: "Total Pegawai",
      value: "120",
      icon: <Users size={30} />,
      color: "bg-blue-500",
    },
    {
      title: "Pegawai Aktif",
      value: "98",
      icon: <UserCheck size={30} />,
      color: "bg-green-500",
    },
    {
      title: "Sedang Cuti",
      value: "22",
      icon: <UserX size={30} />,
      color: "bg-yellow-500",
    },
    {
      title: "Total Divisi",
      value: "8",
      icon: <Briefcase size={30} />,
      color: "bg-purple-500",
    },
  ];

  const progress = [
    {
      nama: "Kehadiran Pegawai",
      value: "92%",
      width: "92%",
    },
    {
      nama: "Produktivitas",
      value: "87%",
      width: "87%",
    },
    {
      nama: "Kinerja Divisi",
      value: "78%",
      width: "78%",
    },
  ];

  return (
    <div className="p-8 bg-[#f5f7fb] min-h-screen">

      {/* HEADER */}
      <div className="mb-10">

        <p className="uppercase tracking-[4px] text-gray-500 text-sm">
          Dashboard
        </p>

        <h1 className="text-5xl font-black mt-2">
          Statistik Pegawai
        </h1>
      </div>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-[35px] p-8 shadow-sm hover:-translate-y-1 transition duration-300"
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

              <div className={`${item.color} text-white p-4 rounded-2xl`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CONTENT */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* PROGRESS */}
        <div className="xl:col-span-2 bg-white rounded-[35px] p-8 shadow-sm">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-blue-500 text-white p-4 rounded-2xl">
              <TrendingUp size={28} />
            </div>

            <div>

              <p className="uppercase tracking-[4px] text-gray-500 text-sm">
                Monitoring
              </p>

              <h2 className="text-4xl font-black">
                Progress Perusahaan
              </h2>
            </div>
          </div>

          <div className="space-y-8">

            {progress.map((item, index) => (

              <div key={index}>

                <div className="flex justify-between mb-3">

                  <h3 className="font-bold text-lg">
                    {item.nama}
                  </h3>

                  <span className="font-black">
                    {item.value}
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

        {/* AKTIVITAS */}
        <div className="bg-[#111827] text-white rounded-[35px] p-8">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-green-500 p-4 rounded-2xl">
              <Activity size={28} />
            </div>

            <div>

              <p className="uppercase tracking-[4px] text-gray-400 text-sm">
                Realtime
              </p>

              <h2 className="text-4xl font-black">
                Aktivitas
              </h2>
            </div>
          </div>

          <div className="space-y-5">

            {[
              "Pegawai melakukan absensi",
              "Admin menambahkan data pegawai",
              "Divisi HR memperbarui laporan",
              "Monitoring perusahaan berjalan",
            ].map((item, index) => (

              <div
                key={index}
                className="bg-[#1f2937] p-5 rounded-2xl border border-gray-700"
              >

                <p className="font-semibold leading-relaxed">
                  {item}
                </p>

                <p className="text-gray-400 text-sm mt-2">
                  Baru saja diperbarui
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHART */}
      <section className="bg-white rounded-[35px] p-8 shadow-sm mt-8">

        <div className="flex items-center gap-4 mb-10">

          <div className="bg-purple-500 text-white p-4 rounded-2xl">
            <TrendingUp size={28} />
          </div>

          <div>

            <p className="uppercase tracking-[4px] text-gray-500 text-sm">
              Statistik
            </p>

            <h2 className="text-4xl font-black">
              Grafik Pegawai
            </h2>
          </div>
        </div>

        {/* CHART BAR */}
        <div className="flex items-end gap-6 h-[300px]">

          {[
            { bulan: "Jan", tinggi: "70%" },
            { bulan: "Feb", tinggi: "85%" },
            { bulan: "Mar", tinggi: "60%" },
            { bulan: "Apr", tinggi: "95%" },
            { bulan: "Mei", tinggi: "80%" },
            { bulan: "Jun", tinggi: "100%" },
          ].map((item, index) => (

            <div
              key={index}
              className="flex-1 flex flex-col items-center"
            >

              <div
                className="w-full bg-blue-500 rounded-t-3xl hover:opacity-80 transition"
                style={{ height: item.tinggi }}
              ></div>

              <p className="mt-4 font-bold">
                {item.bulan}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}