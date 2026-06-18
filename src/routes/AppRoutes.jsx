import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. IMPORT KOMPONEN AUTH & UTAMA
import Login from "../pages/auth/Login";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardPimpinan from "../pages/pimpinan/DashboardPimpinan";

// IMPORT HALAMAN UTAMA ADMIN (Disinkronkan dengan SidebarAdmin)
import PegawaiAdmin from "../pages/admin/Pegawai"; // Path sesuaikan dengan file lu (misal: DataPegawai.jsx / Pegawai.jsx)
import AbsensiAdmin from "../pages/admin/Absensi"; // Path halaman monitoring absensi admin
import DivisiAdmin from "../pages/admin/Divisi";   // Halaman kelola divisi yang baru kita perbaiki

// PERBAIKAN MUTLAK: Import komponen halaman manajemen proyek untuk Admin
import ProyekAdmin from "../pages/admin/Proyek"; 

// IMPORT HALAMAN PEGAWAI
import DashboardPegawai from "../pages/pegawai/DashboardPegawai"; 
import AbsensiPegawai from "../pages/pegawai/AbsensiPegawai"; // Kolom Absen + Hitung Radius & OpenStreetMap
import ProjekPegawai from "../pages/pegawai/ProjekPegawai";   // Daftar Projek + Tanggal & Tempat dari Supabase

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* HALAMAN UTAMA / LOGIN */}
        <Route path="/" element={<Login />} />

        {/* GROUP ROUTE ADMIN */}
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/pegawai" element={<PegawaiAdmin />} />
        <Route path="/admin/absensi" element={<AbsensiAdmin />} />
        <Route path="/admin/divisi" element={<DivisiAdmin />} />
        {/* Rute baru untuk menu Proyek di SidebarAdmin */}
        <Route path="/admin/proyek" element={<ProyekAdmin />} />

        {/* DASHBOARD PEGAWAI */}
        <Route path="/pegawai" element={<DashboardPegawai />} />
        <Route path="/pegawai/absensi" element={<AbsensiPegawai />} />
        <Route path="/pegawai/projek" element={<ProjekPegawai />} />
        
        {/* FIX CADANGAN: Mempertahankan path ini jika file Login.jsx lu masih mengarah ke /dashboard-pegawai */}
        <Route path="/dashboard-pegawai" element={<DashboardPegawai />} />

        {/* DASHBOARD PIMPINAN */}
        <Route path="/pimpinan" element={<DashboardPimpinan />} />

      </Routes>
    </BrowserRouter>
  );
}