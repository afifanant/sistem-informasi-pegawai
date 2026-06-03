import { useState } from "react";

import DashboardLayout from "../../layouts/AdminLayout";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  Briefcase,
} from "lucide-react";

export default function DataPegawai() {

  const [search, setSearch] = useState("");

  const [pegawai, setPegawai] = useState([
    {
      id: 1,
      nama: "Budi Santoso",
      email: "budi@company.com",
      divisi: "IT Development",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Siti Rahma",
      email: "siti@company.com",
      divisi: "Human Resource",
      status: "Cuti",
    },
    {
      id: 3,
      nama: "Andi Saputra",
      email: "andi@company.com",
      divisi: "Finance",
      status: "Aktif",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    divisi: "",
    status: "Aktif",
  });

  // TAMBAH PEGAWAI
  const handleTambah = () => {

    if (!form.nama || !form.email || !form.divisi) {
      alert("Lengkapi data!");
      return;
    }

    const dataBaru = {
      id: Date.now(),
      ...form,
    };

    setPegawai([...pegawai, dataBaru]);

    setForm({
      nama: "",
      email: "",
      divisi: "",
      status: "Aktif",
    });

    setShowModal(false);
  };

  // HAPUS
  const handleHapus = (id) => {

    const confirmDelete = confirm("Hapus pegawai ini?");

    if (confirmDelete) {
      setPegawai(pegawai.filter((item) => item.id !== id));
    }
  };

  // FILTER SEARCH
  const filteredPegawai = pegawai.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-[35px] p-10 text-white">

        <p className="uppercase tracking-[5px] text-blue-200 text-sm">
          Human Resource
        </p>

        <h1 className="text-5xl font-black mt-4">
          Data Pegawai
        </h1>

        <p className="text-blue-100 mt-5 max-w-2xl leading-relaxed">
          Kelola data pegawai perusahaan secara realtime dengan sistem modern.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Total Pegawai
              </p>

              <h2 className="text-5xl font-black mt-3">
                {pegawai.length}
              </h2>
            </div>

            <div className="bg-blue-500 p-4 rounded-2xl">
              <Users size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Pegawai Aktif
              </p>

              <h2 className="text-5xl font-black mt-3">
                {
                  pegawai.filter((item) => item.status === "Aktif").length
                }
              </h2>
            </div>

            <div className="bg-green-500 p-4 rounded-2xl">
              <UserCheck size={28} />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[30px] p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400">
                Total Divisi
              </p>

              <h2 className="text-5xl font-black mt-3">
                8
              </h2>
            </div>

            <div className="bg-purple-500 p-4 rounded-2xl">
              <Briefcase size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#111827] rounded-[35px] p-8 mt-8 text-white">

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          {/* SEARCH */}
          <div className="bg-[#1f2937] px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[400px]">

            <Search className="text-gray-400" size={22} />

            <input
              type="text"
              placeholder="Cari pegawai..."
              className="bg-transparent outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-[1.02]"
          >

            <Plus size={22} />

            Tambah Pegawai
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="text-left text-gray-400 border-b border-gray-700">

                <th className="pb-5">Nama</th>
                <th className="pb-5">Email</th>
                <th className="pb-5">Divisi</th>
                <th className="pb-5">Status</th>
                <th className="pb-5 text-center">Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredPegawai.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-gray-800 hover:bg-[#1f2937] transition"
                >

                  <td className="py-5 font-semibold">
                    {item.nama}
                  </td>

                  <td className="py-5 text-gray-300">
                    {item.email}
                  </td>

                  <td className="py-5">
                    {item.divisi}
                  </td>

                  <td className="py-5">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        item.status === "Aktif"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-5">

                    <div className="flex justify-center gap-3">

                      <button
                        className="bg-blue-500 hover:bg-blue-600 p-3 rounded-xl transition"
                      >

                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleHapus(item.id)}
                        className="bg-red-500 hover:bg-red-600 p-3 rounded-xl transition"
                      >

                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">

          <div className="bg-[#111827] w-full max-w-xl rounded-[35px] p-8 text-white">

            <h2 className="text-4xl font-black mb-8">
              Tambah Pegawai
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Nama Pegawai"
                className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none"
                value={form.nama}
                onChange={(e) =>
                  setForm({ ...form, nama: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email Pegawai"
                className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Divisi"
                className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none"
                value={form.divisi}
                onChange={(e) =>
                  setForm({ ...form, divisi: e.target.value })
                }
              />

              <select
                className="w-full bg-[#1f2937] px-5 py-4 rounded-2xl outline-none"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >

                <option>Aktif</option>
                <option>Cuti</option>
              </select>
            </div>

            {/* BUTTON */}
            <div className="flex gap-4 mt-10">

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-4 rounded-2xl font-bold transition"
              >
                Batal
              </button>

              <button
                onClick={handleTambah}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-bold transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}