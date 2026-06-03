import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
} from "lucide-react";

export default function Statistik() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl mb-8">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Executive Statistics
        </p>

        <h1 className="text-5xl font-black mt-3">
          Statistik Perusahaan
        </h1>

        <p className="mt-4 text-blue-100 max-w-3xl">
          Analisis data perusahaan, performa pegawai,
          dan pertumbuhan produktivitas.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {[
          {
            title: "Total Pegawai",
            value: "120",
            icon: <Users />,
            color: "bg-blue-500",
          },
          {
            title: "Total Divisi",
            value: "8",
            icon: <Briefcase />,
            color: "bg-purple-500",
          },
          {
            title: "Produktivitas",
            value: "91%",
            icon: <TrendingUp />,
            color: "bg-green-500",
          },
          {
            title: "Kinerja",
            value: "95%",
            icon: <BarChart3 />,
            color: "bg-orange-500",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-[30px] p-7 shadow-sm"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500">
                  {item.title}
                </p>

                <h2 className="text-5xl font-black mt-4 text-slate-800">
                  {item.value}
                </h2>
              </div>

              <div className={`${item.color} text-white p-4 rounded-2xl`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white rounded-[35px] p-8 shadow-sm">

        <div className="flex items-center gap-4 mb-10">

          <div className="bg-blue-600 text-white p-4 rounded-2xl">
            <BarChart3 />
          </div>

          <div>

            <p className="uppercase tracking-[4px] text-gray-400 text-sm">
              Analytics
            </p>

            <h2 className="text-4xl font-black text-slate-800">
              Grafik Produktivitas
            </h2>
          </div>
        </div>

        <div className="flex items-end gap-6 h-[350px]">

          {[
            { bulan: "Jan", tinggi: "60%" },
            { bulan: "Feb", tinggi: "75%" },
            { bulan: "Mar", tinggi: "80%" },
            { bulan: "Apr", tinggi: "95%" },
            { bulan: "Mei", tinggi: "85%" },
            { bulan: "Jun", tinggi: "100%" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center"
            >

              <div
                className="w-full rounded-t-3xl bg-gradient-to-t from-blue-700 to-cyan-400"
                style={{ height: item.tinggi }}
              ></div>

              <p className="mt-4 font-bold text-slate-700">
                {item.bulan}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}