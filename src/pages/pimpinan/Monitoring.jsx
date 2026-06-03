import PimpinanLayout from "../../layouts/PimpinanLayout";
import {
  Activity,
  Users,
  Clock3,
  TrendingUp,
  Bell,
} from "lucide-react";

export default function Monitoring() {
  return (
    <PimpinanLayout>

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 to-[#09152f] rounded-[40px] p-10 text-white shadow-2xl">

        <p className="uppercase tracking-[8px] text-blue-200 text-sm mb-4">
          Live Monitoring
        </p>

        <h1 className="text-6xl font-black leading-tight">
          Monitoring <br />
          Aktivitas Pegawai
        </h1>

        <p className="text-blue-100 mt-6 text-xl max-w-3xl">
          Pantau seluruh aktivitas realtime pegawai,
          kehadiran, performa kerja, dan sistem perusahaan.
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        <div className="bg-[#09152f] rounded-3xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Pegawai Online</p>
              <h1 className="text-5xl font-black mt-4">89</h1>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <Users size={30} className="text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#09152f] rounded-3xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Aktivitas Hari Ini</p>
              <h1 className="text-5xl font-black mt-4">240</h1>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Activity size={30} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#09152f] rounded-3xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Kehadiran</p>
              <h1 className="text-5xl font-black mt-4">98%</h1>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Clock3 size={30} className="text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#09152f] rounded-3xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Produktivitas</p>
              <h1 className="text-5xl font-black mt-4">91%</h1>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <TrendingUp size={30} className="text-purple-400" />
            </div>
          </div>
        </div>

      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

        {/* LIVE ACTIVITY */}
        <div className="lg:col-span-2 bg-[#09152f] rounded-3xl p-8 text-white">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Activity size={30} />
            </div>

            <div>
              <p className="tracking-[6px] text-gray-400 text-sm uppercase">
                Realtime
              </p>

              <h1 className="text-5xl font-black">
                Aktivitas Live
              </h1>
            </div>
          </div>

          <div className="space-y-5">

            {[
              "Pegawai melakukan absensi masuk",
              "Divisi HR memperbarui data pegawai",
              "Laporan bulanan berhasil dibuat",
              "Monitoring realtime aktif",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>

                  <div>
                    <h1 className="font-bold text-lg">
                      {item}
                    </h1>

                    <p className="text-gray-400 text-sm">
                      Baru saja diperbarui
                    </p>
                  </div>
                </div>

                <button className="bg-blue-600 px-5 py-2 rounded-xl">
                  Live
                </button>
              </div>
            ))}

          </div>

        </div>

        {/* NOTIF */}
        <div className="bg-black rounded-3xl p-8 text-white">

          <div className="flex items-center gap-4 mb-8">

            <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-black">
              <Bell size={30} />
            </div>

            <div>
              <p className="tracking-[6px] text-gray-400 text-sm uppercase">
                Notification
              </p>

              <h1 className="text-5xl font-black">
                Alert
              </h1>
            </div>

          </div>

          <div className="space-y-5">

            {[
              "Pegawai terlambat hadir",
              "Server perusahaan aktif",
              "Laporan berhasil dikirim",
              "Produktivitas meningkat",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-2xl p-5 border border-white/10"
              >
                <h1 className="font-bold text-lg">
                  {item}
                </h1>

                <p className="text-gray-400 mt-2">
                  Realtime system notification
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>

    </PimpinanLayout>
  );
}