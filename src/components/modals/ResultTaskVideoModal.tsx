import { X, Settings, FolderOpen, Video, Copy } from "lucide-react";
import { VideoTask } from "../../types/VideoTask";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: VideoTask | null;
  onUpdateTask: (a:VideoTask) => void;
}

export const ResultTaskVideoModal = ({
  isOpen,
  onClose,
  task,
  onUpdateTask,
}: ConfigModalProps) => {
  if (!isOpen) return null; // Nếu không mở thì không render gì cả
  const handleChangeDesc = (newDesc: string) => {
    if (!task) return;

    // Tạo object task mới với mô tả đã sửa
    const updatedTask = {
      ...task,
      productDesc: newDesc,
    };

    // Gọi callback để cập nhật lên cha
    onUpdateTask(updatedTask);
  };
  return (
    // 1. Overlay - Lớp nền mờ phía sau
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* HEADER: Tiêu đề & Nút đóng */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings size={20} className="text-indigo-600" />
            <h3 className="font-bold text-base">Kết Quả</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY: Nội dung cấu hình (Có scroll nếu dài) */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-8 custom-scrollbar bg-white">
          {/* PHẦN 1: Thông tin sản phẩm */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Chi Tiết Sản Phẩm Cào Được
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CỘT TRÁI: HIỂN THỊ ẢNH */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Ảnh Sản Phẩm (Thumbnail)
                </label>
                <div className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 flex items-center justify-center">
                  {task?.productPathImg ? (
                    <img
                      src={`${task.productPathImg}`} // 🚀 Trick để Electron đọc file từ local path
                      alt="Product"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/300?text=Loi+Anh";
                      }}
                    />
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-2">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-xs font-medium">Chưa có ảnh</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Preview
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI: THÔNG TIN TEXT */}
              <div className="space-y-5">
                {/* Tên SP */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase">
                    Tên SP
                  </label>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed border-b border-slate-100 pb-2">
                    {task?.productName || "---"}
                  </p>
                </div>

                {/* Link SP */}
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase">
                    Link Gốc
                  </label>
                  <a
                    href={task?.productUrl}
                    target="_blank"
                    className="block text-xs font-medium text-indigo-500 hover:text-indigo-600 truncate underline decoration-indigo-200"
                  >
                    {task?.productUrl || "Chưa có đường dẫn"}
                  </a>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex justify-between">
                    Mô tả tóm tắt
                    <span className="text-[10px] font-normal lowercase text-blue-500">
                      (Có thể chỉnh sửa)
                    </span>
                  </label>
                  <div className="bg-slate-50 rounded-xl border border-slate-100 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
                    <textarea
                      className="w-full bg-transparent p-3 text-[13px] text-slate-600 leading-relaxed italic outline-none resize-none min-h-25"
                      value={task?.productDesc || ""}
                      placeholder="Không có mô tả cho sản phẩm này."
                      onChange={(e) => handleChangeDesc(e.target.value)}
                      rows={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PHẦN 2: Chi tiết VideoJobs */}
          {/* PHẦN 2: Chi tiết Video Jobs */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Chi Tiết Video Jobs
              </h4>
            </div>
            {task?.finalVideoPath && (
              <div className="mt-6 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded">
                    <Video size={14} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                      Video Output
                    </span>
                    <span className="text-xs font-medium text-slate-600 truncate italic">
                      {task.finalVideoPath}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Gọi API Electron để mở thư mục chứa file
                    //@ts-ignore
                    window.electronAPI.openPath(task.finalVideoPath);
                  }}
                  className="shrink-0 flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2 py-1.5 rounded-md text-[11px] font-bold shadow-sm transition-all active:scale-95"
                  title="Mở thư mục chứa video"
                >
                  <FolderOpen size={14} className="text-amber-500" />
                  Mở Folder
                </button>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(task.finalVideoPath);
                  }}
                  className="shrink-0 flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2 py-1.5 rounded-md text-[11px] font-bold shadow-sm transition-all active:scale-95"
                  title="Copy đường dẫn video"
                >
                  <Copy size={14} className="text-amber-500" />
                  Copy Path
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* CỘT 1 (Rộng nhất - 6/12): PROMPT AI */}
              <div className="lg:col-span-6 space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  AI Video Prompt (Kịch bản chi tiết)
                </label>
                <div className="h-full min-h-62.5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-4 relative group">
                  {task?.prompt ? (
                    <pre className=" custom-scrollbar text-sm text-slate-600 leading-relaxed h-96 font-medium whitespace-pre-wrap font-sans overflow-y-auto">
                      {task.prompt}
                    </pre>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                      <svg
                        className="w-8 h-8 mb-2 opacity-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">
                        Đang chờ tạo Prompt...
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-white shadow-sm rounded-md text-slate-400 hover:text-indigo-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* CỘT 2 (3/12): FILE ẢNH 9:16 (KEYFRAME) */}
              <div className="lg:col-span-3 space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Ảnh Gốc AI (9:16)
                </label>
                <div className="aspect-9/16 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-900 shadow-inner flex items-center justify-center relative group">
                  {task?.aiImagePath ? (
                    <img
                      src={`file://${task.aiImagePath.replace(/\\/g, "/")}`}
                      alt="AI Gen"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center px-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-5 h-5 text-slate-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-[9px] text-slate-500 uppercase font-black">
                        Waiting for Image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CỘT 3 (3/12): VIDEO KẾT QUẢ */}
              <div className="lg:col-span-3 space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Video Thành Phẩm
                </label>
                <div className="aspect-9/16 rounded-2xl overflow-hidden border-2 border-indigo-100 bg-black shadow-xl flex items-center justify-center relative group">
                  {task?.finalVideoPath ? (
                    <video
                      src={`file://${task.finalVideoPath.replace(/\\/g, "/")}`}
                      className="w-full h-full object-contain bg-black"
                      controls
                    />
                  ) : (
                    <div className="text-center px-4">
                      <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                        <svg
                          className="w-6 h-6 text-indigo-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-[9px] text-indigo-400 uppercase font-black">
                        Rendering...
                      </p>
                    </div>
                  )}
                  {/* Badge trạng thái */}
                  <div className="absolute top-3 right-3 bg-indigo-500 text-[8px] font-bold text-white px-2 py-0.5 rounded-full uppercase">
                    Final
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER: Nút đóng */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose} // Nút Hủy (không lưu)
            className="px-6 py-2.5 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
