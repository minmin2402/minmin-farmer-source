import { useEffect, useState } from "react";
import {
  Plus,
  Play,
  BookOpenText,
  Settings2,
  FileSpreadsheet,
  Link2,
  Trash2,
  ChevronDown,
  Pause,
  Box,
  Table,
} from "lucide-react";
import { ConfigModalVideoMKT } from "../modals/ConfigModalVideoMKT";
import { STORAGE_KEY } from "../../types/KeyLocalStorage";
import { VideoTask } from "../../types/VideoTask";
import { ResultTaskVideoModal } from "../modals/ResultTaskVideoModal";
import { HeaderColoredButton, ExcelImportVideoMKT, HeaderActionButton } from "../tools/Button";
import toast from "react-hot-toast";

interface ConfigVideoMKT {
  output_video: string;
  save_shopid_productid: boolean;
  thread: number;
  delay_between: number;
  api_gpm: string;
  profiles_aff: string[];
  method_load_page:
    | "load"
    | "domcontentloaded"
    | "networkidle0"
    | "networkidle2";
  time_loading_page: number;
  time_wait_getdata: number;
  profiles_veo3: string[];
  profiles_grok: string[];
  prompt_video: string;
  prompt_image: string;
  prompt_review: string | null;
  apikey_gemini: string[];
  model_ai_img: "banana-pro" | "nano-banana-2";
}

