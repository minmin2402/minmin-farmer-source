import { useState, useEffect } from "react";
import { 
  Gauge, 
  RefreshCw, 
  MonitorSmartphone, 
  AlertCircle, 
  Loader2,
  ListRestart
} from "lucide-react";
import toast from "react-hot-toast";

// Định nghĩa kiểu dữ liệu
interface GrokProfile {
  id: string;
  name: string;
}

interface LimitData {
  success: boolean;
  remaining?: number;
  total?: number;
  message?: string;
}

export const CheckLimitGrok = () => {
  const [profiles, setProfiles] = useState<GrokProfile[]>([]);
  // Lưu kết quả limit của từng profile theo ID
  const [limits, setLimits] = useState<Record<string, LimitData>>({});
  // Trạng thái loading của từng profile
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isCheckingAll, setIsCheckingAll] = useState(false);

  // Load profile từ localStorage khi render
  useEffect(() => {
    const saved = localStorage.getItem("minmin_app_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const grokProfiles: GrokProfile[] = parsed.grok_profiles || [];
        setProfiles(grokProfiles);
        
        // Tự động check toàn bộ ngay khi vừa render
        if (grokProfiles.length > 0) {
          checkAllLimits(grokProfiles);
        }
      } catch (e) {
        console.error("Lỗi đọc settings:", e);
      }
    }
  }, []);

  // Hàm check limit cho 1 profile
  const checkSingleLimit = async (profileId: string) => {
    setLoading(prev => ({ ...prev, [profileId]: true }));
    try {
      // Gọi xuống Electron Backend
      // @ts-ignore
      const res = await window.electronAPI.checkGrokLimit(profileId);
      
      setLimits(prev => ({ ...prev, [profileId]: res }));
      
      if (res.success) {
        toast.success(`Profile ${profileId}: Còn ${res.remaining}/${res.total} lượt`);
      } else {
        toast.error(`Profile ${profileId} lỗi: ${res.message || 'Không xác định'}`);
      }
    } catch (error) {
      setLimits(prev => ({ 
        ...prev, 
        [profileId]: { success: false, message: "Mất kết nối với Backend" } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [profileId]: false }));
    }
  };

  // Hàm check toàn bộ
  const checkAllLimits = async (targetProfiles: GrokProfile[] = profiles) => {
    setIsCheckingAll(true);
    // Chạy song song tất cả các request
    await Promise.all(targetProfiles.map(p => checkSingleLimit(p.id)));
    setIsCheckingAll(false);
  };

  // Tính toán màu sắc dựa trên % còn lại
  const getStatusColor = (remaining: number, total: number) => {
    const percent = (remaining / total) * 100;
    if (percent > 50) return "text-green-600 bg-green-50 border-green-200";
    if (percent > 20) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen overflow-y-auto pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-0 z-10 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Gauge className="text-sky-500" /> Giám Sát Limit Grok
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Kiểm tra số lượt tạo ảnh/video còn lại của từng profile
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

        {/* Cảnh báo nếu chưa có profile */}
        {profiles.length === 0 && (
          <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-3">
            <MonitorSmartphone size={48} className="text-slate-200" />
            <h3 className="text-slate-500 font-bold">Chưa có Profile Grok nào!</h3>
            <p className="text-sm text-slate-400">Vui lòng vào phần Cấu Hình Hệ Thống để thêm profile GPM.</p>
          </div>
        )}

        {/* Grid hiển thị các Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {profiles.map((profile) => {
            const isLoading = loading[profile.id];
            const data = limits[profile.id];
            
            return (
              <div key={profile.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                {/* Đường line loading chạy ngang */}
                {isLoading && (
                  <div className="absolute top-0 left-0 h-1 bg-sky-500 animate-pulse w-full"></div>
                )}

                <div className="flex justify-between items-start mb-4">
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

                {/* Khu vực hiển thị kết quả */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {!data && !isLoading && (
                    <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      Đang chờ kiểm tra...
                    </div>
                  )}

                  {isLoading && !data && (
                    <div className="text-xs text-sky-500 font-bold flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Đang lấy dữ liệu...
                    </div>
                  )}

                  {data && data.success && (
                    <div className={`p-3 rounded-xl border flex flex-col gap-2 ${getStatusColor(data.remaining || 0, data.total || 1)}`}>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase opacity-70">Lượt còn lại</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black">{data.remaining}</span>
                          <span className="text-sm font-bold opacity-50">/ {data.total}</span>
                        </div>
                      </div>
                      {/* Thanh progress bar */}
                      <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-current rounded-full" 
                          style={{ width: `${((data.remaining || 0) / (data.total || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {data && !data.success && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        <span className="text-xs font-black uppercase">Lỗi lấy dữ liệu</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-80 leading-tight">
                        {data.message}
                      </p>
                    </div>
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