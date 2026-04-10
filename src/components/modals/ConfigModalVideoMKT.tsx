import React, { useState } from "react";
import {
  X,
  Folder,
  Settings,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { STORAGE_KEY } from "../../types/KeyLocalStorage";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  configVideoMKT: any;
  setConfigVideoMKT: any;
}

export const ConfigModalVideoMKT = ({
  isOpen,
  onClose,
  configVideoMKT,
  setConfigVideoMKT,
}: ConfigModalProps) => {
  if (!isOpen) return null; // Nếu không mở thì không render gì cả
  const [statusGPMAPI, setStatusGPMAPI] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSaveAndClose = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configVideoMKT));
    onClose(); // Lưu xong mới đóng
  };
  const handleTextareaChangeProfilesAff = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = e.target.value;

    // 🟢 CHỈ CẮT (\n), KHÔNG FILTER dòng trống ở đây để khách bấm Enter được
    const array = text.split("\n").map((id) => id.trim());

    setConfigVideoMKT({
      ...configVideoMKT,
      profiles_aff: array,
    });
  };

  const handleTextareaChangeAPIKeyGemini = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = e.target.value;

    // 🟢 CHỈ CẮT (\n), KHÔNG FILTER dòng trống ở đây để khách bấm Enter được
    const array = text.split("\n").map((id) => id.trim());

    setConfigVideoMKT({
      ...configVideoMKT,
      apikey_gemini: array,
    });
  };
  /* const handleTextareaChangeProfilesVeo3 = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = e.target.value;

    // 🟢 CHỈ CẮT (\n), KHÔNG FILTER dòng trống ở đây để khách bấm Enter được
    const array = text.split("\n").map((id) => id.trim());

    setConfigVideoMKT({
      ...configVideoMKT,
      profiles_veo3: array,
    });
  }; */
  const handleTextareaChangeProfilesGrok = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = e.target.value;

    // 🟢 CHỈ CẮT (\n), KHÔNG FILTER dòng trống ở đây để khách bấm Enter được
    const array = text.split("\n").map((id) => id.trim());

    setConfigVideoMKT({
      ...configVideoMKT,
      profiles_grok: array,
    });
  };
  const handleCheckGPMAPI = async () => {
    setStatusGPMAPI("loading");

    // Gọi xuống Backend thông qua Preload API
    //@ts-ignore
    const result = await window.electronAPI.checkGpmConnection(
      configVideoMKT.api_gpm,
    );

    if (result.success) {
      setStatusGPMAPI("success");
      alert("✅ Ngon lành! Kết nối GPM OK.");
    } else {
      setStatusGPMAPI("error");
      alert("❌ Lỗi rồi MinMin ơi: " + result.message);
    }

    // Reset trạng thái sau 3 giây
    setTimeout(() => setStatusGPMAPI("idle"), 2000);
  };
  return (
    // 1. Overlay - Lớp nền mờ phía sau
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* HEADER: Tiêu đề & Nút đóng */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings size={20} className="text-indigo-600" />
            <h3 className="font-bold text-base">Cấu hình</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY: Nội dung cấu hình (Có scroll nếu dài) */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-8 custom-scrollbar">
          {/* PHẦN 1: Cấu hình chung */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Cấu hình chung
              </h4>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase">
                Lưu tại
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={configVideoMKT.output_video}
                  onChange={(e) =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      output_video: e.target.value,
                    })
                  }
                  placeholder="D:\Output\Videos"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  onClick={async () => {
                    //@ts-ignore
                    const result = await window.electronAPI.selectFolder();
                    if (result) {
                      setConfigVideoMKT({
                        ...configVideoMKT,
                        output_video: result,
                      });
                    }
                  }}
                  className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500"
                >
                  <Folder size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
              <span className="text-sm font-semibold text-slate-600">
                Lưu video theo cấp Shop ID/Product ID
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase">
                  Luồng
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      thread: Number(e.target.value),
                    })
                  }
                  value={configVideoMKT.thread}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase text-nowrap">
                  Thời gian chờ giữa các lần chạy (Giây)
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      delay_between: Number(e.target.value),
                    })
                  }
                  value={configVideoMKT.delay_between}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* PHẦN 2: Cấu hình cào dữ liệu */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
              <User size={16} className="text-indigo-500" />
              <h4 className="text-sm font-black text-slate-800 uppercase">
                Cấu hình cào dữ liệu Shopee, Tiktok Shop
              </h4>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase">
                API GPMLOGIN
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={configVideoMKT.api_gpm}
                  onChange={(e) =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      api_gpm: e.target.value,
                    })
                  }
                  placeholder="http://localhost:9495"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500 transition-all"
                />

                <button
                  onClick={handleCheckGPMAPI}
                  disabled={statusGPMAPI === "loading"}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                    statusGPMAPI === "success"
                      ? "bg-green-500 text-white"
                      : statusGPMAPI === "error"
                        ? "bg-red-500 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                  }`}
                >
                  {statusGPMAPI === "loading" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : statusGPMAPI === "success" ? (
                    <CheckCircle2 size={14} />
                  ) : statusGPMAPI === "error" ? (
                    <AlertCircle size={14} />
                  ) : null}
                  {statusGPMAPI === "loading" ? "Đang check..." : "Check"}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase">
                Danh sách Profile ID đang login Shopee/Tiktok
              </label>
              <textarea
                placeholder="Danh sách Profile ID login Shopee, TikTok (mỗi dòng 1 ID)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 h-24 resize-none transition-all"
                // 1. HIỂN THỊ: Biến mảng thành chuỗi có dấu xuống dòng 🔄
                value={configVideoMKT.profiles_aff.join("\n")}
                // 2. LƯU: Biến chuỗi từ textarea thành mảng 📥
                onChange={handleTextareaChangeProfilesAff}
              ></textarea>

              {/* Hiển thị số lượng ID đã nhập cho chuyên nghiệp */}
              <div className="text-[10px] text-right text-indigo-500 font-bold">
                Đã nhập: {configVideoMKT.profiles_aff.length} Profile
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase">
                Phương thức tải trang (WaitUntil)
              </label>
              <select
                onChange={(e) =>
                  setConfigVideoMKT({
                    ...configVideoMKT,
                    method_load_page: e.target.value,
                  })
                }
                value={configVideoMKT.method_load_page}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 appearance-none"
              >
                <option>load</option>
                <option>domcontentloaded</option>
                <option>networkidle0</option>
                <option>networkidle2</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase">
                  Thời gian chờ tải trang (ms)
                </label>
                <input
                  onChange={(e) =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      time_loading_page: Number(e.target.value),
                    })
                  }
                  value={configVideoMKT.time_loading_page}
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase">
                  Thời gian chờ bắt dữ liệu (ms)
                </label>
                <input
                  onChange={(e) =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      time_wait_getdata: Number(e.target.value),
                    })
                  }
                  value={configVideoMKT.time_wait_getdata}
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* PHẦN 3: Danh sách Profile Veo */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
              <User size={16} className="text-indigo-500" />
              <h4 className="text-sm font-black text-slate-800 uppercase">
                Danh sách Profile Grok
              </h4>
            </div>
            <textarea
              value={configVideoMKT.profiles_grok.join("\n")}
              // 2. LƯU: Biến chuỗi từ textarea thành mảng 📥
              onChange={handleTextareaChangeProfilesGrok}
              placeholder="Danh sách Profile ID login Grok (mỗi dòng 1 ID)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 h-24 resize-none"
            ></textarea>
          </section>

          {/* PHẦN 4: Cấu Hình sinh Prompt */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
              <User size={16} className="text-indigo-500" />
              <h4 className="text-sm font-black text-slate-800 uppercase">
                Cấu hình sinh Prompt
              </h4>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase">
                Danh sách API KEY Gemini
              </label>
              <textarea
                placeholder="Mỗi key Gemini 1 dòng"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 h-24 resize-none transition-all"
                // 1. HIỂN THỊ: Biến mảng thành chuỗi có dấu xuống dòng 🔄
                value={configVideoMKT.apikey_gemini.join("\n")}
                // 2. LƯU: Biến chuỗi từ textarea thành mảng 📥
                onChange={handleTextareaChangeAPIKeyGemini}
              ></textarea>
            </div>
            <div className="flex flex-col gap-2 space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase">
                Mô Hình AI Tạo Ảnh
              </label>

              <div className="relative">
                <select
                  value={configVideoMKT.model_ai_img}
                  className="w-full p-2.5 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm outline-none appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer font-medium"
                  onChange={(e)=> setConfigVideoMKT({...configVideoMKT,model_ai_img: e.target.value})}
                >
                  <option value="banana-pro">Banana pro</option>
                  <option value="nano-banana-2">Nano banana 2</option>
                </select>

                {/* Icon mũi tên xuống (SVG) để trông chuyên nghiệp hơn */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase">
                Cấu trúc Prompt Review
              </label>
              <div className="flex gap-2 mt-2">
                <textarea
                  value={configVideoMKT.prompt_review}
                  onChange={(e) =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      prompt_review: e.target.value,
                    })
                  }
                  placeholder="cấu trúc prompt review"
                  className=" custom-scrollbar w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 h-36 resize-none"
                ></textarea>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase">
                Cấu hình Prompt (Ảnh)
              </label>
              <div className="flex gap-2 mt-2">
                <textarea
                  value={configVideoMKT.prompt_image}
                  onChange={(e) =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      prompt_image: e.target.value,
                    })
                  }
                  placeholder="Prompt Video AI"
                  className=" custom-scrollbar w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 h-36 resize-none"
                ></textarea>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase">
                Cấu hình Prompt (Video)
              </label>
              <div className="flex gap-2 mt-2">
                <textarea
                  value={configVideoMKT.prompt_video}
                  onChange={(e) =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      prompt_video: e.target.value,
                    })
                  }
                  placeholder="Prompt Video AI"
                  className="custom-scrollbar w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 h-36 resize-none"
                ></textarea>
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
            Hủy
          </button>
          <button
            onClick={handleSaveAndClose} // 🚀 Nút LƯU VÀ ĐÓNG
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
};
