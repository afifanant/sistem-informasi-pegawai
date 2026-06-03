import SidebarPegawai from "../components/sidebar/SidebarPegawai";
import TopbarPegawai from "../components/topbar/TopbarPegawai";

export default function PegawaiLayout({ children }) {

  return (
    <div className="flex bg-[#f1f5f9] min-h-screen">

      <SidebarPegawai />

      <div className="flex-1 p-8">

        <TopbarPegawai />

        {children}
      </div>
    </div>
  );
}