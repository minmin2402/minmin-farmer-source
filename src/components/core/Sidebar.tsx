import {
  PlayCircle,
  ShoppingBag,
  Smartphone,
  Languages,
  Copy,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ currentTab, onTabChange }: SidebarProps) => {
  const [appInfo, setAppInfo] = useState({ version: "0.0.0", hwid: "LOADING..." });

  useEffect(() => {
    // 1. Tạo một hàm async bên trong useEffect
    const fetchInfo = async () => {
      try {
        // @ts-ignore
        const hwid = await window.electronAPI.getDeviceId();
        // Cập nhật State một cách an toàn
        setAppInfo(prev => ({ ...prev, hwid: hwid }));
      } catch (error) {
        console.error("Lỗi lấy HWID:", error);
        setAppInfo(prev => ({ ...prev, hwid: "ERROR" }));
      }
    };

    fetchInfo();
  }, []); // 2. ĐỂ MẢNG RỖNG [] để nó chỉ chạy DUY NHẤT 1 LẦN khi mở app
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen p-4 select-none">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          M
        </div>
        <span className="font-bold text-slate-800 tracking-tight">
          MinMinFarmer
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        <NavItem
          icon={<PlayCircle size={18} />}
          label="Quy trình"
          active={currentTab === "workflow"}
          onClick={() => onTabChange("workflow")}
        />
        <NavItem
          icon={<ShoppingBag size={18} />}
          label="Auto Shopee"
          active={currentTab === "auto_shopee"}
          onClick={() => onTabChange("auto_shopee")}
        />
        <NavItem
          icon={<Smartphone size={18} />}
          label="Thiết bị"
          active={currentTab === "devices"}
          onClick={() => onTabChange("devices")}
        />
        <NavItem
          icon={<Camera size={18} />}
          label="Video Marketing"
          active={currentTab === "video_marketing"}
          onClick={() => onTabChange("video_marketing")}
        />
        {/* <NavItem
          icon={<Clapperboard size={18} />}
          label="Tạo Video AI (Grok)"
          active={currentTab === "video_ai_grok"}
          onClick={() => onTabChange("video_ai_grok")}
        /> */}
        <NavItem
          icon={<ShieldCheck size={18} />}
          label="Bản quyền & Tác giả"
          active={currentTab === "about"}
          onClick={() => onTabChange("about")}
        />
      </nav>
            {/* PHẦN MỚI THÊM: THÔNG TIN PHẦN MỀM & HWID 🛠️ */}
      <div className="mb-4 px-2 space-y-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Version</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              v{appInfo.version}
            </span>
          </div>
          
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware ID</span>
            <div className="flex items-center justify-between gap-2 group/hwid">
              <code className="text-[11px] font-mono font-bold text-slate-600 truncate">
                {appInfo.hwid}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(appInfo.hwid)}
                className="p-1 hover:bg-white rounded shadow-sm opacity-0 group-hover/hwid:opacity-100 transition-all"
                title="Copy HWID"
              >
                <Copy size={10} className="text-slate-400 hover:text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-gray-100">
        <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 border border-gray-200 rounded-lg hover:bg-slate-50 transition-all">
          <div className="flex items-center gap-2">
            <Languages size={16} /> Tiếng Việt
          </div>
          <span className="text-[10px]">▼</span>
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium text-sm ${
      active
        ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50"
        : "text-slate-500 hover:bg-slate-50"
    }`}
  >
    {icon} <span>{label}</span>
  </div>
);
