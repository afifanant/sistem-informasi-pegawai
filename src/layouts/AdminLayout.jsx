import SidebarAdmin from "../components/sidebar/SidebarAdmin";
import TopbarAdmin from "../components/topbar/TopbarAdmin";

export default function AdminLayout({ children }) {

  return (
    <div className="flex bg-[#f1f5f9] min-h-screen">

      {/* SIDEBAR */}
      <SidebarAdmin />

      {/* CONTENT */}
      <div className="flex-1 p-8">

        <TopbarAdmin />

        {children}
      </div>
    </div>
  );
}