import PegawaiLayout from "../../layouts/PegawaiLayout";

import {
  User,
  Briefcase,
  CalendarCheck,
  Clock3,
  TrendingUp,
  CheckCircle2,
  Bell,
  Target,
} from "lucide-react";

export default function DashboardPegawai() {

  const tugas = [
    {
      title: "Menyelesaikan UI Dashboard",
      status: "Progress",
      deadline: "Hari Ini",
    },
    {
      title: "Meeting Tim Development",
      status: "Pending",
      deadline: "13:00",
    },
    {
      title: "Upload Laporan Mingguan",
      status: "Selesai",
      deadline: "Kemarin",
    },
  ];

  return (
    <PegawaiLayout>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-[35px] p-10 text-white">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Employee Dashboard
        </p>

        <h1 className="text-5xl font-black mt-4">
          Selamat Datang 👋
        </h1>

        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Pantau pekerjaan, absensi, dan progress kerja Anda secara realtime.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        {/* ABSENSI */}
        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Kehadiran
              </p>

              <h2 className="text-5xl font-black mt-3">
                96%
              </h2>
            </div>

            <div className="bg-green-500 p-4 rounded-2xl">
              <CalendarCheck size={28} />
            </div>
          </div>
        </div>

        {/* TUGAS */}
        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Total Tugas
              </p>

              <h2 className="text-5xl font-black mt-3">
                12
              </h2>
            </div>

            <div className="bg-blue-500 p-4 rounded-2xl">
              <Briefcase size={28} />
            </div>
          </div>
        </div>

        {/* PRODUKTIVITAS */}
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

        {/* TARGET */}
        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Target
              </p>

              <h2 className="text-5xl font-black mt-3">
                85%
              </h2>
            </div>

            <div className="bg-cyan-500 p-4 rounded-2xl">
              <Target size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* TUGAS */}
          <div className="bg-[#111827] rounded-[35px] p-8 text-white">

            <div className="flex items-center gap-4 mb-8">

              <div className="bg-blue-600 p-4 rounded-2xl">
                <Briefcase size={28} />
              </div>

              <div>

                <p className="uppercase tracking-[4px] text-gray-400 text-sm">
                  My Task
                </p>

                <h2 className="text-4xl font-black">
                  Tugas Saya
                </h2>
              </div>
            </div>

            <div className="space-y-5">

              {tugas.map((item, index) => (

                <div
                  key={index}
                  className="bg-[#1f2937] rounded-2xl p-6 border border-gray-800"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="text-xl font-bold">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 mt-2">
                        Deadline:
                        {" "}
                        {item.deadline}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        item.status === "Selesai"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "Progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PROGRESS */}
          <div className="bg-gradient-to-br from-blue-700 to-slate-900 rounded-[35px] p-8 text-white">

            <div className="flex items-center gap-4 mb-8">

              <div className="bg-blue-500 p-4 rounded-2xl">
                <TrendingUp size={28} />
              </div>

              <div>

                <p className="uppercase tracking-[4px] text-blue-200 text-sm">
                  Performance
                </p>

                <h2 className="text-4xl font-black">
                  Progress Kerja
                </h2>
              </div>
            </div>

            {/* PROGRESS ITEM */}
            <div className="space-y-8">

              {[
                {
                  title: "Project UI/UX",
                  value: "92%",
                },
                {
                  title: "Development System",
                  value: "80%",
                },
                {
                  title: "Team Collaboration",
                  value: "95%",
                },
              ].map((item, index) => (

                <div key={index}>

                  <div className="flex justify-between mb-3">

                    <h3 className="font-bold">
                      {item.title}
                    </h3>

                    <span className="font-black">
                      {item.value}
                    </span>
                  </div>

                  <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: item.value }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* PROFILE */}
          <div className="bg-[#111827] rounded-[35px] p-8 text-white text-center">

            <div className="w-28 h-28 rounded-full bg-blue-600 mx-auto flex items-center justify-center">

              <User size={50} />
            </div>

            <h2 className="text-3xl font-black mt-6">
              Budi Santoso
            </h2>

            <p className="text-gray-400 mt-2">
              Frontend Developer
            </p>

            <button className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-bold transition">
              Edit Profile
            </button>
          </div>

          {/* AKTIVITAS */}
          <div className="bg-[#111827] rounded-[35px] p-8 text-white">

            <div className="flex items-center gap-4 mb-8">

              <div className="bg-green-500 p-4 rounded-2xl">
                <Bell size={28} />
              </div>

              <div>

                <p className="uppercase tracking-[4px] text-gray-400 text-sm">
                  Activity
                </p>

                <h2 className="text-4xl font-black">
                  Aktivitas
                </h2>
              </div>
            </div>

            <div className="space-y-5">

              {[
                "Berhasil check in pagi ini",
                "Menyelesaikan task dashboard",
                "Upload laporan mingguan",
                "Meeting dengan tim project",
              ].map((item, index) => (

                <div
                  key={index}
                  className="bg-[#1f2937] p-5 rounded-2xl border border-gray-800"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-3 h-3 rounded-full bg-green-400"></div>

                    <p className="font-semibold">
                      {item}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">

                    <Clock3 size={15} />

                    Baru saja
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[35px] p-8 text-white">

            <p className="uppercase tracking-[4px] text-cyan-100 text-sm">
              Employee Status
            </p>

            <h2 className="text-6xl font-black mt-5">
              Active
            </h2>

            <p className="mt-4 text-cyan-100 leading-relaxed">
              Status pegawai aktif dan bekerja normal hari ini.
            </p>

            <div className="flex items-center gap-3 mt-6">

              <div className="w-4 h-4 rounded-full bg-white"></div>

              <p className="font-semibold">
                Online Now
              </p>
            </div>
          </div>
        </div>
      </div>

    </PegawaiLayout>
  );
}