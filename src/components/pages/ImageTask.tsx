import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Play,
  Trash2,
  Copy,
  ImagePlus,
  X,
  Image as ImageIcon,
  Users,
  Monitor,
  Cpu,
  Check,
  Folder,
  Image,
  Pause,
} from "lucide-react";
import toast from "react-hot-toast";
import { AppSettings, ProfileInfo } from "../../types/Setting";

interface ImageTask {
  id: string;
  prompt: string;
  inputImagePath: string | null;
  resultImagePath: string | null;
  log: string;
  status: "idle" | "processing" | "success" | "error";
}

export const ImageGenerationPage = () => {
  const [tasks, setTasks] = useState<ImageTask[]>(() => {
    const savedTasks = localStorage.getItem("ai_image_tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // --- CẤU HÌNH CHẠY ---
  const [runConfig, setRunConfig] = useState(() => {
    const savedConfig = localStorage.getItem("ai_image_config");
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          selectedProfiles: [] as string[],
          aspectRatio: "IMAGE_ASPECT_RATIO_LANDSCAPE",
          threads: 1,
          output_folder: "C:\\Users\\Admin\\Desktop\\ANHAI",
        };
  });

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [generalSettings, setGeneralSettings] = useState<AppSettings | null>(
    null,
  );
  const [runningTasks, setRunningTasks] = useState<boolean>(false);

  // Lấy dữ liệu Settings chung khi mở Modal
  useEffect(() => {
    const saved = localStorage.getItem("minmin_app_settings");
    if (saved) {
      setGeneralSettings(JSON.parse(saved));
    }
  }, []);
  useEffect(() => {
    // Lắng nghe sự kiện từ Backend "bắn" lên
    //@ts-ignore
    const removeListener = window.electronAPI.onTaskImageLog((logData: any) => {
      console.log("Nhận log realtime:", logData);

      // Cập nhật vào mảng logs để hiển thị lên màn hình
      setTasks((prev) =>
        prev.map((task) =>
          task.id === logData.taskId
            ? {
                ...task,
                status: logData?.status ?? task.status,
                log: logData?.message ?? task.log,
                resultImagePath:
                  logData?.data?.resultImagePath ?? task.resultImagePath,
              }
            : task,
        ),
      );
    });

    return () => removeListener(); // Cleanup khi đóng component
  }, []);
  // Giả sử đây là danh sách profile ông quét được từ thư mục grok_profiles
  const handleRunGenImage = async () => {
    try {
      setRunningTasks(true);
      toast.success(
        `Đang khởi chạy với ${runConfig.selectedProfiles.length} tài khoản...`,
      );

      //@ts-ignore
      const result = await window.electronAPI.runTaskAutoImage({
        ...runConfig,
        tasks,
        gpm_api_key: generalSettings?.gpm_api_key,
      });
      if (result?.message){
        if (result?.success){
        toast.success(result?.message);

        }else{
        toast.error(result?.message);

        }
      }
      
      setRunningTasks(false);
      if (result?.success){
        toast.success("Tác vụ đã hoàn tất hoặc được dừng an toàn!");
      }
    } catch (error:any) {
      setRunningTasks(false);
      toast.error(error?.message ?? "Lỗi KXD")
    }
  };
  const handleStopGenImage = async () => {
    toast("Đang dừng tác vụ");
    //@ts-ignore
    await window.electronAPI.stopTaskAutoImage();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("ai_image_tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const savedConfig = localStorage.getItem("ai_image_config");
    if (savedConfig) setRunConfig(JSON.parse(savedConfig));
  }, []);

  useEffect(() => {
    // Lưu thẳng tay, kể cả mảng rỗng [] để khi user xóa hết task, lúc F5 nó vẫn sạch sẽ
    localStorage.setItem("ai_image_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("ai_image_config", JSON.stringify(runConfig));
  }, [runConfig]);

  const toggleProfile = (profileId: string) => {
    setRunConfig((prev: any) => {
      // Chỉ cần dùng includes để check xem ID có trong mảng chưa
      const isSelected = prev.selectedProfiles.includes(profileId);

      return {
        ...prev,
        selectedProfiles: isSelected
          ? prev.selectedProfiles.filter((id: any) => id !== profileId)
          : [...prev.selectedProfiles, profileId],
      };
    });
  };

  const handlePromptChange = (id: string, val: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, prompt: val } : t)));
  };

  // --- LOGIC TASK ---
  const handleAddTask = () => {
    setTasks([
      {
        id: `task_${Date.now()}`,
        prompt: "",
        inputImagePath: null,
        status: "idle",
        resultImagePath: null,
        log: "",
      },
      ...tasks,
    ]);
  };

  const handleDuplicateTask = (taskToCopy: ImageTask) => {
    const newTask: ImageTask = {
      ...taskToCopy,
      id: `task_${Date.now()}_${Math.random()}`,
      status: "idle",
      resultImagePath: null,
    };

    // Nhét newTask lên đầu tiên, sau đó rải toàn bộ các task cũ nối đuôi theo sau
    setTasks([newTask, ...tasks]);
    toast.success("Đã nhân bản Task lên đầu bảng!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTaskId) return;

    // ĐẶC SẢN ELECTRON: Lấy đường dẫn thật của file trên ổ cứng (VD: C:/Images/gai_xinh.jpg)
    const filePath = (file as any).path;

    setTasks(
      tasks.map((t) =>
        t.id === activeTaskId ? { ...t, inputImagePath: filePath } : t,
      ),
    );

    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveTaskId(null);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative font-sans">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* HEADER */}
      <div className="flex justify-between items-center px-8 py-5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
            <ImageIcon size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Tạo Ảnh AI Hàng Loạt
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Automation Engine
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAddTask}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-all shadow-sm"
          >
            <Plus size={16} /> Thêm Dòng
          </button>
          {runningTasks ? (
            <button
              className="flex items-center gap-2 px-8 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
              onClick={handleStopGenImage}
            >
              <Pause size={16} fill="currentColor" /> Dừng
            </button>
          ) : (
            <button
              className="flex items-center gap-2 px-8 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
              onClick={handleRunGenImage}
            >
              <Play size={16} fill="currentColor" /> Bắt Đầu
            </button>
          )}
        </div>
      </div>

      {/* SETTINGS BAR - MULTI SELECT PROFILE */}
      <div className="px-8 py-3 bg-white border-b border-slate-200 flex items-center gap-8 shadow-sm relative z-20">
        {/* MULTI-SELECT GROK PROFILES */}
        <div className="relative group">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
              <Users size={14} />
            </div>
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
                Grok Accounts
              </span>
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {runConfig.selectedProfiles.length === 0
                  ? "Chưa chọn tài khoản"
                  : `Đã chọn ${runConfig.selectedProfiles.length} Acc`}
                <span className="text-[10px] text-indigo-500">▼</span>
              </span>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showProfileDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileDropdown(false)}
              ></div>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 shadow-2xl rounded-xl z-20 p-2 overflow-hidden animate-in fade-in zoom-in duration-150">
                <div className="flex justify-between items-center px-2 py-1 mb-2 border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Danh sách Acc
                  </span>
                  <button
                    onClick={() =>
                      setRunConfig({
                        ...runConfig,
                        // Thêm cái ?? [] ở cuối để chống cháy khi generalSettings bị undefined
                        selectedProfiles:
                          generalSettings?.grok_profiles?.map(
                            (p: ProfileInfo) => p.id,
                          ) ?? [],
                      })
                    }
                    className="text-[10px] font-bold text-indigo-600 hover:underline"
                  >
                    Chọn hết
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {generalSettings &&
                    generalSettings.grok_profiles.map((p: ProfileInfo) => (
                      <div
                        key={p.id}
                        onClick={() => toggleProfile(p.id)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <span
                          className={`text-xs font-medium ${runConfig.selectedProfiles.includes(p.id) ? "text-indigo-600 font-bold" : "text-slate-600"}`}
                        >
                          {p.name}
                        </span>
                        {runConfig.selectedProfiles.includes(p.id) && (
                          <Check size={14} className="text-indigo-600" />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ASPECT RATIO */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-8">
          <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
            <Monitor size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
              Dạng Ảnh
            </span>
            <select
              value={runConfig.aspectRatio}
              onChange={(e) =>
                setRunConfig({ ...runConfig, aspectRatio: e.target.value })
              }
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="IMAGE_ASPECT_RATIO_LANDSCAPE">Ngang (16:9)</option>
              <option value="IMAGE_ASPECT_RATIO_PORTRAIT">Dọc (9:16)</option>
            </select>
          </div>
        </div>

        {/* THREADS */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-8">
          <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
            <Cpu size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
              Số Luồng
            </span>
            <input
              type="number"
              min={1}
              value={runConfig.threads}
              onChange={(e) =>
                setRunConfig({
                  ...runConfig,
                  threads: parseInt(e.target.value),
                })
              }
              className="w-12 bg-transparent text-xs font-bold text-slate-700 outline-none border-b border-transparent focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
        {/* FOLDER OUTPUT */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-8">
          <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
            <Folder size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
              Lưu tại
            </span>
            <div>
              <button
                onClick={async () => {
                  //@ts-ignore
                  const result = await window.electronAPI.selectFolder();
                  if (result)
                    setRunConfig({ ...runConfig, output_folder: result });
                }}
                className="p-1 mr-3 text-[10px] border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500"
              >
                Chọn folder
              </button>
              <input
                type="text"
                value={runConfig.output_folder}
                onChange={(e) =>
                  setRunConfig({ ...runConfig, output_folder: e.target.value })
                }
                className="w-100  bg-transparent text-xs font-bold text-slate-700 outline-none border-b border-transparent focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE GIAO DIỆN */}
      <div className="flex-1 overflow-y-auto p-8 z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-w-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-16 text-center tracking-widest">
                  #
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-40 tracking-widest">
                  Input Image
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Prompt Configuration
                </th>
                {/* <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-32 text-center tracking-widest">
                  Status
                </th> */}
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-32 text-center tracking-widest">
                  Log
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-28 text-center tracking-widest">
                  Actions
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase w-28 tracking-widest">
                  Result
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task, index) => (
                <tr
                  key={task.id}
                  className="group hover:bg-slate-50/20 transition-all"
                >
                  <td className="px-6 py-6 text-center text-xs font-bold text-slate-300 group-hover:text-indigo-400 transition-colors">
                    {index + 1}
                  </td>

                  <td className="px-6 py-6">
                    {task.inputImagePath ? (
                      <div className="relative w-24 aspect-square rounded-xl border border-slate-200 overflow-hidden shadow-sm group/img bg-slate-900">
                        {/* Dùng giao thức box-media:// để show ảnh từ ổ cứng */}
                        <img
                          src={`box-media://${task.inputImagePath}`}
                          className="w-full h-full object-contain"
                          alt="ref"
                        />

                        <button
                          onClick={() =>
                            setTasks(
                              tasks.map((t) =>
                                t.id === task.id
                                  ? { ...t, inputImagePath: null }
                                  : t,
                              ),
                            )
                          }
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X size={18} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveTaskId(task.id);
                          fileInputRef.current?.click();
                        }}
                        className="w-24 aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50 transition-all group/add"
                      >
                        <ImagePlus
                          size={24}
                          className="group-hover/add:scale-110 transition-transform"
                        />
                        <span className="text-[9px] font-black uppercase mt-1">
                          Ref Image
                        </span>
                      </button>
                    )}
                  </td>

                  <td className="px-6 py-6">
                    <textarea
                      value={task.prompt}
                      onChange={(e) =>
                        handlePromptChange(task.id, e.target.value)
                      }
                      placeholder="Gõ prompt tại đây... Ví dụ: {girl} mặc áo dài Việt Nam..."
                      className="w-full h-24 p-4 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all text-sm font-medium text-slate-700 resize-none"
                    />
                  </td>

                  {/* <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-slate-300 mb-2"></div>
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        {task.status}
                      </span>
                    </div>
                  </td> */}
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-black">
                        {task.log}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleDuplicateTask(task)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Nhân bản"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setTasks(tasks.filter((t) => t.id !== task.id))
                        }
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    {task.resultImagePath ? (
                      <div className="relative w-24 aspect-square rounded-xl border border-slate-200 overflow-hidden shadow-sm group/img bg-slate-900">
                        {/* Dùng giao thức box-media:// để show ảnh từ ổ cứng */}
                        <img
                          src={`box-media://${task.resultImagePath}`}
                          className="w-full h-full object-contain"
                          alt="ref"
                          onClick={() => setPreviewImage(task.resultImagePath)}
                        />
                      </div>
                    ) : (
                      <button
                        disabled
                        className="w-24 aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50 transition-all group/add"
                      >
                        <Image
                          size={24}
                          className="group-hover/add:scale-110 transition-transform"
                        />
                        <span className="text-[9px] font-black uppercase mt-1">
                          Chưa tạo
                        </span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* POPUP PHÓNG TO ẢNH KẾT QUẢ */}
      {previewImage && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)} // Bấm ra ngoài nền đen để đóng
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={`box-media://${previewImage}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              alt="Enlarged result"
            />
            {/* Nút X tắt popup */}
            <button
              className="absolute -top-4 -right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation(); // Ngăn không cho sự kiện click lan ra ngoài
                setPreviewImage(null);
              }}
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
