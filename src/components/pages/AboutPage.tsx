import { User, Mail, Globe, Cpu, ShieldCheck, Copy, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export const AboutPage = () => {
  const [deviceId, setDeviceId] = useState("Đang lấy ID...");
  const [isCopied, setIsCopied] = useState(false);

  // Giả lập lấy Hardware ID từ Electron sau này
  useEffect(() => {
    // @ts-ignore
    window.electronAPI?.getDeviceId?.().then(id => setDeviceId(id || "MINMIN-PC-8888"));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(deviceId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto space-y-6 select-none overflow-y-auto h-screen pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200">
          M
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">MinMinFarmer</h1>
          <p className="text-slate-500 font-medium">Phiên bản 1.0.0 (Beta Edition)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Tác Giả */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <User size={16} /> Thông tin tác giả
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-700 font-bold text-lg">
              MinMin
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <Mail size={14} /> crasmaverkgkg@gmail.com
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-sm">
              <Globe size={14} /> minmintool.site
            </div>
          </div>
          <div className="pt-4 flex gap-2">
             <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all">
                Liên hệ Telegram @minmin24203
             </button>
          </div>
        </div>

        {/* Card Bản Quyền */}
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4 relative overflow-hidden">
          <ShieldCheck className="absolute -right-4 -bottom-4 text-blue-100 w-32 h-32" />
          <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={16} /> Trạng thái bản quyền
          </h2>
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2 text-blue-600 font-black text-xl">
              <CheckCircle2 size={24} /> TRỌN ĐỜI (LIFETIME)
            </div>
            <p className="text-blue-500/80 text-xs font-medium italic">
              * Phần mềm được cấp quyền sử dụng vĩnh viễn cho máy này.
            </p>
          </div>
        </div>
      </div>

      {/* Card Device ID - Phần quan trọng để khóa bản quyền */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Cpu size={16} /> Thông tin thiết bị (Hardware ID)
            </h2>
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-[10px] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-all"
            >
                {isCopied ? <><CheckCircle2 size={12} className="text-green-500" /> ĐÃ CHÉP</> : <><Copy size={12} /> SAO CHÉP ID</>}
            </button>
        </div>
        <div className="bg-slate-200/50 p-4 rounded-xl font-mono text-sm text-slate-600 break-all border border-slate-200">
          {deviceId}
        </div>
        <p className="text-[11px] text-slate-400 italic">
            * Cung cấp mã này cho tác giả để được hỗ trợ kỹ thuật hoặc gia hạn bản quyền.
        </p>
      </div>

      <div className="text-center pt-10">
         <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            © 2026 MinMin Control Phone - All Rights Reserved
         </p>
      </div>
    </div>
  );
};