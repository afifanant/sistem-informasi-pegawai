import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function Laporan() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white shadow-xl mb-8">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Executive Report
        </p>

        <h1 className="text-5xl font-black mt-3">
          Laporan Perusahaan
        </h1>

        <p className="mt-4 text-blue-100 max-w-3xl">
          Monitoring dan download laporan perusahaan realtime.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {[
          "Laporan Kehadiran Pegawai",
          "Laporan Produktivitas",
          "Laporan Divisi",
          "Laporan Monitoring Sistem",
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-[35px] p-8 shadow-sm"
          >

            <div className="flex justify-between items-start">

              <div>

                <div className="bg-blue-100 text-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={30} />
                </div>

                <h2 className="text-3xl font-black text-slate-800">
                  {item}
                </h2>

                <div className="flex items-center gap-2 mt-4 text-gray-500">
                  <Calendar size={18} />
                  Update hari ini
                </div>

                <div className="flex items-center gap-2 mt-2 text-green-600 font-semibold">
                  <CheckCircle2 size={18} />
                  Laporan tersedia
                </div>
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 transition">

                <Download size={18} />

                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}