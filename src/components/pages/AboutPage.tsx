import {
  User,
  Mail,
  Globe,
  Cpu,
  ShieldCheck,
  Copy,
  CheckCircle2,
  Crown,
  Star,
  Zap,
  Clock,
  Loader2,
  ExternalLink,
  Smartphone,
  History,
  RefreshCw, // Thêm icon này
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import changelogData from "../../resources/changelog.json";

interface LicenseInfo {
  status: boolean;
  deviceId: string;
  maxDevices: string;
  plan: "Basic" | "Pro" | "Ultra" | "Member";
  expiredAt: string;
  permissions: string[];
  message: string;
}

export const AboutPage = () => {
  const [deviceId, setDeviceId] = useState("Chưa kết nối Backend...");
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isElectronReady, setIsElectronReady] = useState(false); // Flag kiểm tra kết nối

  const loadSystemInfo = useCallback(async () => {
    // @ts-ignore
    if (!window.electronAPI) {
      console.warn("⚠️ Electron API chưa sẵn sàng...");
      setDeviceId("Lỗi: Không tìm thấy kết nối Backend");
      setIsElectronReady(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setIsElectronReady(true);

      // 1. Lấy HWID an toàn
      // @ts-ignore
      const id = await window.electronAPI?.getDeviceId();
      setDeviceId(id || "N/A");

      // 2. Check License
      // @ts-ignore
      const info = await window.electronAPI?.getLicenseInfo();
      setLicense(info);
    } catch (error) {
      console.error("Lỗi khi tải thông tin bản quyền:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Thêm một chút delay 500ms để đợi preload script nạp hẳn nếu là môi trường dev
    const timer = setTimeout(() => {
      loadSystemInfo();
    }, 500);
    return () => clearTimeout(timer);
  }, [loadSystemInfo]);

  const handleCopy = () => {
    if (!isElectronReady) return;
    navigator.clipboard.writeText(deviceId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getPlanConfig = () => {
    if (loading)
      return {
        label: "Đang kiểm tra...",
        color: "text-slate-400",
        bg: "bg-slate-50",
        border: "border-slate-200",
        icon: <Loader2 className="animate-spin" size={20} />,
      };

    if (!isElectronReady)
      return {
        label: "LỖI KẾT NỐI BE",
        color: "text-amber-500",
        bg: "bg-amber-50",
        border: "border-amber-200",
        icon: <RefreshCw size={24} />,
      };

    if (!license || !license.status)
      return {
        label: "CHƯA KÍCH HOẠT",
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-100",
        icon: <Clock size={24} />,
      };

    switch (license.plan) {
      case "Ultra": return { label: "ULTRA - VÔ HẠN", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", icon: <Crown size={24} /> };
      case "Pro": return { label: "PROFESSIONAL", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: <Zap size={24} /> };
      case "Member": return { label: "TRI ÂN MEMBER", color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200", icon: <Star size={24} /> };
      default: return { label: "BASIC EDITION", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: <CheckCircle2 size={24} /> };
    }
  };

  const plan = getPlanConfig();

  return (
    <div className="p-8 w-full max-w-5xl mx-auto space-y-6 select-none overflow-y-auto h-screen pb-24 scrollbar-hide animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-200 ring-4 ring-white">
            M
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">
              MinMinFarmer
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-[10px] font-bold flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />{" "}
                {isElectronReady ? "HỆ THỐNG ONLINE" : "ĐANG ĐỢI BACKEND..."}
              </span>
            </div>
          </div>
        </div>
        
        {/* Nút Refresh chỉ hiện khi BE lỗi hoặc để check lại License nhanh */}
        <button 
          onClick={loadSystemInfo}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:rotate-180"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          LÀM MỚI KẾT NỐI
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Team Info (Giữ nguyên) */}
        <div className="bg-white p-7 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <User size={14} className="text-blue-500" /> Dev Team Info
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">MM</div>
              <div>
                <div className="text-slate-800 font-black text-lg leading-none">MinMin</div>
                <div className="text-slate-400 text-xs font-medium">Lead Developer</div>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 text-slate-500 text-sm hover:text-blue-600 cursor-pointer transition-colors">
                <Mail size={14} /> crasmaverkgkg@gmail.com
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-sm hover:text-blue-600 cursor-pointer transition-colors">
                <Globe size={14} /> auto.minmintool.site
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group">
            HỖ TRỢ TELEGRAM <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Card 2: License Status */}
        <div className={`${plan.bg} p-7 rounded-[2.5rem] border-2 ${plan.border} relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-slate-200/50 group transition-all duration-500 hover:scale-[1.02]`}>
          <div className={`absolute -right-10 -top-10 w-40 h-40 ${plan.color} opacity-[0.03] rounded-full blur-3xl`} />
          <ShieldCheck className={`absolute -right-4 -bottom-4 ${plan.color} opacity-[0.08] w-48 h-48 rotate-12 transition-transform duration-700 group-hover:rotate-0`} />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <h2 className={`text-[10px] font-black ${plan.color} opacity-60 uppercase tracking-[0.25em] flex items-center gap-2`}>
                <ShieldCheck size={14} strokeWidth={3} /> License Status
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${plan.color} bg-white/50 backdrop-blur-sm border ${plan.border}`}>
                {isElectronReady ? "CONNECTED" : "DISCONNECTED"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className={`flex items-center gap-3 ${plan.color} font-black text-3xl tracking-tight`}>
                {plan.icon} {plan.label}
              </div>
              {!isElectronReady && (
                <button onClick={loadSystemInfo} className="mt-2 text-[10px] font-black underline cursor-pointer hover:opacity-80">
                  CLICK ĐỂ THỬ KẾT NỐI LẠI
                </button>
              )}
            </div>
          </div>

          <div className="mt-10 space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-2xl bg-white/40 backdrop-blur-md border ${plan.border} shadow-sm`}>
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone size={12} className={plan.color} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Capacity</span>
                </div>
                <div className={`text-xs font-black ${plan.color}`}>
                  {license?.plan === "Ultra" ? "UNLIMITED" : `${license?.maxDevices || 0} DEVICES`}
                </div>
              </div>

              <div className={`p-3 rounded-2xl bg-white/40 backdrop-blur-md border ${plan.border} shadow-sm`}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={12} className={plan.color} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Expiry</span>
                </div>
                <div className={`text-xs font-black ${plan.color}`}>
                  {license?.expiredAt?.split(" ")[0] || "LIFETIME"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HWID Section */}
      <div className="bg-white p-7 rounded-4xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Cpu size={14} /> Machine Hardware ID
            </h2>
          </div>
          <button
            onClick={handleCopy}
            disabled={!isElectronReady}
            className={`flex items-center gap-2 text-xs font-black border px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm ${
              isElectronReady 
              ? "bg-slate-50 border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600" 
              : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isCopied ? <><CheckCircle2 size={14} /> ĐÃ SAO CHÉP</> : <><Copy size={14} /> COPY HWID</>}
          </button>
        </div>

        <div className="relative group">
          <div className={`bg-slate-50 p-5 rounded-2xl font-mono text-xs break-all border shadow-inner transition-colors leading-relaxed ${!isElectronReady ? "text-red-400 border-red-100" : "text-slate-500 border-slate-100 group-hover:border-blue-200"}`}>
            {deviceId}
          </div>
        </div>
      </div>

      {/* Changelog Section - Thêm vào trên phần Footer Disclaimer */}
      <div className="bg-white p-7 rounded-4xl border border-slate-100 shadow-sm space-y-8">
        <div className="space-y-1">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            {/* Bọc icon vào span để tránh lỗi thuộc tính của thư viện icon */}
            <span className="text-blue-500">
              <History />
            </span>
            System Changelog
          </h2>
          <p className="text-[11px] text-slate-400 font-medium italic">
            Lịch sử cập nhật và nâng cấp tính năng hệ thống
          </p>
        </div>

        <div className="relative pl-8 space-y-10 before:content-[''] before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {changelogData.map((item, index) => (
            <div key={item.version} className="relative group">
              {/* Dot trên Timeline */}
              <div className="absolute -left-6.25 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-slate-200 group-hover:border-blue-500 transition-colors z-10" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-800 tracking-tight">
                    Version {item.version}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-md uppercase">
                    {item.date}
                  </span>
                  {index === 0 && (
                    <span className="px-2 py-0.5 bg-green-500 text-white text-[8px] font-black rounded-md animate-pulse">
                      LATEST
                    </span>
                  )}
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {item.content.map((log, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-slate-500 text-[11px] font-medium leading-relaxed"
                    >
                      <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                      {log}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer Disclaimer */}
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="h-px w-20 bg-slate-200" />
        <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
          © 2024-2026 MINMIN FARMER PRO • SECURITY VERIFIED
        </p>
      </div>

    </div>
  );
};