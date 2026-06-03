import DashboardLayout from "../../layouts/AdminLayout";

import {
  FileText,
  Download,
  TrendingUp,
  Users,
  CalendarCheck,
  Briefcase,
} from "lucide-react";

export default function Laporan() {

  const laporan = [
    {
      title: "Laporan Pegawai",
      desc: "Data seluruh pegawai perusahaan",
      icon: <Users size={28} />,
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Laporan Absensi",
      desc: "Monitoring kehadiran pegawai",
      icon: <CalendarCheck size={28} />,
      color: "from-green-500 to-emerald-400",
    },
    {
      title: "Laporan Divisi",
      desc: "Kinerja seluruh divisi perusahaan",
      icon: <Briefcase size={28} />,
      color: "from-purple-500 to-pink-400",
    },
  ];

  return (
    <DashboardLayout>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Company Report
        </p>

        <h1 className="text-5xl font-black mt-4">
          Laporan Perusahaan
        </h1>

        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Kelola dan export laporan perusahaan secara realtime.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-[#111827] rounded-[30px] p-7 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Total Laporan</p>
              <h2 className="text-5xl font-black mt-3">24</h2>
            </div>

            <div className="bg-blue-500 p-4 rounded-2xl">
              <FileText size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[30px] p-7 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Download</p>
              <h2 className="text-5xl font-black mt-3">120</h2>
            </div>

            <div className="bg-green-500 p-4 rounded-2xl">
              <Download size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[30px] p-7 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Produktivitas</p>
              <h2 className="text-5xl font-black mt-3">94%</h2>
            </div>

            <div className="bg-purple-500 p-4 rounded-2xl">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* REPORT CARD */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {laporan.map((item, index) => (

          <div
            key={index}
            className="bg-[#111827] rounded-[35px] p-8 text-white border border-gray-800 hover:border-blue-500 transition-all"
          >

            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>

              {item.icon}
            </div>

            <h2 className="text-3xl font-black mt-6">
              {item.title}
            </h2>

            <p className="text-gray-400 mt-4 leading-relaxed">
              {item.desc}
            </p>

            <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition">

              <Download size={22} />

              Download PDF
            </button>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}