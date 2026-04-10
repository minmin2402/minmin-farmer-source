import { Zap, Video, PenTool, Sparkles, SendHorizontal } from "lucide-react";

export const VideoAiGrok = () => {
  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen pb-24">
      {/* Header phong cách X.AI */}
      <div className="flex items-center gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                GROK <span className="bg-white text-black px-2 py-0.5 rounded text-sm">VIDEO ENGINE</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">Bắt trend từ X - Tạo video bằng trí tuệ của Elon Musk</p>
        </div>
        <Video className="absolute -right-5 -top-5 w-48 h-48 text-white/5 rotate-12" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Cấu hình kịch bản */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="flex items-center gap-2 font-black text-slate-800 uppercase text-sm mb-4">
               <PenTool size={18}/> Kịch bản Grok
            </h2>
            <textarea 
               className="w-full bg-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none h-40"
               placeholder="Nhập chủ đề đang hot trên X (ví dụ: Bitcoin vừa lập đỉnh mới)..."
            />
            
            <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase">
                    <span>Độ hài hước</span>
                    <span className="text-slate-900">MAX (Grok Mode)</span>
                </div>
                <input type="range" className="w-full accent-slate-900" />
            </div>

            <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all active:translate-y-[2px]">
                <Sparkles size={18} /> VÍT GA TẠO VIDEO
            </button>
          </div>
        </div>

        {/* Danh sách kết quả */}
        <div className="col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-y-auto max-h-[70vh]">
            <h2 className="flex items-center gap-2 font-black text-slate-800 uppercase text-sm mb-6 border-b pb-4">
               <Video size={18}/> Studio Video của MinMin
            </h2>
            
            {/* List video render ra đây */}
            <div className="grid grid-cols-2 gap-4">
                <VideoCard title="Trend Bitcoin 2026" status="Đã xong" />
                <VideoCard title="Elon Musk đi Việt Nam" status="Đang dựng..." loading />
            </div>
        </div>
      </div>
    </div>
  );
};

// Component nhỏ hỗ trợ
const VideoCard = ({ title, status, loading }: any) => (
  <div className={`p-4 rounded-2xl border-2 ${loading ? 'border-dashed border-slate-300 animate-pulse' : 'border-slate-100 bg-slate-50'} group`}>
    <div className="aspect-[9/16] bg-slate-800 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
        {loading ? <Zap className="text-slate-600 animate-bounce" /> : <div className="text-white text-[10px] font-mono">[VIDEO PREVIEW]</div>}
    </div>
    <p className="font-black text-slate-800 text-sm truncate">{title}</p>
    <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase">{status}</span>
        {!loading && (
            <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-orange-500 transition-colors">
                <SendHorizontal size={14} />
            </button>
        )}
    </div>
  </div>
);