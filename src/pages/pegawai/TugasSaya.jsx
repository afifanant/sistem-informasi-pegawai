import DashboardLayout from "../../layouts/PegawaiLayout";

import {
  Briefcase,
  Clock3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function TugasSaya() {

  const tugas = [
    {
      title: "Membuat UI Dashboard",
      deadline: "Hari Ini",
      status: "Progress",
    },
    {
      title: "Meeting Project",
      deadline: "13:00",
      status: "Pending",
    },
    {
      title: "Upload Laporan",
      deadline: "Kemarin",
      status: "Selesai",
    },
  ];

  return (
    <DashboardLayout>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Employee Task
        </p>

        <h1 className="text-5xl font-black mt-4">
          Tugas Saya
        </h1>

        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Pantau dan kelola seluruh pekerjaan Anda secara modern.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-[#111827] rounded-[35px] p-8 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Total Tugas
              </p>

              <h2 className="text-5xl font-black mt-4">
                12
              </h2>
            </div>

            <div className="bg-blue-500 p-4 rounded-2xl">

              <Briefcase size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[35px] p-8 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Selesai
              </p>

              <h2 className="text-5xl font-black mt-4">
                9
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
                Progress
              </p>

              <h2 className="text-5xl font-black mt-4">
                91%
              </h2>
            </div>

            <div className="bg-purple-500 p-4 rounded-2xl">

              <TrendingUp size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* TASK */}
      <div className="space-y-6 mt-8">

        {tugas.map((item, index) => (

          <div
            key={index}
            className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800"
          >

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              <div>

                <h2 className="text-3xl font-black">
                  {item.title}
                </h2>

                <div className="flex items-center gap-3 mt-4 text-gray-400">

                  <Clock3 size={18} />

                  Deadline:
                  {" "}
                  {item.deadline}
                </div>
              </div>

              <div className="flex items-center gap-4">

                <span
                  className={`px-5 py-3 rounded-full font-bold ${
                    item.status === "Selesai"
                      ? "bg-green-500/20 text-green-400"
                      : item.status === "Progress"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {item.status}
                </span>

                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-bold transition">
                  Detail
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* ALERT */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-[35px] p-8 mt-8 text-white">

        <div className="flex items-center gap-5">

          <div className="bg-white/20 p-5 rounded-2xl">

            <AlertCircle size={40} />
          </div>

          <div>

            <h2 className="text-3xl font-black">
              Deadline Mendekat
            </h2>

            <p className="mt-3 text-yellow-100">
              Anda memiliki beberapa tugas yang harus segera diselesaikan.
            </p>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}