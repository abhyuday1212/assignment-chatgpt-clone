"use client";
export default function Loading() {
  return (
    <div className="fixed inset-0 flex bg-[#212121] animate-fadeIn">
      <div className="flex-1 flex items-center justify-center animate-pulse"></div>
    </div>
  );
}
