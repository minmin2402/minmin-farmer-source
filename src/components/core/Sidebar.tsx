import {
  PlayCircle,
  ShoppingBag,
  Smartphone,
  Languages,
  Copy,
  ShieldCheck,
  Camera,
  Podcast,
  Sparkles,
  Rocket,
  Settings,
  Store,
  Image,
  LucideFileVideo2,
  Bot,
  Fingerprint,
  UserCheck,
  UserCog
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ currentTab, onTabChange }: SidebarProps) => {
  const [appInfo, setAppInfo] = useState({
    version: "0.0.0",
    hwid: "ĐANG KẾT NỐI...",
  });

  useEffect(() => {
    const fetchInfo = async () => {
      // 🛡️ CHẶN LỖI DEV: Check API đã nạp chưa trước khi gọi
      // @ts-ignore
      if (!window.electronAPI) {
        console.warn("⚠️ [Sidebar] Electron API chưa sẵn sàng...");
        return;
      }

      try {
        // @ts-ignore
        const hwid = await window.electronAPI.getDeviceId();
        // @ts-ignore
        const versionapp = await window.electronAPI.getVersionApp();

        setAppInfo({
          hwid: hwid || "LỖI LẤY ID",
          version: versionapp?.version ?? "1.0.0",
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin App:", error);
        setAppInfo((prev) => ({ ...prev, hwid: "ERROR" }));
      }
    };

    // Đợi 500ms cho an toàn lúc hot-reload
    const timer = setTimeout(() => fetchInfo(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen select-none">
      {/* 1. LOGO HEADER */}
      <div className="flex items-center gap-2 p-6 mb-2">
        <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
          M
        </div>
        <span className="font-black text-slate-800 tracking-tight text-lg italic">
          MinMinFarmer
        </span>
      </div>

      {/* 2. MENU NAVIGATION (Cuộn được nếu quá dài) */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide custom-scrollbar">
        
        {/* GROUP 1: CHỨC NĂNG AI */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Sparkles size={12} className="text-purple-500" /> Chức năng AI
          </div>
          <NavItem
            icon={<Camera size={18} />}
            label="Video Marketing AI"
            active={currentTab === "video_marketing"}
            onClick={() => onTabChange("video_marketing")}
          />
          <NavItem
            icon={<Store size={18} />}
            label="Kho Lưu Trữ Video"
            active={currentTab === "storage_video"}
            onClick={() => onTabChange("storage_video")}
          />
          <NavItem
            icon={<UserCog size={18} />}
            label="Tạo Nhân Vật"
            active={currentTab === "characters"}
            onClick={() => onTabChange("characters")}
          />
          <NavItem
            icon={<LucideFileVideo2 size={18} />}
            label="Tự Dựng Video AI"
            active={currentTab === "video_ai"}
            onClick={() => onTabChange("video_ai")}
          />
          <NavItem
            icon={<Image size={18} />}
            label="Tạo Ảnh AI"
            active={currentTab === "imagen"}
            onClick={() => onTabChange("imagen")}
          />
        </div>

        {/* GROUP 2: TỰ ĐỘNG ĐĂNG */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Rocket size={12} className="text-orange-500" /> AUTO POST
          </div>
          <NavItem
            icon={<Podcast size={18} />}
            label="Reels Facebook"
            active={currentTab === "reels_facebook"}
            onClick={() => onTabChange("reels_facebook")}
          />

          <NavItem
            icon={<ShoppingBag size={18} />}
            label="Shopee Video"
            active={currentTab === "auto_shopee"}
            onClick={() => onTabChange("auto_shopee")}
          />
         
        </div>

        {/* GROUP 3: AUTO LOGIN */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <UserCheck size={12} className="text-green-500" /> AUTO PROFILE
          </div>
          
          <NavItem
            icon={<Fingerprint size={18} />} 
            label="Auto Login FB"
            active={currentTab === "auto_login_fb"}
            onClick={() => onTabChange("auto_login_fb")}
          />
          <NavItem
            icon={<Bot size={18} />} 
            label="Auto Login Grok"
            active={currentTab === "auto_login_grok"} // 👈 Đã fix lỗi copy-paste
            onClick={() => onTabChange("auto_login_grok")} // 👈 Đã fix lỗi copy-paste
          />
          
          
        </div>
        {/* GROUP 3: KHÁC (HỆ THỐNG) */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Settings size={12} className="text-red-500" /> Khác
          </div>
          
          <NavItem
            icon={<Smartphone size={18} />}
            label="Thiết bị"
            active={currentTab === "devices"}
            onClick={() => onTabChange("devices")}
          />
          
          <NavItem
            icon={<Settings size={18} />}
            label="Settings"
            active={currentTab === "settings"}
            onClick={() => onTabChange("settings")}
          />
          <NavItem
            icon={<PlayCircle size={18} />}
            label="Quy trình"
            active={currentTab === "workflow"}
            onClick={() => onTabChange("workflow")}
          />
          <NavItem
            icon={<ShieldCheck size={18} />}
            label="Bản quyền & Tác giả"
            active={currentTab === "about"}
            onClick={() => onTabChange("about")}
          />
        </div>

      </nav>

      {/* 3. FOOTER: SYSTEM INFO */}
      <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Version
            </span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              v{appInfo.version}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Hardware ID
            </span>
            <div className="flex items-center justify-between gap-2 group/hwid">
              <code className="text-[11px] font-mono font-bold text-slate-600 truncate">
                {appInfo.hwid}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(appInfo.hwid)}
                className="p-1.5 hover:bg-slate-100 rounded-md opacity-0 group-hover/hwid:opacity-100 transition-all"
                title="Copy HWID"
              >
                <Copy size={12} className="text-slate-400 hover:text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-blue-500" /> Tiếng Việt
          </div>
          <span className="text-[10px] text-slate-400">▼</span>
        </button>
      </div>
    </aside>
  );
};

// Component NavItem giữ nguyên độ mượt
const NavItem = ({ icon, label, active, onClick }: any) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all font-bold text-sm ${
      active
        ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50 border border-blue-100/50"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
    }`}
  >
    {icon} <span>{label}</span>
  </div>
);