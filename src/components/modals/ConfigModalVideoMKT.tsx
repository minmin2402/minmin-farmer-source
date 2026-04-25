import React, { useState, useEffect } from "react";
import {
  X,
  Folder,
  Settings,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Search,
  User2,
  Lock,
  Sparkles,
  Database,
} from "lucide-react";
import { STORAGE_KEY } from "../../types/KeyLocalStorage";
import { DEFAULT_PROMPTS } from "../../const";
import { PromptSet } from "../../types/VideoTask";
import toast from "react-hot-toast";

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
  const [statusGPMAPI, setStatusGPMAPI] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  const [characterList, setCharacterList] = useState<any[]>([]);
  //const selectedChar = characterList.find(c => c.id === configVideoMKT.characterId);

  // Lấy dữ liệu Settings chung khi mở Modal
  useEffect(() => {
    if (isOpen) {
      const fetchCharacters = async () => {
        try {
          //@ts-ignore
          const list = await window.electronAPI.getCharacters();
          setCharacterList(list);
        } catch (error) {
          console.error("Không lấy được danh sách nhân vật", error);
        }
      };
      fetchCharacters();
      const saved = localStorage.getItem("minmin_app_settings");
      if (saved) {
        setGeneralSettings(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allPrompts = [...DEFAULT_PROMPTS, ...configVideoMKT.customPrompts];
  const currentPrompt =
    allPrompts.find((p) => p.id === configVideoMKT.activePromptId) ||
    DEFAULT_PROMPTS[0];

  const handleSaveAndClose = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configVideoMKT));
    onClose();
  };
  

  

  const handleTextareaChangeProfilesAff = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = e.target.value;
    const array = text.split("\n").map((id) => id.trim());
    setConfigVideoMKT({ ...configVideoMKT, profiles_aff: array });
  };

  const handleAddNewPrompt = () => {
    const newId = `prompt-${Date.now()}`;
    const newPrompt: PromptSet = {
      id: newId,
      name: `Bộ Prompt mới ${configVideoMKT.customPrompts.length + 1}`,
      prompt_review: "",
      prompt_image: "",
      prompt_video: "",
    };
    setConfigVideoMKT({
      ...configVideoMKT,
      customPrompts: [...configVideoMKT.customPrompts, newPrompt],
      activePromptId: newId,
    });
  };

  const updateCurrentPrompt = (field: keyof PromptSet, value: string) => {
    if (currentPrompt.isDefault) return;
    const updatedCustom = configVideoMKT.customPrompts.map((p: any) =>
      p.id === currentPrompt.id ? { ...p, [field]: value } : p,
    );
    setConfigVideoMKT({ ...configVideoMKT, customPrompts: updatedCustom });
  };

  const handleCheckGPMAPI = async () => {
    if (!generalSettings?.gpm_api_key)
      return toast.error("Chưa cấu hình GPM trong Settings!");
    setStatusGPMAPI("loading");
    try {
      //@ts-ignore
      const result = await window.electronAPI.checkGpmConnection(
        generalSettings.gpm_api_key,
      );
      if (result.success) {
        setStatusGPMAPI("success");
        toast.success("✅ Ngon lành! Kết nối GPM OK.");
      } else {
        setStatusGPMAPI("error");
        toast.error("❌ Lỗi GPM: " + result.message);
      }
    } catch (error) {
      toast.error("Mất kết nối GPM!");
    } finally {
      setTimeout(() => setStatusGPMAPI("idle"), 2000);
    }
  };

  const handleLockedInputClick = () => {
    toast("Hãy qua tab Cấu Hình (Settings) để thêm/sửa nhé!", { icon: "⚙️" });
  };

  // Hàm toggle chọn Item từ mảng (Grok/Veo Profile, Gemini Key)
  const toggleSelection = (field: string, value: string) => {
    const currentList = configVideoMKT[field] || [];
    if (currentList.includes(value)) {
      setConfigVideoMKT({
        ...configVideoMKT,
        [field]: currentList.filter((item: string) => item !== value),
      });
    } else {
      setConfigVideoMKT({
        ...configVideoMKT,
        [field]: [...currentList, value],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* HEADER: Tiêu đề & Nút đóng */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Settings size={20} className="text-indigo-600" />
            <h3 className="font-bold text-base">Cấu hình Video Marketing</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY: Nội dung cấu hình */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-8 custom-scrollbar">
          {/* PHẦN API DÙNG CHUNG (READ-ONLY) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-slate-400 pl-3">
              <Lock size={16} className="text-slate-400" />
              <h4 className="text-sm font-black text-slate-600 uppercase tracking-tight">
                API Dùng Chung (Chỉ Đọc)
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase">
                  API GPM Login
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    onClick={handleLockedInputClick}
                    value={generalSettings?.gpm_api_key || ""}
                    placeholder="Chưa cấu hình trong Settings..."
                    className="flex-1 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-2 text-sm cursor-not-allowed outline-none"
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
                  API OmoCaptcha
                </label>
                <input
                  type="password"
                  readOnly
                  onClick={handleLockedInputClick}
                  value={generalSettings?.omo_api_key || ""}
                  placeholder="Chưa cấu hình trong Settings..."
                  className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-2 text-sm cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </section>

          {/* PHẦN 1: Cấu hình chung (Lưu tại, luồng, delay) */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
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
                    if (result)
                      setConfigVideoMKT({
                        ...configVideoMKT,
                        output_video: result,
                      });
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
                  Thời gian chờ (Giây)
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
              <Search size={16} className="text-indigo-500" />
              <h4 className="text-sm font-black text-slate-800 uppercase">
                Cấu hình cào dữ liệu Shopee, Tiktok Shop
              </h4>
            </div>

            <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[12px] font-black text-slate-700 uppercase">
                    Sử dụng Profile tạo sẵn
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Cào thông tin shopee/tiktok từ profile tạo sẵn
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configVideoMKT.useProfileAff || false}
                    onChange={(e) =>
                      setConfigVideoMKT({
                        ...configVideoMKT,
                        useProfileAff: e.target.checked,
                      })
                    }
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {configVideoMKT.useProfileAff && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase">
                    Danh sách Profile ID đang login Shopee/Tiktok
                  </label>
                  <textarea
                    placeholder="Danh sách Profile ID login Shopee, TikTok (mỗi dòng 1 ID)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-indigo-500 h-24 resize-none transition-all"
                    value={configVideoMKT.profiles_aff.join("\n")}
                    onChange={handleTextareaChangeProfilesAff}
                  ></textarea>
                  <div className="text-[10px] text-right text-indigo-500 font-bold">
                    Đã nhập: {configVideoMKT.profiles_aff.length} Profile
                  </div>
                </div>
              )}
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

          {/* PHẦN CHỌN PROFILE GROK (CARD CHỌN) */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between border-l-4 border-blue-500 pl-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                <h4 className="text-sm font-black text-slate-800 uppercase">
                  Chọn Profile Grok
                </h4>
              </div>
              <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                Đã chọn: {(configVideoMKT.profiles_grok || []).length}
              </span>
            </div>

            {!generalSettings?.grok_profiles ||
            generalSettings.grok_profiles.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-sm text-slate-500">
                Chưa có profile nào.{" "}
                <span
                  className="font-bold text-blue-500 cursor-pointer"
                  onClick={handleLockedInputClick}
                >
                  Vào Settings thêm ngay!
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
                {generalSettings.grok_profiles.map((p: any) => {
                  const isSelected = (
                    configVideoMKT.profiles_grok || []
                  ).includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleSelection("profiles_grok", p.id)}
                      className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? "bg-blue-50 border-blue-500 shadow-sm shadow-blue-100 ring-1 ring-blue-500"
                          : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`text-xs font-black truncate w-full text-center ${isSelected ? "text-blue-700" : "text-slate-600"}`}
                      >
                        {p.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${isSelected ? "text-blue-500" : "text-slate-400"}`}
                      >
                        ID: {p.id}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* PHẦN CHỌN PROFILE VEO 3.1 (CARD CHỌN) */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between border-l-4 border-purple-500 pl-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-500" />
                <h4 className="text-sm font-black text-slate-800 uppercase">
                  Chọn Profile Veo 3.1
                </h4>
              </div>
              <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-1 rounded-md">
                Đã chọn: {(configVideoMKT.profiles_veo3 || []).length}
              </span>
            </div>

            {!generalSettings?.veo_profiles ||
            generalSettings.veo_profiles.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-sm text-slate-500">
                Chưa có profile nào.{" "}
                <span
                  className="font-bold text-purple-500 cursor-pointer"
                  onClick={handleLockedInputClick}
                >
                  Vào Settings thêm ngay!
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
                {generalSettings.veo_profiles.map((p: any) => {
                  const isSelected = (
                    configVideoMKT.profiles_veo3 || []
                  ).includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleSelection("profiles_veo3", p.id)}
                      className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? "bg-purple-50 border-purple-500 shadow-sm shadow-purple-100 ring-1 ring-purple-500"
                          : "bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`text-xs font-black truncate w-full text-center ${isSelected ? "text-purple-700" : "text-slate-600"}`}
                      >
                        {p.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${isSelected ? "text-purple-500" : "text-slate-400"}`}
                      >
                        ID: {p.id}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* PHẦN CHỌN GEMINI KEYS (CARD CHỌN) */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between border-l-4 border-sky-500 pl-3">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-sky-500" />
                <h4 className="text-sm font-black text-slate-800 uppercase">
                  Chọn API Keys Gemini
                </h4>
              </div>
              <span className="text-[10px] font-bold text-sky-500 bg-sky-50 px-2 py-1 rounded-md">
                Đã chọn: {(configVideoMKT.apikey_gemini || []).length}
              </span>
            </div>

            {!generalSettings?.gemini_api_keys ||
            generalSettings.gemini_api_keys.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-sm text-slate-500">
                Chưa có Key Gemini nào.{" "}
                <span
                  className="font-bold text-sky-500 cursor-pointer"
                  onClick={handleLockedInputClick}
                >
                  Vào Settings thêm ngay!
                </span>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                {generalSettings.gemini_api_keys.map(
                  (key: string, idx: number) => {
                    const isSelected = (
                      configVideoMKT.apikey_gemini || []
                    ).includes(key);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleSelection("apikey_gemini", key)}
                        className={`cursor-pointer border rounded-xl p-3 flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-sky-50 border-sky-500 shadow-sm ring-1 ring-sky-500"
                            : "bg-white border-slate-200 hover:border-sky-300"
                        }`}
                      >
                        <span
                          className={`text-[11px] font-mono truncate max-w-[80%] ${isSelected ? "text-sky-700 font-bold" : "text-slate-500"}`}
                        >
                          {key}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-sky-500 bg-sky-500" : "border-slate-300"}`}
                        >
                          {isSelected && (
                            <CheckCircle2 size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}

            {/* MODEL AI IMG MẶC ĐỊNH (BỊ ẨN THEO CODE CŨ) */}
            <div
              style={{ display: "none" }}
              className="flex flex-col gap-2 space-y-2"
            >
              <label className="text-[11px] font-black text-slate-400 uppercase">
                Mô Hình AI Tạo Ảnh
              </label>
              <div className="relative">
                <select
                  value={configVideoMKT.model_ai_img}
                  className="w-full p-2.5 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm outline-none appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer font-medium"
                  onChange={(e) => {
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      model_ai_img: e.target.value,
                    });
                  }}
                >
                  <option value="banana-pro">Banana pro</option>
                  <option value="nano-banana-2">Nano banana 2</option>
                </select>
              </div>
            </div>

            {/* CẤU HÌNH VBEE TTS */}
            <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      /*@ts-ignore*/
                      window.electronAPI.openExternal(
                        "https://vbee.vn/api-docs?srsltid=AfmBOoq5xkNfeZ5611bnxqUUtAj4wy4I3YCMcMBFUtUj9RXKFfSkugcU",
                      );
                    }}
                    className="text-[10px] font-bold text-blue-500 hover:text-blue-600 uppercase flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Hướng dẫn Vbee AI
                  </a>
                  <h3 className="text-sm font-bold text-slate-700">
                    Cấu hình Vbee (TTS)
                  </h3>
                  <p className="text-[10px] text-slate-500 italic">
                    Bật để sử dụng giọng đọc VBEE AI cho video
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={configVideoMKT.isUseVbee || false}
                    onChange={(e) =>
                      setConfigVideoMKT({
                        ...configVideoMKT,
                        isUseVbee: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {configVideoMKT.isUseVbee && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                        Giọng đọc
                      </label>
                      <div className="relative">
                        <select
                          value={configVideoMKT.voice_code}
                          className="w-full p-2.5 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm outline-none appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer font-medium"
                          onChange={(e) => {
                            setConfigVideoMKT({
                              ...configVideoMKT,
                              voice_code: e.target.value,
                            });
                          }}
                        >
                          <option value="s_hochiminh_male_nguoikechuyenbali2_advertise_vc">
                            Nam - Hồ Chí Minh
                          </option>
                          <option value="n_hanoi_male_quangquangcao_advertise_vc">
                            Nam - Hà Nội
                          </option>
                          <option value="s_cantho_female_xanxan_advertise_vc">
                            Nữ - Cần Thơ
                          </option>
                          <option value="n_hanoi_female_quangcao02_advertise_vc">
                            Nữ - Hà Nội
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                        Tốc độ (0.1 - 1.9)
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        max="1.9"
                        step="0.1"
                        value={configVideoMKT.speed_voice || 1.0}
                        className="w-full p-2.5 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                        placeholder="Ví dụ: 1.0"
                        onChange={(e) => {
                          let val = parseFloat(e.target.value);
                          if (val > 1.9) val = 1.9;
                          if (val < 0.1) val = 0.1;
                          setConfigVideoMKT({
                            ...configVideoMKT,
                            speed_voice: val,
                          });
                        }}
                      />
                      <p className="mt-1 text-xs text-slate-400 italic">
                        Mặc định thường là 1.0 (Bình thường)
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Vbee App ID
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập App ID..."
                        value={configVideoMKT.vbee_app_id || ""}
                        className="p-2.5 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium placeholder:text-slate-300 transition-all"
                        onChange={(e) =>
                          setConfigVideoMKT({
                            ...configVideoMKT,
                            vbee_app_id: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Vbee Token
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập Token..."
                        value={configVideoMKT.vbee_app_token || ""}
                        className="p-2.5 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium placeholder:text-slate-300 transition-all"
                        onChange={(e) =>
                          setConfigVideoMKT({
                            ...configVideoMKT,
                            vbee_app_token: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CẤU HÌNH PROMPT */}
            <div className="space-y-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex flex-col">
                  <label className="text-[11px] font-black text-slate-400 uppercase">
                    Chọn bộ cấu trúc Prompt
                  </label>
                  <select
                    value={configVideoMKT.activePromptId}
                    onChange={(e) =>
                      setConfigVideoMKT({
                        ...configVideoMKT,
                        activePromptId: e.target.value,
                      })
                    }
                    className="mt-1 bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    {allPrompts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddNewPrompt}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all"
                >
                  + Tạo bộ mới
                </button>
              </div>

              {currentPrompt.isDefault && (
                <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-600 font-medium">
                  ⚠️ Đây là mẫu hệ thống, bạn không thể chỉnh sửa. Hãy "Tạo bộ
                  mới" nếu muốn tùy chỉnh.
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/50 transition-colors">
                  {/* Phần text bên trái */}
                  <div
                    className="flex flex-col cursor-pointer"
                    onClick={() =>
                      setConfigVideoMKT({
                        ...configVideoMKT,
                        isUseVoice: !configVideoMKT.isUseVoice,
                      })
                    }
                  >
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">
                      Video Có Giọng Review
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                      Bật/Tắt lồng tiếng AI tự động
                    </span>
                  </div>

                  {/* Nút gạt bên phải */}
                  <button
                    onClick={() =>
                      setConfigVideoMKT({
                        ...configVideoMKT,
                        isUseVoice: !configVideoMKT.isUseVoice,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                      configVideoMKT.isUseVoice
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        configVideoMKT.isUseVoice
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {[
                  { id: "prompt_review", label: "Cấu trúc Prompt Review" },
                  { id: "prompt_image", label: "Cấu hình Prompt (Ảnh)" },
                  { id: "prompt_video", label: "Cấu hình Prompt (Video)" },
                ].map((item) => (
                  <div key={item.id} className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase">
                      {item.label}
                    </label>
                    <textarea
                      readOnly={currentPrompt.isDefault}
                      value={
                        currentPrompt[item.id as keyof PromptSet] as string
                      }
                      onChange={(e) =>
                        updateCurrentPrompt(
                          item.id as keyof PromptSet,
                          e.target.value,
                        )
                      }
                      className={`custom-scrollbar w-full border rounded-xl p-4 text-sm outline-none transition-all h-32 resize-none ${currentPrompt.isDefault ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-600"}`}
                    />
                  </div>
                ))}
              </div>
            </div>
         </section>
         
          {/* PHẦN CHỌN NHÂN VẬT AI */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            {/* Header & Toggle */}
            <div className="flex items-center justify-between border-l-4 border-emerald-500 pl-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-emerald-500" />
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  Nhân vật AI đại diện
                </h4>
              </div>

              {/* Nút Gạt (Toggle) */}
              <button
                onClick={() =>
                  setConfigVideoMKT({
                    ...configVideoMKT,
                    isUseCharacter: !configVideoMKT.isUseCharacter,
                  })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  configVideoMKT.isUseCharacter ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    configVideoMKT.isUseCharacter ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Khung nội dung: Chỉ hiện khi isUseCharacter === true */}
            <div
              className={`transition-all duration-300 origin-top overflow-hidden ${
                configVideoMKT.isUseCharacter
                  ? "opacity-100 scale-y-100 max-h-125"
                  : "opacity-0 scale-y-0 max-h-0 pointer-events-none"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2">
                
                {/* Bảng chọn Tên - ID */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase">
                    Chọn nhân vật (Tên - ID)
                  </label>
                  <select
                    value={configVideoMKT.characterSelected?.id || ""}
                    onChange={(e) => {
                      const charId = e.target.value;
                      const charData = characterList.find(c => c.id === charId) || null;
                      
                      setConfigVideoMKT({
                        ...configVideoMKT,
                        // Update đúng cấu trúc characterSelected trong config của ông
                        characterSelected: charData 
                      });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-all font-bold text-slate-700 appearance-none"
                  >
                    <option value="">-- Chưa chọn nhân vật --</option>
                    {characterList.map((char) => (
                      <option key={char.id} value={char.id}>
                        {char.name} - [{char.id}]
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 italic">
                    * Nhân vật này sẽ được dùng làm diễn viên đọc review.
                  </p>

                  {/* Hiện prompt nhân vật */}
                  {configVideoMKT.characterSelected && (
                    <div className="p-3 bg-white/50 rounded-lg border border-slate-200">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                        Prompt nhân vật:
                      </span>
                      <p className="text-[11px] text-slate-600 line-clamp-3 italic">
                        "{configVideoMKT.characterSelected.prompt}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Khung Preview Ảnh */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full aspect-square max-w-[180px] bg-white rounded-xl border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center relative group shadow-sm">
                    {configVideoMKT.characterSelected && configVideoMKT.characterSelected.imagePath ? (
                      <img
                        src={`box-media://${configVideoMKT.characterSelected.imagePath}`}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-300">
                        <User2 size={40} strokeWidth={1} />
                        <span className="text-[10px] font-bold uppercase mt-2">
                          No Preview
                        </span>
                      </div>
                    )}

                    {configVideoMKT.characterSelected && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white py-1 text-[10px] text-center font-bold">
                        {configVideoMKT.characterSelected.engine?.toUpperCase()} -{" "}
                        {configVideoMKT.characterSelected.model}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PHẦN 5: Cấu Hình riêng (Logo, Nhạc Nền) */}
          <section className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
              <User2 size={16} className="text-indigo-500" />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Cấu hình riêng
              </h4>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-700">
                    Chèn Logo vào video
                  </label>
                  <p className="text-[10px] text-slate-400 italic">
                    Tự động đóng dấu logo vào video
                  </p>
                </div>
                <button
                  onClick={() =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      isEnabledLogo: !configVideoMKT.isEnabledLogo,
                    })
                  }
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${configVideoMKT.isEnabledLogo ? "bg-indigo-500" : "bg-slate-300"}`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${configVideoMKT.isEnabledLogo ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <div
                className={`space-y-2 transition-all duration-300 ${configVideoMKT.isEnabledLogo ? "opacity-100 max-h-40" : "opacity-40 pointer-events-none max-h-0 overflow-hidden"}`}
              >
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Đường dẫn file Logo (.png)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={configVideoMKT.logoPath || ""}
                    placeholder="Chưa chọn file logo..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 outline-none"
                  />
                  <button
                    onClick={async () => {
                      /*@ts-ignore*/ const path =
                        await window.electronAPI.selectFile({
                          title: "Chọn Logo của bạn",
                          filters: [
                            {
                              name: "Images",
                              extensions: ["png", "jpg", "jpeg"],
                            },
                          ],
                        });
                      if (path)
                        setConfigVideoMKT({
                          ...configVideoMKT,
                          logoPath: path,
                        });
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    Chọn file
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-700">
                    Chèn nhạc nền vào video
                  </label>
                  <p className="text-[10px] text-slate-400 italic">
                    Thêm âm thanh hoặc nhạc nền cho video
                  </p>
                </div>
                <button
                  onClick={() =>
                    setConfigVideoMKT({
                      ...configVideoMKT,
                      isEnabledMusic: !configVideoMKT.isEnabledMusic,
                    })
                  }
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${configVideoMKT.isEnabledMusic ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${configVideoMKT.isEnabledMusic ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <div
                className={`space-y-2 transition-all duration-300 ${configVideoMKT.isEnabledMusic ? "opacity-100 max-h-40" : "opacity-40 pointer-events-none max-h-0 overflow-hidden"}`}
              >
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Đường dẫn file nhạc (.mp3, .wav)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={configVideoMKT.musicPath || ""}
                    placeholder="Chưa chọn file nhạc..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 outline-none"
                  />
                  <button
                    onClick={async () => {
                      /*@ts-ignore*/ const path =
                        await window.electronAPI.selectFile({
                          title: "Chọn Nhạc nền của bạn",
                          filters: [
                            {
                              name: "Audio",
                              extensions: ["mp3", "wav", "m4a", "aac"],
                            },
                          ],
                        });
                      if (path)
                        setConfigVideoMKT({
                          ...configVideoMKT,
                          musicPath: path,
                        });
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    Chọn file
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveAndClose}
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
};
