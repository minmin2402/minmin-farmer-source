import { useState, useEffect } from "react";
import { 
  Gauge, 
  RefreshCw, 
  MonitorSmartphone, 
  AlertCircle, 
  Loader2,
  ListRestart,
  Sparkles,
  Zap,
  Brain
} from "lucide-react";
import toast from "react-hot-toast";

interface GrokProfile {
  id: string;
  name: string;
}

interface SingleLimit {
  success: boolean;
  remaining?: number;
  total?: number;
  window?: number; 
  message?: string;
}

interface ProfileLimitData {
  auto?: SingleLimit;  // Thêm auto
  fast?: SingleLimit;
  grok3?: SingleLimit;
}

export const CheckLimitGrok = () => {
  const [profiles, setProfiles] = useState<GrokProfile[]>([]);
  const [limits, setLimits] = useState<Record<string, ProfileLimitData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isCheckingAll, setIsCheckingAll] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("minmin_app_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const grokProfiles: GrokProfile[] = parsed.grok_profiles || [];
        setProfiles(grokProfiles);
        
        if (grokProfiles.length > 0) {
          checkAllLimits(grokProfiles);
        }
      } catch (e) {
        console.error("Lỗi đọc settings:", e);
      }
    }
  }, []);

  const checkSingleLimit = async (profileId: string) => {
    setLoading(prev => ({ ...prev, [profileId]: true }));
    try {
      // Gọi cả 3 cái song song bằng Promise.all để tăng tốc thay vì await từng cái
      const [resGrok3, resAuto, resFast] = await Promise.all([
        // @ts-ignore
        window.electronAPI.checkGrokLimit(profileId, "grok-3"),
        // @ts-ignore
        window.electronAPI.checkGrokLimit(profileId, "auto"),
        // @ts-ignore
        window.electronAPI.checkGrokLimit(profileId, "fast")
      ]);
      
      setLimits(prev => ({ 
        ...prev, 
        [profileId]: { grok3: resGrok3, auto: resAuto, fast: resFast } 
      }));
      
      // Chỉ cần 1 trong 3 cái báo lỗi là mình thông báo cho user biết
      if (resGrok3.success && resAuto.success && resFast.success) {
        toast.success(`Đã cập nhật Profile ${profileId}`);
      } else {
        toast.error(`Có lỗi/Giới hạn ở Profile ${profileId}`);
      }
    } catch (error) {
      setLimits(prev => ({ 
        ...prev, 
        [profileId]: { 
          grok3: { success: false, message: "Lỗi kết nối" },
          auto: { success: false, message: "Lỗi kết nối" },
          fast: { success: false, message: "Lỗi kết nối" }
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [profileId]: false }));
    }
  };

  const checkAllLimits = async (targetProfiles: GrokProfile[] = profiles) => {
    setIsCheckingAll(true);
    await Promise.all(targetProfiles.map(p => checkSingleLimit(p.id)));
    setIsCheckingAll(false);
  };

  const getStatusColor = (remaining: number, total: number) => {
    const percent = (remaining / total) * 100;
    if (percent > 50) return "bg-current"; 
    if (percent > 20) return "bg-orange-500";
    return "bg-red-500";
  };

  // Hàm chuyển đổi giây sang giờ/phút
  const formatTime = (seconds?: number) => {
    if (!seconds) return "";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0 && minutes > 0) return `${hours}h${minutes}p`;
    if (hours > 0) return `${hours} tiếng`;
    return `${minutes} phút`;
  };

  // Component hiển thị 1 thanh limit (Được tối ưu lại UI)
  const LimitBar = ({ title, icon: Icon, data, themeClass }: { title: string, icon: any, data?: SingleLimit, themeClass: string }) => {
    if (!data) return null;
    
    if (!data.success) {
      return (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 flex flex-col gap-1 mt-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span className="text-xs font-black uppercase">{title} - Lỗi</span>
          </div>
          <p className="text-[11px] font-medium opacity-80 leading-tight truncate" title={data.message}>
            {data.message}
          </p>
        </div>
      );
    }

    return (
      <div className={`p-3 rounded-xl border flex flex-col gap-2 mt-2 ${themeClass}`}>
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-1.5">
            <Icon size={14} />
            <span className="text-[10px] font-black uppercase opacity-70">{title}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black">{data.remaining}</span>
            <span className="text-xs font-bold opacity-50">/ {data.total}</span>
          </div>
        </div>
        
        <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getStatusColor(data.remaining || 0, data.total || 1)}`} 
            style={{ width: `${((data.remaining || 0) / (data.total || 1)) * 100}%` }}
          ></div>
        </div>
        
        <div className="text-[9px] font-bold uppercase opacity-50 text-right mt-0.5">
          Reset sau {formatTime(data.window)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen overflow-y-auto pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-0 z-10 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Gauge className="text-sky-500" /> Giám Sát Limit Grok
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Kiểm tra chi tiết số lượt theo từng loại model của Profile
            </p>
          </div>
            
          <button 
            onClick={() => checkAllLimits()}
            disabled={isCheckingAll || profiles.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-200"
          >
            {isCheckingAll ? <Loader2 size={18} className="animate-spin" /> : <ListRestart size={18} />}
            CHECK TẤT CẢ ({profiles.length})
          </button>
        </div>

        {profiles.length === 0 && (
          <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-3">
            <MonitorSmartphone size={48} className="text-slate-200" />
            <h3 className="text-slate-500 font-bold">Chưa có Profile Grok nào!</h3>
            <p className="text-sm text-slate-400">Vui lòng vào phần Cấu Hình Hệ Thống để thêm profile GPM.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {profiles.map((profile) => {
            const isLoading = loading[profile.id];
            const data = limits[profile.id];
            
            return (
              <div key={profile.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                {isLoading && (
                  <div className="absolute top-0 left-0 h-1 bg-sky-500 animate-pulse w-full"></div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 line-clamp-1">{profile.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                      ID: {profile.id}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => checkSingleLimit(profile.id)}
                    disabled={isLoading}
                    className={`p-2 rounded-lg border transition-all ${isLoading ? 'border-slate-100 bg-slate-50 text-slate-300' : 'border-sky-100 bg-sky-50 text-sky-600 hover:bg-sky-100'}`}
                  >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  {!data && !isLoading && (
                    <div className="text-xs text-slate-400 font-medium flex items-center justify-center py-4 bg-slate-50 rounded-xl mt-2">
                      Đang chờ kiểm tra...
                    </div>
                  )}

                  {isLoading && !data && (
                    <div className="text-xs text-sky-500 font-bold flex items-center justify-center py-4 gap-2 bg-sky-50 rounded-xl mt-2">
                      <Loader2 size={14} className="animate-spin" /> Đang lấy dữ liệu...
                    </div>
                  )}

                  {data && (
                    <>
                      {/* Cột cho Grok-3 (Tạo Video/Ảnh/Audio) */}
                      <LimitBar 
                        title="Grok-3 (Video/Media)" 
                        icon={Sparkles} 
                        data={data.grok3} 
                        themeClass="bg-purple-50 border-purple-100 text-purple-700" 
                      />

                      {/* Cột cho Auto (Advanced Text) */}
                      <LimitBar 
                        title="Auto (Nâng cao)" 
                        icon={Brain} 
                        data={data.auto} 
                        themeClass="bg-blue-50 border-blue-100 text-blue-700" 
                      />
                      
                      {/* Cột cho Fast (Chat/Text) */}
                      <LimitBar 
                        title="Fast (Chat nhanh)" 
                        icon={Zap} 
                        data={data.fast} 
                        themeClass="bg-emerald-50 border-emerald-100 text-emerald-700" 
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};