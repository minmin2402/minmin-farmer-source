import { useState, useEffect } from "react";
import { Trash2, Calendar, Play, FileVideo, HardDrive } from "lucide-react";
import toast from "react-hot-toast";

export const VideoLibrary = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [generalSettings, setGeneralSettings] = useState<any>(null);

  // 1. Load settings trước
  useEffect(() => {
    const saved = localStorage.getItem("minmin_app_settings");
    if (saved) setGeneralSettings(JSON.parse(saved));
  }, []);

  // 2. Hàm load video an toàn (Chỉ chạy khi đã có path)
  const loadVideos = async () => {
    if (!generalSettings?.path_storage_video) return;
    //@ts-ignore
    const data = await window.electronAPI.getPinnedVideos(
      generalSettings.path_storage_video
    );
    setVideos(data);
  };

  // 3. Theo dõi khi generalSettings có data thì mới gọi API vét ổ cứng
  useEffect(() => {
    if (generalSettings) {
      loadVideos();
    }
  }, [generalSettings]);

  const handleDelete = async (id: string, path: string) => {
    if (confirm("⚠️ CẢNH BÁO: Hành động này sẽ xóa file vĩnh viễn khỏi ổ cứng. Vẫn tiếp tục?")) {
      await (window as any).electronAPI.deleteVideo(id, path);
      loadVideos();
      toast.success("Đã xóa video thành công!");
    }
  };

  // Logic lọc theo ngày
  const filtered = filterDate
    ? videos.filter((v) => v.createdAt.startsWith(filterDate))
    : videos;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* ================= HEADER SECTION ================= */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
            <FileVideo size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Kho Lưu Trữ Video
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              Quản lý và xem trước kết quả từ các chiến dịch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Thông tin Folder */}
          <div 
            onClick={() => toast("Vui lòng qua tab Settings để sửa đường dẫn", { icon: "⚙️" })}
            className="group flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all"
          >
            <HardDrive size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 w-120 uppercase leading-none mb-1">
                Folder Lưu Video
              </span>
              <span className="text-xs font-bold text-slate-700 max-w-120 truncate leading-none">
                {generalSettings?.path_storage_video || "Chưa thiết lập"}
              </span>
            </div>
          </div>

          {/* Bộ lọc ngày */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2.5 rounded-xl focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-sm">
            <Calendar size={18} className="text-slate-400" />
            <input
              type="date"
              className="outline-none text-sm font-semibold text-slate-700 bg-transparent cursor-pointer"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* ================= MAIN GALLERY SECTION ================= */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filtered.map((vid) => (
            <div
              key={vid.id}
              className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Khung Video 16:9 chuẩn Cinematic */}
              <div className="relative w-full aspect-video bg-slate-900 border-b border-slate-100">
                <video
                  className="w-full h-full object-contain"
                  src={`box-media://${vid.absolutePath}`}
                  controls
                  preload="metadata"
                />
              </div>

              {/* Thông tin Video */}
              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug"
                  title={vid.name}
                >
                  {vid.name || "Video không tên"}
                </h3>
                
                <div className="flex items-center justify-between mt-auto pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Ngày lưu</span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      {new Date(vid.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  
                  {/* Nút Xóa thiết kế dạng Icon Button gọn gàng */}
                  <button
                    onClick={() => handleDelete(vid.id, vid.absolutePath)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Xóa vĩnh viễn khỏi ổ cứng"
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= TRẠNG THÁI TRỐNG ================= */}
        {filtered.length === 0 && (
          <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400">
            <div className="p-6 bg-slate-100 rounded-full mb-4">
              <Play size={48} strokeWidth={1.5} className="text-slate-300 ml-1" />
            </div>
            <h3 className="text-lg font-bold text-slate-600">Kho video đang trống</h3>
            <p className="text-sm font-medium mt-1">Chưa có video nào hoặc không tìm thấy ngày bạn chọn.</p>
          </div>
        )}
      </main>
    </div>
  );
};