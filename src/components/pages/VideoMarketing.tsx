import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
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
  Link,
  X,
} from "lucide-react";
import { ConfigModalVideoMKT } from "../modals/ConfigModalVideoMKT";
import { STORAGE_KEY } from "../../types/KeyLocalStorage";
import { PromptSet, VideoTask } from "../../types/VideoTask";
import { ResultTaskVideoModal } from "../modals/ResultTaskVideoModal";
import {
  HeaderColoredButton,
  ExcelImportVideoMKT,
  HeaderActionButton,
} from "../tools/Button";
import toast from "react-hot-toast";
import { DEFAULT_PROMPTS, prompt_img, prompt_video } from "../../const";

interface ConfigVideoMKT {
  output_video: string;
  save_shopid_productid: boolean;
  thread: number;
  delay_between: number;
  api_gpm: string;
  profiles_aff: string[];
  useProfileAff: boolean;
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
  isUseVbee: boolean;
  voice_code:
    | "s_hochiminh_male_nguoikechuyenbali2_advertise_vc"
    | "n_hanoi_male_quangquangcao_advertise_vc"
    | "s_cantho_female_xanxan_advertise_vc"
    | "n_hanoi_female_quangcao02_advertise_vc";
  vbee_app_id: string;
  vbee_app_token: string;
  speed_voice: 1;
  isEnabledLogo: boolean;
  logoPath: string;
  isEnabledMusic: boolean;
  musicPath: string;
  omo_api_key: string;
  activePromptId: string;
  customPrompts: PromptSet[];
  isUseVoice:boolean;
  characterSelected:any | null;
  isUseCharacter:boolean;
}
type FilterStatus = VideoTask["status"] | "all";
let isCleanedUp = false;
export const VideoMarketingPage = () => {
  const [tasks, setTasks] = useState<VideoTask[]>(() => {
    const savedTasks = localStorage.getItem("minmin_videoMKT_tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "all") return true;
    return task.status === filterStatus;
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  useEffect(() => {
    setSelectedIds([]);
  }, [filterStatus]);

  const [selectedTaskResult, setSelectedTaskResult] =
    useState<VideoTask | null>(null);
  const initialDefaultConfig: ConfigVideoMKT = {
    output_video: "",
    save_shopid_productid: true,
    thread: 1,
    delay_between: 3,
    api_gpm: "http://localhost:9495",
    profiles_aff: [],
    useProfileAff: false,
    method_load_page: "domcontentloaded",
    time_loading_page: 60000,
    time_wait_getdata: 20000,
    profiles_veo3: [],
    profiles_grok: [],
    prompt_review: ``,
    apikey_gemini: [],
    model_ai_img: "banana-pro",
    prompt_image: prompt_img,
    prompt_video: prompt_video,
    voice_code: "s_cantho_female_xanxan_advertise_vc",
    vbee_app_id: "",
    vbee_app_token: "",
    speed_voice: 1,
    isUseVbee: false,
    isEnabledLogo: false,
    logoPath: "",
    isEnabledMusic: false,
    musicPath: "",
    omo_api_key: "",
    activePromptId: "default-mkt",
    customPrompts: [],
    isUseVoice:true,
    characterSelected: null,
    isUseCharacter: false
  };
  const [configVideoMKT, setConfigVideoMKT] = useState<ConfigVideoMKT>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // TRỘN DỮ LIỆU: Ưu tiên cái đã lưu, nhưng nếu thiếu thì lấy từ mặc định
        return {
          ...initialDefaultConfig,
          ...parsed,
        };
      } catch (e) {
        console.error("Lỗi parse config:", e);
      }
    }
    return initialDefaultConfig;
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loadingPinVideo, setLoadingPinVideo] = useState(false);
  const [importLinksText, setImportLinksText] = useState("");

  const handleImportLinksSubmit = () => {
    // 1. Tách từng dòng và xóa khoảng trắng 2 đầu, lọc bỏ các dòng rỗng
    const rawLinks = importLinksText.split("\n");
    const validLinks = rawLinks
      .map((link) => link.trim())
      .filter((link) => link !== "");

    if (validLinks.length === 0) {
      alert("MinMin ơi, chưa có link nào hợp lệ cả!");
      return;
    }

    // 2. Map các link này thành các Task mới
    const newTasks: VideoTask[] = validLinks.map((link, index) => {
      return {
        id: Date.now() + index, // Dùng timestamp làm ID duy nhất
        productUrl: link,
        productName: "",
        productDesc: "",
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
    });

    // 3. Nối mảng task mới vào danh sách task hiện tại
    setTasks((prev) => [...newTasks, ...prev]);

    // 4. Dọn dẹp: Reset ô nhập và đóng Modal
    setImportLinksText("");
    setIsImportModalOpen(false);
    console.log(`✅ Đã import thành công ${newTasks.length} link vào mảng!`);
  };
  const handleBulkChangeMode = (newMode: any) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        // Nếu task nằm trong danh sách được chọn, thì update mode mới
        selectedIds.includes(task.id) ? { ...task, mode: newMode } : task,
      ),
    );
  };
  async function handleRunSelectedTaskAuto(task: VideoTask | null) {
    try {
      const allPrompts = [...DEFAULT_PROMPTS, ...configVideoMKT.customPrompts];
      const currentPrompt =
        allPrompts.find((p) => p.id === configVideoMKT.activePromptId) ||
        DEFAULT_PROMPTS[0];

      // 🚀 BƯỚC 1: Lấy "Vũ khí" (Settings chung) từ kho tổng LocalStorage
      const globalSettingsRaw = localStorage.getItem("minmin_app_settings");
      const globalSettings = globalSettingsRaw
        ? JSON.parse(globalSettingsRaw)
        : null;

      if (!globalSettings?.gpm_api_key) {
        return toast.error(
          "Khoan đã! Bạn chưa cài GPM API trong mục Settings.",
        );
      }

      // 🚀 BƯỚC 2: Trộn đạn (Merge Config)
      // Đắp đè các key dùng chung (GPM, OMO) vào config để gửi xuống Runner
      console.log(configVideoMKT.isUseCharacter)
      console.log(configVideoMKT.characterSelected)

      const finalConfig = {
        ...configVideoMKT,
        ...currentPrompt,
        api_gpm: globalSettings.gpm_api_key, // Nạp API GPM mới nhất
        omo_api_key: globalSettings.omo_api_key, // Nạp API OmoCaptcha mới nhất

        profiles_veo3: ["08a83e2d-5ad4-4390-ade0-9bb97ce95717"],
        engine: "grok",
      };

      //@ts-ignore
      const result = await window.electronAPI.runTaskAutoVideo({
        tasks: task ? [task] : tasks.filter((t) => selectedIds.includes(t.id)),
        configVideoMKT: finalConfig, // Truyền bản thể đã hợp nhất
      });

      if (!result.success) {
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
  const handleExportExcel = () => {
    // 1. Lọc danh sách task dựa trên selectedIds
    const selectedTasks = tasks.filter((task) => selectedIds.includes(task.id));

    // Kiểm tra nếu chưa chọn task nào
    if (selectedTasks.length === 0) {
      alert("Vui lòng chọn ít nhất một task để xuất Excel!");
      return;
    }

    // 2. Chuẩn bị dữ liệu từ danh sách đã lọc
    const dataToExport = selectedTasks.map((task, index) => ({
      STT: index + 1,
      "Tên Sản Phẩm": task.productName,
      "Link SP": task.productUrl,
      "Trạng Thái": task.status,
      "Đường Dẫn Video": task.finalVideoPath || "N/A",
    }));

    // 3. Tạo Workbook và Worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Thêm một chút style cho cột rộng ra nhìn cho chuyên nghiệp
    const wscols = [
      { wch: 5 }, // STT
      { wch: 40 }, // Tên Sản Phẩm
      { wch: 50 }, // Link Shopee
      { wch: 15 }, // Trạng Thái
      { wch: 80 }, // Đường Dẫn Video
    ];
    worksheet["!cols"] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks_Duoc_Chon");

    // 4. Xuất file
    const fileName = `MinMin_Selected_Export_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  useEffect(() => {
    if (!isCleanedUp) {
      setTasks((prevTasks) => {
        const cleaned = prevTasks.map((task) => {
          if (task.status === "processing") {
            return {
              ...task,
              status: "none",
              log: "Đã dừng do đóng ứng dụng đột ngột",
            } as VideoTask;
          }
          return task;
        });

        // Quan trọng: Lưu ngay vào localStorage sau khi dọn
        localStorage.setItem("minmin_videoMKT_tasks", JSON.stringify(cleaned));
        return cleaned;
      });
      isCleanedUp = true;
    }
  }, []); // Array rỗng để chỉ chạy khi Mount lần đầu
  useEffect(() => {
    if (isCleanedUp) {
      const handler = setTimeout(() => {
        // 🚀 CHIÊU VÍT GA: Loại bỏ trường 'log' và 'status' (nếu muốn) trước khi lưu
        const cleanTasksToSave = tasks.map(({ log, ...rest }) => ({
          ...rest,
          // Nếu muốn khi mở lại app status vẫn là none thay vì processing
          status: rest.status === "processing" ? "none" : rest.status,
          log: "", // Để trống log khi lưu xuống đĩa
        }));

        localStorage.setItem(
          "minmin_videoMKT_tasks",
          JSON.stringify(cleanTasksToSave),
        );
        console.log("💾 Đã lưu tasks vào Storage (Đã lọc log)");
      }, 2000); // 2 giây sau khi không có thay đổi mới thực sự ghi vào ổ cứng

      return () => clearTimeout(handler);
    }
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
                  ? `${logData?.data?.productPathImage}`
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
  // 🚀 CHIÊU "NGƯỜI QUÉT RÁC THẦM LẶNG": Tự động dọn profile ma ngay khi load trang
  useEffect(() => {
    const autoCleanGhostProfiles = () => {
      const globalSettingsRaw = localStorage.getItem("minmin_app_settings");
      if (!globalSettingsRaw) return;

      const globalSettings = JSON.parse(globalSettingsRaw);

      const validGrokIds =
        globalSettings.grok_profiles?.map((p: any) => p.id) || [];
      const validVeoIds =
        globalSettings.veo_profiles?.map((p: any) => p.id) || [];
      const validGeminiKeys = globalSettings.gemini_api_keys || [];

      // Dùng callback trong setConfigVideoMKT để luôn lấy state mới nhất
      setConfigVideoMKT((prevConfig) => {
        const cleanProfilesGrok = (prevConfig.profiles_grok || []).filter(
          (id: string) => validGrokIds.includes(id),
        );
        const cleanProfilesVeo = (prevConfig.profiles_veo3 || []).filter(
          (id: string) => validVeoIds.includes(id),
        );
        const cleanGeminiKeys = (prevConfig.apikey_gemini || []).filter(
          (key: string) => validGeminiKeys.includes(key),
        );

        // Kiểm tra xem độ dài mảng có bị thay đổi (tức là có rác bị vứt đi) hay không
        if (
          cleanProfilesGrok.length !==
            (prevConfig.profiles_grok || []).length ||
          cleanProfilesVeo.length !== (prevConfig.profiles_veo3 || []).length ||
          cleanGeminiKeys.length !== (prevConfig.apikey_gemini || []).length
        ) {
          const newConfig = {
            ...prevConfig,
            profiles_grok: cleanProfilesGrok,
            profiles_veo3: cleanProfilesVeo,
            apikey_gemini: cleanGeminiKeys,
          };
          // Lưu ngay xuống LocalStorage để đồng bộ vĩnh viễn
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
          console.log(
            "🧹 [Auto-Clean] Đã dọn sạch profile ma ngay lúc render!",
          );
          return newConfig;
        }

        // Nếu không có rác, trả về nguyên bản (không trigger re-render thừa)
        return prevConfig;
      });
    };

    // Chạy 1 lần ngay khi vào tab Video MKT
    autoCleanGhostProfiles();

    // 💡 TÙY CHỌN PRO: Nếu khách mở 2 cửa sổ/tab, bắt sự kiện khi họ click lại vào cửa sổ này
    window.addEventListener("focus", autoCleanGhostProfiles);
    return () => window.removeEventListener("focus", autoCleanGhostProfiles);
  }, []);
  // Thêm hàng mới (Giống AutoShopee)
  const handleAddTask = () => {
    const newTask: VideoTask = {
      id: Date.now(), // Dùng timestamp làm ID duy nhất
      productUrl: "",
      productName: "",
      productDesc: "",
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

  // Chọn tất cả / Bỏ chọn tất cả dựa trên danh sách đã lọc
  const toggleSelectAll = () => {
    // Nếu số lượng đang chọn bằng với số lượng task sau khi lọc thì bỏ chọn hết
    if (
      selectedIds.length === filteredTasks.length &&
      filteredTasks.length > 0
    ) {
      setSelectedIds([]);
    } else {
      // Ngược lại, chỉ lấy danh sách ID của những task đang hiển thị trong bộ lọc
      setSelectedIds(filteredTasks.map((t) => t.id));
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

  const handleDuplicateTasks = () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một task để nhân bản!");
      return;
    }

    // 1. Lọc ra dữ liệu các task đang chọn và tạo Object mới
    const clonedTasks = tasks
      .filter((task) => selectedIds.includes(task.id))
      .map((task) => ({
        ...task, // Copy toàn bộ thuộc tính cũ
        id: Date.now() + Math.random(), // QUAN TRỌNG: Tạo ID mới để không bị trùng key
        status: "none" as "error" | "processing" | "success" | "none", // Reset trạng thái về sẵn sàng (nếu cần)
        log: "Bản sao mới", // Thông báo log mới
        // Giữ nguyên các trường bạn yêu cầu:
        productUrl: task.productUrl,
        productName: task.productName,
        productPathImg: task.productPathImg,
        productDesc: task.productDesc,
        mode: task.mode,
        outputCount: task.outputCount,
        resultVideoCount: task.resultVideoCount,
      }));

    // 2. Cập nhật vào danh sách tasks hiện tại
    setTasks((prevTasks) => [...clonedTasks, ...prevTasks]);

    setSelectedIds([]);
  };

  const handleSaveVideo = async () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một task để save video!");
      return;
    }

    // 1. Lọc ra dữ liệu các task đang chọn và tạo Object mới
    const taskVideoPaths = tasks
      .filter((task) => selectedIds.includes(task.id) && task.finalVideoPath)
      .map((task) => task.finalVideoPath);

    toast.success(
      `Bắt đầu lưu ${taskVideoPaths.length}/${selectedIds.length} đã chọn`,
    );
    setLoadingPinVideo(true);
    //@ts-ignore
    const result = await window.electronAPI.pinVideo(
      taskVideoPaths,
      JSON.parse(localStorage.getItem("minmin_app_settings") || "")
        .path_storage_video,
    );
    if (result?.success) {
      toast.success(`Lưu thành công ${result.countSuccess} video`);
    } else {
      toast.error(`Lưu thất bại lỗi: ${result?.message ?? ""}`);
    }
    setLoadingPinVideo(false);
  };

  const handleUpdateTask = (updatedTask: VideoTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
    // Cập nhật luôn task đang chọn để Modal hiển thị đúng dữ liệu mới
    setSelectedTaskResult(updatedTask);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f9fa] p-6 text-slate-700 font-sans">
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
        onUpdateTask={handleUpdateTask}
      />
      {/* TOOLBAR NÚT BẤM */}
      <div className="flex-none bg-white p-4 rounded-t-xl border border-gray-100 shadow-sm flex flex-col items-start justify-start">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center gap-2 mr-2">
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
          <div className="flex items-center gap-2 p-1 mr-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-semibold text-gray-600">
              Đổi mode {selectedIds.length} task:
            </span>

            <div className="relative">
              <select
                // Chúng ta không dùng value cố định vì đây là lệnh thực thi
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkChangeMode(e.target.value);
                  }
                }}
                className="appearance-none bg-blue-50 border border-blue-200 rounded-md px-3 py-1 text-xs font-bold text-blue-700 outline-none hover:bg-blue-100 cursor-pointer"
              >
                <option value="" disabled>
                  -- Chọn chế độ --
                </option>
                <option value="Chỉ lấy thông tin sản phẩm">
                  Chỉ lấy thông tin sản phẩm
                </option>
                <option value="Prompt + Ảnh AI + Video">
                  Prompt + Ảnh AI + Video
                </option>
                <option value="TT + Prompt + Video + Ảnh AI">
                  TT + Prompt + Video + Ảnh AI
                </option>
                <option value="Prompt + Video">Prompt + Video</option>
              </select>
            </div>

            {selectedIds.length === 0 && (
              <span className="text-[10px] text-red-400 italic">
                * Tích chọn task
              </span>
            )}
          </div>
          <button
            onClick={handleDuplicateTasks}
            disabled={selectedIds.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 mr-2 rounded-md text-xs font-bold transition-all
    ${
      selectedIds.length > 0
        ? "bg-purple-600 text-white hover:bg-purple-700 active:scale-95 shadow-sm"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nhân bản{" "}
            {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}{" "}
          </button>
          <button
            onClick={handleSaveVideo}
            disabled={selectedIds.length === 0 || loadingPinVideo == true}
            className={`flex items-center gap-1.5 px-3 py-1.5 mr-2 rounded-md text-xs font-bold transition-all
    ${
      selectedIds.length > 0
        ? "bg-yellow-500 text-white hover:bg-yellow-600 active:scale-95 shadow-sm"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {loadingPinVideo ? (
              "Đang lưu"
            ) : (
              <>
                Lưu Kho{" "}
                {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}{" "}
              </>
            )}
          </button>

          <div className="ml-auto flex f">
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
              className="mr-2"
            />

            <HeaderActionButton
              className="mr-2"
              icon={<BookOpenText />}
              label="Hướng dẫn"
            />

            <HeaderActionButton
              className="mr-2"
              onClick={() => setIsConfigOpen(true)}
              icon={<Settings2 />}
              label="Cấu hình"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleRunSelectedTaskAuto(null)}
              className="bg-[#0eb27e] text-white flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 shadow-sm"
            >
              <Play size={14} className="fill-white" /> Chạy
            </button>

            <button
              onClick={() => handlePauseSelectedTaskAuto(null)}
              className="bg-orange-500 text-white flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 transition-all shadow-sm"
            >
              <Pause size={14} className="fill-white" /> Dừng
            </button>

            <ExcelImportVideoMKT onImportSuccess={handleImport} />
            <HeaderColoredButton
              icon={<FileSpreadsheet />}
              label="Xuất Excel"
              bgColor="#e87717"
              onClick={handleExportExcel}
            />
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-orange-500 text-white flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 shadow-lg  active:scale-95 transition-all"
            >
              <Link size={16} /> Nhập Link Hàng Loạt
            </button>

            {/* ➕ NÚT THÊM: Kích nổ thêm hàng mới */}
            <button
              onClick={handleAddTask}
              className="bg-blue-600 text-white flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all"
            >
              <Plus size={16} /> Thêm Task
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-0 p-2 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-[12px] font-bold text-gray-600 mr-2">
          Bộ lọc:
        </span>

        {[
          { id: "all", label: "Tất cả", color: "bg-gray-500" },
          { id: "processing", label: "Đang chạy", color: "bg-blue-500" },
          { id: "success", label: "Thành công", color: "bg-emerald-500" },
          { id: "error", label: "Lỗi", color: "bg-red-500" },
          { id: "none", label: "Đang chờ", color: "bg-gray-400" },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterStatus(btn.id as FilterStatus)}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
              filterStatus === btn.id
                ? `${btn.color} text-white shadow-md scale-105`
                : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {btn.label} (
            {btn.id === "all"
              ? tasks.length
              : tasks.filter((t) => t.status === btn.id).length}
            )
          </button>
        ))}
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="flex-1 min-h-0 bg-white rounded-b-xl border border-gray-100 shadow-sm flex flex-col">
        <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
          <table className="w-full text-left ">
            <thead className="bg-[#edf1f5] sticky top-0 z-30 shadow-sm">
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
                  Mô Tả
                </th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Ảnh SP
                </th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Ảnh AI
                </th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Chế độ xử lý
                </th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Số đoạn / 10s
                </th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Đoạn Đã Xong
                </th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Trạng Thái
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
              {filteredTasks.map((task, index) => (
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
                  <td className="p-2 text-center text-xs font-bold text-black">
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
                  <td className="p-4 text-center text-xs font-semibold text-black max-w-50">
                    <div className="truncate" title={task.productDesc}>
                      {task.productDesc && "Có"}
                    </div>
                  </td>
                  <td className="p-4 text-center text-xs font-semibold text-black max-w-50">
                    <div className="truncate" title={task.productPathImg}>
                      {task.productPathImg && "Có"}
                    </div>
                  </td>
                  <td className="p-4 text-center text-xs font-semibold text-black max-w-50">
                    <div className="truncate" title={task.aiImagePath}>
                      {task.aiImagePath && "Có"}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="relative group">
                      <select
                        value={task.mode}
                        onChange={(e) => {
                          // Dùng .map() lướt qua toàn bộ mảng gốc, tìm đúng ID thì update, không thì giữ nguyên
                          const newTasks = tasks.map((t) => {
                            if (t.id === task.id) {
                              // Thay task.id bằng tên trường ID thực tế của ông nếu khác
                              return {
                                ...t,
                                mode: e.target.value as
                                  | "Chỉ lấy thông tin sản phẩm"
                                  | "Prompt + Ảnh AI + Video"
                                  | "TT + Prompt + Video + Ảnh AI"
                                  | "Prompt + Video",
                              };
                            }
                            return t;
                          });

                          setTasks(newTasks);
                        }}
                        className="appearance-none w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] font-medium text-black outline-none hover:border-blue-200 cursor-pointer"
                      >
                        <option>Chỉ lấy thông tin sản phẩm</option>
                        <option>Prompt + Video</option>
                        <option>Prompt + Ảnh AI + Video</option>
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
                  <td className="p-2 text-center">
                    <div className="flex justify-center">
                      {task.status === "processing" && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                          <svg
                            className="animate-spin h-3 w-3 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          ĐANG CHẠY
                        </span>
                      )}

                      {task.status === "success" && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          DONE
                        </span>
                      )}

                      {task.status === "error" && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200 shadow-sm">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          ERROR
                        </span>
                      )}

                      {(task.status === "none" || !task.status) && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500 border border-gray-200 shadow-sm italic">
                          ĐANG CHỜ
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center max-w-50">
                    <div className="font-mono text-[10px] font-bold text-blue-600 wrap-break-word line-clamp-5 overflow-hidden">
                      {task.log}
                    </div>
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
        </div>
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
      {/* 🚀 MODAL NHẬP LINK HÀNG LOẠT */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-125 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight">
                Nhập Link Shopee / TikTok Hàng Loạt
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-200 hover:text-rose-500 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body Modal - Chỗ nhập liệu */}
            <div className="p-5 space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Danh sách Link (Mỗi dòng 1 link)
              </label>
              <textarea
                value={importLinksText}
                onChange={(e) => setImportLinksText(e.target.value)}
                placeholder="https://shopee.vn/product/123...&#10;https://vt.tiktok.com/ZS9LWESc..."
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none transition-all"
              />
              <div className="text-right text-[10px] font-bold text-orange-500">
                Phát hiện:{" "}
                {
                  importLinksText.split("\n").filter((l) => l.trim() !== "")
                    .length
                }{" "}
                link
              </div>
            </div>

            {/* Footer Modal - Nút hành động */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleImportLinksSubmit}
                className="px-5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md active:scale-95 transition-all"
              >
                Tạo Task ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub Components ---
