import Sidebar from "@/components/Sidebar";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex bg-[#212121] animate-fadeIn">
      <Sidebar />

      <div className="flex-1 flex items-center justify-center animate-pulse">
        <div className="text-gray-400">Loading...</div>
      </div>
    </div>
  );
}
