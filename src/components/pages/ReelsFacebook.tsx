import {
  Plus,
  Play,
  Trash2,
  Download,
  Search,
  FolderOpen,
  Copy,
  Square,
  Pause,
  Table,

} from "lucide-react";
import { useState, useEffect } from "react";
import { ExcelImportAutoReels, HeaderActionButton } from "../tools/Button";
import { ConfigReels, ReelsTask } from "../../types/ReelsTask";
import toast from "react-hot-toast";

export const ReelsFacebook = () => {
  const [tasks, setTasks] = useState<ReelsTask[]>(() => {
    const savedTasks = localStorage.getItem("reels_fb_tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [config, setConfig] = useState<ConfigReels>(() => {
    const savedTasks = localStorage.getItem("cfg_reels_fb");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const handleImport = (newTasks: ReelsTask[]) => {
    // Gộp task cũ và task mới từ Excel
    setTasks((prev) => [...prev, ...newTasks]);
  };
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [statusGPMAPI, setStatusGPMAPI] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Nếu tích vào -> Lấy tất cả ID của tasks hiện có bỏ vào mảng
      const allIds = tasks.map((task) => task.id);
      setSelectedIds(allIds);
    } else {
      // Nếu bỏ tích -> Làm rỗng mảng
      setSelectedIds([]);
    }
  };
  // 3. Hàm xử lý chọn lẻ từng hàng
  const handleSelectOne = (id: number) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // Nếu có rồi thì bỏ ra
          : [...prev, id], // Chưa có thì thêm vào
    );
  };
  // 1. Thêm cái này vào đầu component để lấy data
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  useEffect(() => {
    const saved = localStorage.getItem("minmin_app_settings");
    if (saved) setGeneralSettings(JSON.parse(saved));
  }, []);
  const handleSelectFile = async (taskId: number) => {
    // 1. Kiểm tra nếu đang chạy thì không cho chọn file mới
    const currentTask = tasks.find((t) => t.id === taskId);
    if (currentTask?.status === "running") return;

    // 2. Gọi xuống Electron để mở hộp thoại chọn file
    // @ts-ignore
    const filePath = await window.electronAPI.selectFile();

    // 3. Nếu chọn xong (không bấm Cancel) thì cập nhật vào task
    if (filePath) {
      updateTask(taskId, "videoPath", filePath);
    }
  };
  async function handlePauseSelectedTaskAuto(task: ReelsTask | null) {
    try {
      //@ts-ignore
      const result = await window.electronAPI.stopTaskAutoReels(
        task ? [task.id] : selectedIds,
      );
    } catch (error) {}
  }
  

  useEffect(() => {
    localStorage.setItem("reels_fb_tasks", JSON.stringify(tasks));
    localStorage.setItem("cfg_reels_fb", JSON.stringify(config));
  }, [tasks, config]);
  useEffect(() => {
    // Lắng nghe sự kiện từ Backend "bắn" lên
    //@ts-ignore
    const removeListener = window.electronAPI.onTaskLogReels((logData: any) => {
      console.log("Nhận log realtime:", logData);

      // Cập nhật vào mảng logs để hiển thị lên màn hình
      setTasks((prev) =>
        prev.map((task) =>
          task.id === logData.id
            ? {
                ...task,
                log: logData?.message ?? task.log,
                status: logData.status,
              }
            : task,
        ),
      );
    });

    return () => removeListener(); // Cleanup khi đóng component
  }, []);

  // 3. Hàm thêm Task mới
  const handleAddTask = () => {
    const newTask: ReelsTask = {
      id: Date.now(), // Dùng timestamp làm ID duy nhất
      profile_id: "",
      note: "",
      link_page: "",
      videoPath: "",
      affiliate: "",
      description: "",
      log: "",
      status: "pending",
    };
    setTasks([...tasks, newTask]); // Thêm vào mảng hiện tại
  };
  // 4. Hàm cập nhật dữ liệu khi gõ vào ô Input
  const updateTask = (id: number, field: string, value: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          // 🛑 CHIÊU CHẶN: Nếu đang chạy thì giữ nguyên task cũ, không cho sửa
          if (task.status === "running") {
            return task;
          }
          return { ...task, [field]: value };
        }
        return task;
      }),
    );
  };
  async function handleRunSelectedTaskAuto(task: ReelsTask | null) {
    try {
      //@ts-ignore
      const result = await window.electronAPI.runTaskAutoReels({
        ...config,
        tasks: task ? [task] : tasks.filter((t) => selectedIds.includes(t.id)),
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

  const deleteTaskSelected = () => {
    // 1. Kiểm tra xem có đang chọn dòng nào không
    if (selectedIds.length === 0) {
      alert("MinMin ơi, chưa chọn dòng nào để xóa cả!");
      return;
    }

    // 2. Lọc ra danh sách các Task đang chạy trong đống được chọn
    const tasksToRun = tasks.filter((t) => selectedIds.includes(t.id));
    const runningTasks = tasksToRun.filter((t) => t.status === "running");

    // 3. Nếu có máy đang chạy thì "phanh" lại ngay
    if (runningTasks.length > 0) {
      alert(
        `MinMin ơi, không thể xóa vì có ${runningTasks.length} máy đang chạy!\n` +
          `Hãy bấm "Stop" các máy đó trước khi xóa nhé. 🛑`,
      );
      return;
    }

    // 4. Nếu tất cả đều rảnh rỗi (pending/done/error) thì mới hỏi xác nhận
    if (
      window.confirm(`Xóa ${selectedIds.length} dòng đã chọn này nhé MinMin?`)
    ) {
      // Thực hiện xóa
      setTasks(tasks.filter((task) => !selectedIds.includes(task.id)));

      // Reset mảng chọn
      setSelectedIds([]);

      console.log("✅ Đã tiễn biệt các task được chọn!");
    }
  };

  return (
    <div className="p-6 w-full space-y-4 bg-slate-50 min-h-screen select-none">
      {/* 1. HEADER SECTION */}
      <div className="flex justify-between items-start">
        <div>
          <h1
            style={{ fontStyle: "normal" }}
            className="text-xl font-black text-slate-800 uppercase tracking-tight"
          >
            FACEBOOK REELS AUTO POST
          </h1>
          <p className="text-xs font-bold text-slate-400">
            Quản lý và tự động hóa đăng reels
          </p>
        </div>
        <div className="flex gap-2">
          <HeaderActionButton
            onClick={() => {
              // Sử dụng window.electron để mở link ra trình duyệt ngoài
              //@ts-ignore
              window.electronAPI.openExternal(
                "https://docs.google.com/spreadsheets/d/1ZShX4xalBQn53hsOAMx5yl5QTS4Fd-6B3e8L6JViJas/edit?usp=sharing",
              );
            }}
            icon={<Table />}
            label="Mẫu Excel"
          />
          <HeaderButton icon={<Download size={14} />} label="Xuất Excel" />
          <ExcelImportAutoReels onImportSuccess={handleImport} />
        </div>
      </div>

      {/* 2. TOOLBAR SECTION */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-2 items-center">
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
        >
          <Plus size={16} /> Thêm Task
        </button>
        <button
          onClick={() => handleRunSelectedTaskAuto(null)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
        >
          <Play size={16} /> Chạy Đã Chọn
        </button>
        <button
          onClick={() => handlePauseSelectedTaskAuto(null)}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
        >
          <Pause size={16} /> Dừng Đã Chọn
        </button>
        <button
          onClick={deleteTaskSelected}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
        >
          <Trash2 size={16} /> Xóa Đã Chọn
        </button>
        <div className="h-8 w-px bg-slate-200 mx-1" />
        {/* --- BỘ CONFIG MỚI CỦA HOÀNG --- */}
        <div className="flex items-center gap-3">
          {/* Số luồng */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg">
            <span className="text-[10px] font-black text-slate-400 uppercase">
              Threads:
            </span>
            <input
              type="number"
              value={config.thread}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  thread: +e.target.value, // Dùng dấu + để đổi sang Number nhanh
                }))
              }
              className="w-8 bg-transparent text-xs font-bold text-center outline-none text-blue-600"
            />
          </div>
          {/* Delay Between */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg">
            <span className="text-[10px] font-black text-slate-400 uppercase">
              Delay (s):
            </span>
            <input
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  delay_between: +e.target.value, // Dùng dấu + để đổi sang Number nhanh
                }))
              }
              type="number"
              value={config.delay_between}
              className="w-10 bg-transparent text-xs font-bold text-center outline-none text-blue-600"
            />
          </div>
        
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-3 pr-1 py-1 rounded-lg">
            <span className="text-[10px] font-black text-slate-400 uppercase">
              GPM API:
            </span>
            <input
              readOnly
              onClick={() =>
                toast("Vui lòng qua tab Settings để sửa", { icon: "⚙️" })
              }
              value={generalSettings?.gpm_api_key || ""}
              type="text"
              placeholder="Trống..."
              className="w-32 bg-transparent text-xs font-medium outline-none cursor-not-allowed text-slate-400"
            />
            <button
              disabled={statusGPMAPI === "loading"}
              className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-[10px] font-bold transition-colors"
              onClick={async () => {
                if (!generalSettings?.gpm_api_key)
                  return toast.error("Chưa cài GPM API");
                setStatusGPMAPI("loading");
                // @ts-ignore
                const result = await window.electronAPI.checkGpmConnection(
                  generalSettings.gpm_api_key,
                );
                if (result.success) toast.success("GPM OK!");
                else toast.error("Lỗi GPM");
                setStatusGPMAPI("idle");
              }}
            >
              {statusGPMAPI === "loading" ? "Đang check..." : "Check"}
            </button>
          </div>
        </div>
        {/* --- END BỘ CONFIG --- */}
        <div className="flex-1" /> {/* Spacer */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Tìm kiếm task..."
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none w-48"
          />
        </div>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  // Tự động tích nếu số lượng chọn bằng tổng số task (và task > 0)
                  checked={
                    selectedIds.length === tasks.length && tasks.length > 0
                  }
                  className="rounded"
                />
              </th>
              <th className="p-4 w-10">#</th>
              <th
                className="p-4 font-black text-black"
                style={{ fontStyle: "normal" }}
              >
                Profile ID
              </th>
              <th
                className="p-4 font-black text-black"
                style={{ fontStyle: "normal" }}
              >
                Ghi chú
              </th>
              <th
                className="p-4 font-black text-black"
                style={{ fontStyle: "normal" }}
              >
                Link Page
              </th>
              <th
                className="p-4 font-black text-black"
                style={{ fontStyle: "normal" }}
              >
                Đường dẫn Video
              </th>
              <th
                className="p-4 font-black text-black"
                style={{ fontStyle: "normal" }}
              >
                Link Affiliate
              </th>
              <th
                className="p-4 font-black text-black"
                style={{ fontStyle: "normal" }}
              >
                Tiêu đề
              </th>
              <th
                className="p-4 font-black text-black"
                style={{ fontStyle: "normal" }}
              >
                Log
              </th>
              <th
                className="p-4 font-black text-black text-center"
                style={{ fontStyle: "normal" }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="text-[12px] font-medium text-slate-600">
            {tasks.map((task, index) => (
              <tr
                key={task.id}
                className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-4 text-center">
                  <input
                    checked={selectedIds.includes(task.id)}
                    onChange={() => handleSelectOne(task.id)}
                    type="checkbox"
                    className="rounded"
                  />
                </td>
                <td className="p-4 font-bold">
                  {task.status === "running" && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping inline-block mr-2" />
                  )}
                  <span
                    className={
                      task.status === "done"
                        ? "text-emerald-600"
                        : task.status === "error"
                          ? "text-rose-600"
                          : task.status === "running"
                            ? "text-emerald-500"
                            : "text-slate-300"
                    }
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    placeholder="Ví dụ: 12345678"
                    onChange={(e) =>
                      updateTask(task.id, "profile_id", e.target.value)
                    }
                    value={task.profile_id}
                    className="w-full placeholder:text-slate-300 bg-transparent outline-none focus:text-blue-600"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    placeholder="..."
                    onChange={(e) =>
                      updateTask(task.id, "note", e.target.value)
                    }
                    value={task.note}
                    className="w-full bg-transparent outline-none"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 group">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="..."
                        onChange={(e) =>
                          updateTask(task.id, "link_page", e.target.value)
                        }
                        value={task.link_page}
                        className="w-full bg-transparent outline-none"
                      />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 group">
                    <input
                      type="text"
                      value={task.videoPath}
                      onChange={(e) =>
                        updateTask(task.id, "videoPath", e.target.value)
                      }
                      placeholder="Đường dẫn video..."
                      readOnly={task.status === "running"}
                      className={`flex-1 bg-transparent outline-none placeholder:text-slate-300 ${
                        task.status === "running"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    />

                    <FolderOpen
                      size={14}
                      onClick={() => handleSelectFile(task.id)} // 🚀 Kích nổ ở đây
                      className={`transition-colors ${
                        task.status === "running"
                          ? "text-slate-200 cursor-not-allowed"
                          : "text-slate-400 hover:text-blue-500 cursor-pointer"
                      }`}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    onChange={(e) =>
                      updateTask(task.id, "affiliate", e.target.value)
                    }
                    value={task.affiliate}
                    placeholder="Link Shopee..."
                    className="w-full bg-transparent outline-none placeholder:text-slate-300"
                  />
                </td>
                <td className="p-4">
                  <input
                    type="text"
                    onChange={(e) =>
                      updateTask(task.id, "description", e.target.value)
                    }
                    value={task.description}
                    placeholder="Mô tả video...."
                    className="w-full bg-transparent outline-none placeholder:text-slate-300"
                  />
                </td>
                <td className="p-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <p className="text-[11px] font-bold text-blue-700 font-mono">
                      {task.log || "Standby"}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all">
                      <Copy
                        size={14}
                        className="text-black hover:text-blue-500"
                      />
                    </button>
                    {task.status === "running" ? (
                      <button
                        onClick={() => handlePauseSelectedTaskAuto(task)}
                        className="p-1.5 hover:bg-rose-50 rounded transition-all group/stop"
                        title="Dừng khẩn cấp"
                      >
                        <Square
                          size={14}
                          className="text-rose-400 fill-rose-400 animate-pulse"
                        />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRunSelectedTaskAuto(task)}
                        className="p-1.5 hover:bg-emerald-50 rounded transition-all"
                      >
                        <Play
                          size={14}
                          className="text-black hover:text-emerald-500"
                        />
                      </button>
                    )}
                    {/* <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all"
                    >
                      <Trash
                        size={14}
                        className="text-black hover:text-rose-500"
                      />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// COMPONENT CON CHO ĐỠ RỐI
const HeaderButton = ({ icon, label }: any) => (
  <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
    {icon} {label}
  </button>
);