export const VideoMarketingPage = () => {
  // 1. Quản lý danh sách Task
  const [tasks, setTasks] = useState<VideoTask[]>(() => {
    const savedTasks = localStorage.getItem("minmin_videoMKT_tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [selectedTaskResult, setSelectedTaskResult] =
    useState<VideoTask | null>(null);

  const [configVideoMKT, setConfigVideoMKT] = useState<ConfigVideoMKT>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Lỗi parse config:", e);
      }
    }
    // Nếu không có hoặc lỗi thì dùng mặc định
    return {
      output_video: "D:\\Output\\Videos",
      save_shopid_productid: true,
      thread: 1,
      delay_between: 3,
      api_gpm: "http://localhost:9495",
      profiles_aff: [],
      method_load_page: "domcontentloaded",
      time_loading_page: 60000,
      time_wait_getdata: 20000,
      profiles_veo3: [],
      profiles_grok: [],
      prompt_review: `- Các prompt đầu: Giới thiệu sản phẩm. Tạo hook 3s đầu tiên thật hấp dẫn
- Các prompt giữa: Thể hiện tính năng nổi bật của sản phẩm.
- Các prompt cuối: Kêu gọi hành động (CTA).`,
      apikey_gemini: [],
      model_ai_img: "banana-pro",
    };
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  async function handleRunSelectedTaskAuto(task: VideoTask | null) {
    try {
      //@ts-ignore
      const result = await window.electronAPI.runTaskAutoVideo({
        tasks: task ? [task] : tasks.filter((t) => selectedIds.includes(t.id)),
        configVideoMKT,
      });
      if (!result.success) {
        // 🚩 Toast hiện ra message lỗi ngay lập tức!
        toast.error(result.message || "Hệ thống hụt hơi rồi MinMin ơi!");
      } else {
        toast.success("Vít ga thành công! 🚀");
      }
    } catch (error) {
      toast.error("Lỗi không xác định xảy ra");
    }
  }

  async function handlePauseSelectedTaskAuto(task: VideoTask | null) {
    try {
      //@ts-ignore
      const result = await window.electronAPI.stopTaskAutoVideo(
        task ? [task.id] : selectedIds,
      );
    } catch (error) {}
  }

  async function handleOpenResultTask(task: VideoTask) {
    try {
      setSelectedTaskResult(task);
      setIsResultModalOpen(true);
    } catch (error) {}
  }

  useEffect(() => {
    localStorage.setItem("minmin_videoMKT_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Lắng nghe sự kiện từ Backend "bắn" lên
    //@ts-ignore
    const removeListener = window.electronAPI.onTaskLog((logData: any) => {
      console.log("Nhận log realtime:", logData);

      // Cập nhật vào mảng logs để hiển thị lên màn hình
      setTasks((prev) =>
        prev.map((task) =>
          task.id === logData.taskId
            ? {
                ...task,
                log: logData?.message ?? task.log,
                status: logData.status,
                productName: logData?.data?.productTitle ?? task.productName,
                productDesc: logData?.data?.productDesc ?? task.productDesc,
                productPathImg: logData?.data?.productPathImage
                  ? `${configVideoMKT.output_video}/${logData?.data?.productPathImage}`
                  : task.productPathImg,
                prompt: logData?.data?.prompt ?? task.prompt,
                aiImagePath: logData?.data?.imageAIPath ?? task.aiImagePath,
                finalVideoPath:
                  logData?.data?.videoAIPath ?? task.finalVideoPath,
                resultVideoCount:
                  logData?.data?.resultVideoCount ?? task.resultVideoCount,
              }
            : task,
        ),
      );
    });

    return () => removeListener(); // Cleanup khi đóng component
  }, []);

  // Thêm hàng mới (Giống AutoShopee)
  const handleAddTask = () => {
    const newTask: VideoTask = {
      id: Date.now(), // Dùng timestamp làm ID duy nhất
      productUrl: "",
      productName: "-",
      productDesc: "-",
      productPathImg: "",
      mode: "TT + Prompt + Video + Ảnh AI",
      outputCount: 2,
      status: "none",
      log: "",
      aiImagePath: "",
      finalVideoPath: "",
      prompt: "",
      resultVideoCount: null,
    };
    setTasks([newTask, ...tasks]); // Đẩy lên đầu bảng cho dễ thấy
  };
  const handleImport = (newTasks: VideoTask[]) => {
    // Gộp task cũ và task mới từ Excel
    setTasks((prev) => [...prev, ...newTasks]);
  };

  // Chọn/Bỏ chọn từng hàng
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Chọn tất cả / Bỏ chọn tất cả
  const toggleSelectAll = () => {
    if (selectedIds.length === tasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tasks.map((t) => t.id));
    }
  };

  // Xóa các hàng đã chọn
  const deleteSelected = () => {
    if (
      window.confirm(
        `MinMin chắc chắn muốn xóa ${selectedIds.length} hàng này chứ?`,
      )
    ) {
      setTasks(tasks.filter((t) => !selectedIds.includes(t.id)));
      setSelectedIds([]); // Xóa xong reset mảng chọn
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] p-6 text-slate-700 font-sans">
      <ConfigModalVideoMKT
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        configVideoMKT={configVideoMKT}
        setConfigVideoMKT={setConfigVideoMKT}
      />
      <ResultTaskVideoModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        task={selectedTaskResult ?? null}
      />
      {/* TOOLBAR NÚT BẤM */}
      <div className="bg-white p-4 rounded-t-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-bold px-3 py-1.5 border border-gray-200 rounded-lg bg-slate-50 text-slate-500 uppercase tracking-wider">
            Tổng: {tasks.length}
          </div>

          {/* 🗑️ NÚT XÓA: Chỉ hiện khi có ít nhất 1 hàng được chọn */}
          {selectedIds.length > 0 && (
            <button
              onClick={deleteSelected}
              className="flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all animate-in fade-in zoom-in duration-200"
            >
              <Trash2 size={14} /> Xóa đã chọn ({selectedIds.length})
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <HeaderActionButton
            onClick={() => {
              // Sử dụng window.electron để mở link ra trình duyệt ngoài
              //@ts-ignore
              window.electronAPI.openExternal(
                "https://docs.google.com/spreadsheets/d/1wtla0qrmZ1TjgGKCH2FpZuPdTXlxr7dUqfek_ZY0TZc/edit?gid=0#gid=0",
              );
            }}
            icon={<Table />}
            label="Mẫu Excel"
          />

          <HeaderActionButton icon={<BookOpenText />} label="Hướng dẫn" />

          <HeaderActionButton
            onClick={() => setIsConfigOpen(true)}
            icon={<Settings2 />}
            label="Cấu hình"
          />

          <button
            onClick={() => handleRunSelectedTaskAuto(null)}
            className="bg-[#0eb27e] text-white flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 shadow-sm"
          >
            <Play size={14} className="fill-white" /> Chạy
          </button>

          <ExcelImportVideoMKT onImportSuccess={handleImport} />
          <HeaderColoredButton
            icon={<FileSpreadsheet />}
            label="Xuất Excel"
            bgColor="#e87717"
          />

          {/* ➕ NÚT THÊM: Kích nổ thêm hàng mới */}
          <button
            onClick={handleAddTask}
            className="bg-blue-600 text-white flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <Plus size={16} /> Thêm
          </button>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-b-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#edf1f5] border-b border-gray-100">
            <tr>
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                  checked={
                    tasks.length > 0 && selectedIds.length === tasks.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-16 text-center">
                STT
              </th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Link Sản Phẩm
              </th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Tên SP
              </th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Chế độ xử lý
              </th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                Số Video Output
              </th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                TB Video Tạo Video
              </th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                Thông Báo
              </th>
              <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right pr-8">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {tasks.map((task, index) => (
              <tr
                key={task.id}
                className={`transition-colors ${selectedIds.includes(task.id) ? "bg-blue-50/30" : "hover:bg-slate-50/50"}`}
              >
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                    checked={selectedIds.includes(task.id)}
                    onChange={() => toggleSelect(task.id)}
                  />
                </td>
                <td className="p-4 text-center text-xs font-bold text-black">
                  {index + 1}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-gray-100 focus-within:border-blue-300 focus-within:bg-white transition-all">
                    <Link2 size={14} className="text-slate-300" />
                    <input
                      type="text"
                      placeholder="Shopee, Tiktok Shop URL..."
                      className="w-full bg-transparent outline-none text-xs text-black0 placeholder:text-slate-300"
                      value={task.productUrl}
                      onChange={(e) => {
                        const newTasks = [...tasks];
                        newTasks[index].productUrl = e.target.value;
                        setTasks(newTasks);
                      }}
                    />
                  </div>
                </td>
                <td className="p-4 text-center text-xs font-bold text-black max-w-50">
                  <div className="truncate" title={task.productName}>
                    {task.productName}
                  </div>
                </td>
                <td className="p-4">
                  <div className="relative group">
                    <select
                      value={task.mode}
                      onChange={(e) => {
                        const newTasks = [...tasks];
                        newTasks[index].mode =
                          e.target.value == "TT + Prompt + Video + Ảnh AI"
                            ? "TT + Prompt + Video + Ảnh AI"
                            : "Chỉ lấy thông tin sản phẩm";
                        setTasks(newTasks);
                      }}
                      className="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] font-medium text-black outline-none hover:border-blue-200 cursor-pointer"
                    >
                      <option>Chỉ lấy thông tin sản phẩm</option>
                      {/* <option>Thông tin + Prompt</option>
                      <option>Thông tin + Prompt + Ảnh AI</option> */}
                      <option>TT + Prompt + Video + Ảnh AI</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-2 top-2.5 text-black pointer-events-none"
                    />
                  </div>
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    value={task.outputCount}
                    min="1"
                    max="3"
                    onChange={(e) => {
                      const newTasks = [...tasks];
                      newTasks[index].outputCount = Number(e.target.value);
                      setTasks(newTasks);
                    }}
                    className="w-16 p-1 text-center font-mono text-xs font-bold text-blue-600  focus:outline-none "
                  />
                </td>
                <td className="p-4 text-center font-mono text-xs font-bold text-blue-600">
                  {!task.resultVideoCount && task.resultVideoCount !== 0
                    ? "..."
                    : `${task.resultVideoCount}/${task.outputCount}`}
                </td>
                <td className="p-4 text-center font-mono text-xs font-bold text-blue-600">
                  {task.log}
                </td>

                <td className="p-4 text-right pr-8">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                    <div>
                      <Box
                        onClick={() => handleOpenResultTask(task)}
                        size={16}
                      />
                    </div>
                  </button>
                  {(task.status == "none" ||
                    task.status == "error" ||
                    task.status == "success") && (
                    <>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                        <div>
                          <Play
                            onClick={() => handleRunSelectedTaskAuto(task)}
                            size={16}
                          />
                        </div>
                      </button>
                    </>
                  )}
                  {task.status == "processing" && (
                    <button
                      onClick={() => handlePauseSelectedTaskAuto(task)}
                      className="p-2 text-red-500 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Pause size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="p-20 text-center text-slate-300 flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <Plus size={32} />
            </div>
            <p className="text-sm font-medium">
              Bấm "Thêm" để tạo task mới nhé MinMin!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub Components ---

