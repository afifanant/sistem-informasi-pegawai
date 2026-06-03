export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-[400px]">
        
        <h1 className="text-3xl font-black mb-2">
          SIMPEG
        </h1>

        <p className="text-gray-500 mb-8">
          Sistem Informasi Manajemen Pegawai
        </p>

        <input
          type="email"
          placeholder="Masukkan Email"
          className="w-full border p-4 rounded-2xl mb-4 outline-none"
        />

        <input
          type="password"
          placeholder="Masukkan Password"
          className="w-full border p-4 rounded-2xl mb-6 outline-none"
        />

        <button className="w-full bg-black text-white py-4 rounded-2xl font-bold">
          Login
        </button>
      </div>
    </div>
  );
}