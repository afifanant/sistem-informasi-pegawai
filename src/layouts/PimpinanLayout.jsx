import SidebarPimpinan from "../components/sidebar/SidebarPimpinan";
import TopbarPimpinan from "../components/topbar/TopbarPimpinan";

export default function PimpinanLayout({ children }) {

  return (
    <div className="flex bg-[#f1f5f9] min-h-screen">

      <SidebarPimpinan />

      <div className="flex-1 p-8">

        <TopbarPimpinan />

        {children}
      </div>
    </div>
  );
}