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
import { useState, useEffect, useRef } from "react";
import { AutoShopeeTask } from "../../types/AutoPostShopeeTask";
import { ExcelImportAutoPost, HeaderActionButton } from "../tools/Button";

export const AutoShopee = () => {
  const [tasks, setTasks] = useState<AutoShopeeTask[]>(() => {
    const savedTasks = localStorage.getItem("minmin_auto_tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [logTasks, setLogTasks] = useState<any>({});
  const isStoppingTaskRef = useRef<number[]>([]);
  // 2. Mỗi khi biến `tasks` thay đổi, tự động lưu vào localStorage
  // 2. Hàm xử lý Checkbox All (Ở đầu bảng)
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
  const updateTaskStatus = (
    id: number,
    status: "pending" | "running" | "done" | "error",
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: status } : task,
      ),
    );
  };
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
  const stopTaskSelected = () => {
    if (selectedIds.length === 0) return;

    if (window.confirm(`Dừng khẩn cấp ${selectedIds.length} máy đang chạy?`)) {
      // Thêm tất cả ID đang chọn vào danh sách dừng
      isStoppingTaskRef.current = [
        ...isStoppingTaskRef.current,
        ...selectedIds,
      ];

      // Cập nhật giao diện về trạng thái ban đầu
      selectedIds.forEach((id) => updateTaskStatus(id, "pending"));

      setSelectedIds([]);
    }
  };
  const runWorkflowByConfig = async (
    taskId: number,
    deviceId: string,
    workflowName: string,
    videoPath: string,
    affiliate: string,
    title: string,
  ) => {
    // 1. Báo đang chạy
    updateTaskStatus(taskId, "running");

    try {
      const savedWorkflows = JSON.parse(
        localStorage.getItem("minmin_workflows") || "[]",
      );
      const workflow = savedWorkflows.find(
        (wf: any) => wf.name === workflowName,
      );

      if (!workflow) throw new Error("Không tìm thấy kịch bản");

      // 2. Gọi hàm vừa định nghĩa ở trên 🚀
      await startExecution(deviceId, workflow.nodes, workflow.edges, taskId, {
        videoPath,
        affiliate,
        title,
      });

      // 3. Xong xuôi thì báo Done
      setLogTasks((prev: any) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), "done"],
      }));
      updateTaskStatus(taskId, "done");
    } catch (error) {
      console.error(error);
      setLogTasks((prev: any) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), error],
      }));
      updateTaskStatus(taskId, "error");
    }
  };

  useEffect(() => {
    localStorage.setItem("minmin_auto_tasks", JSON.stringify(tasks));
  }, [tasks]);
  const startExecution = async (
    deviceId: string,
    nodes: any[],
    edges: any[],
    taskId: number,
    manualVars: { videoPath: string; affiliate: string; title: string },
  ) => {
    // 1. Tìm node Start trong kịch bản này
    const startNode = nodes.find(
      (n) => n.data?.type === "start" || n.type === "start",
    );
    if (!startNode) throw new Error("Kịch bản không có node Start!");

    let currentNodeId = startNode.id;
    const visited = new Set();
    
    // 🚀 KHỞI TẠO BIẾN
    const executionVars: Record<string, string> = {
      videoPath: manualVars.videoPath || "",
      affiliate: manualVars.affiliate || "",
      title: manualVars.title || "",
    };

    // 2. Vòng lặp duyệt node
    while (currentNodeId) {
      if (isStoppingTaskRef.current.includes(taskId)) {
        setLogTasks((prev: any) => ({
          ...prev,
          [taskId]: [
            ...(prev[taskId] || []),
            `🚫 Task ${taskId} dừng theo lệnh.`,
          ],
        }));
        
        isStoppingTaskRef.current = isStoppingTaskRef.current.filter(
          (id) => id !== taskId,
        );
        break; // Phanh khẩn cấp!
      }
      
      if (visited.has(currentNodeId)) break;
      visited.add(currentNodeId);
      const node = nodes.find((n) => n.id === currentNodeId);
      if (!node) break;

      if (node.type !== "start") {
        let finalParams = JSON.parse(JSON.stringify(node.data || {}));
        const replaceVars = (str: any) => {
          if (typeof str !== "string") return str;
          return str.replace(
            /\{\{(.*?)\}\}/g,
            (_, key) => executionVars[key.trim()] || `{{${key}}}`,
          );
        };

        Object.keys(finalParams).forEach((key) => {
          finalParams[key] = replaceVars(finalParams[key]);
        });

        // --- 🚀 LOGIC XỬ LÝ LỖI (HANDLE ERROR) ---
        const errorStrategy = node.data.handleError || "Stop workflow";
        const maxRetries = errorStrategy === "Retry 3 times" ? 3 : 1;
        let attempt = 0;
        let result: any = null;

        // Vòng lặp Retry
        while (attempt < maxRetries) {
          attempt++;
          
          setLogTasks((prev: any) => ({
            ...prev,
            [taskId]: [
              ...(prev[taskId] || []),
              `Đang chạy lệnh ${node.data.type} ${maxRetries > 1 ? `(Lần ${attempt}/${maxRetries})` : ""}`,
            ],
          }));

          // @ts-ignore
          result = await window.electronAPI.executeAdb({
            deviceId,
            action: node.data.type,
            params: finalParams,
          });

          if (result?.success) {
            setLogTasks((prev: any) => ({
              ...prev,
              [taskId]: [
                ...(prev[taskId] || []),
                `✅ Chạy lệnh ${node.data.type} thành công`,
              ],
            }));
            break; 
          } else {
            setLogTasks((prev: any) => ({
              ...prev,
              [taskId]: [
                ...(prev[taskId] || []),
                `❌ ${node.data.type} Thất bại: ${result?.error}`,
              ],
            }));
            
            if (attempt < maxRetries) {
              await new Promise((r) => setTimeout(r, 1500));
            }
          }
        }

        // --- KIỂM TRA KẾT QUẢ ---
        if (!result?.success) {
          if (errorStrategy === "Ignore and continue") {
            setLogTasks((prev: any) => ({
              ...prev,
              [taskId]: [...(prev[taskId] || []), `⚠️ Bỏ qua lỗi và đi tiếp`],
            }));
          } else {
            setLogTasks((prev: any) => ({
              ...prev,
              [taskId]: [...(prev[taskId] || []), `🛑 Dừng kịch bản do lỗi!`],
            }));
            updateTaskStatus(taskId, "error");
            break; 
          }
        }

        if (node.data.type === "set_var") {
          setLogTasks((prev: any) => ({
            ...prev,
            [taskId]: [
              ...(prev[taskId] || []),
              `Gán biến ${finalParams.var_name} = ${finalParams.var_value}`,
            ],
          }));
          executionVars[node.data.var_name] = finalParams.var_value;
        }

        setLogTasks((prev: any) => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), `Đợi ${node.data?.delay} ms`],
        }));
        await new Promise((r) => setTimeout(r, node.data?.delay || 500));
      }

      const edge = edges.find((e) => e.source === currentNodeId);
      currentNodeId = edge ? edge.target : null;
    }
  };
  const [availableWorkflows] = useState<string[]>(() => {
    const saved = localStorage.getItem("minmin_workflows"); // Key bạn dùng để lưu kịch bản nodes
    if (saved) {
      const parsed = JSON.parse(saved);
      // Giả sử dữ liệu là mảng các object kịch bản, ta lấy ra cái tên (name/title)
      return parsed.map((wf: any) => wf.name || "Kịch bản chưa đặt tên");
    }
    return ["Chưa có kịch bản nào"];
  });
  // 3. Hàm thêm Task mới
  const handleAddTask = () => {
    const newTask: AutoShopeeTask = {
      id: Date.now(), // Dùng timestamp làm ID duy nhất
      serial: "",
      note: "",
      workflow: "",
      videoPath: "",
      affiliate: "",
      title: "",
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
  const handleRunTask = async (task: any) => {
    const requiredFields = [
      { key: "serial", label: "Số Serial" },
      { key: "workflow", label: "Workflow" },
      { key: "videoPath", label: "Video Path" },
      { key: "affiliate", label: "Affiliate Link" },
      { key: "title", label: "Tiêu đề Video" },
    ];
    // 2. Kiểm tra xem có trường nào trống không
    const missingField = requiredFields.find(
      (field) => !task[field.key] || task[field.key].trim() === "" || task[field.key].trim() === "none",
    );

    if (missingField) {
      // Báo lỗi chính xác trường nào đang thiếu cho MinMin biết
      alert(`MinMin ơi, thiếu "${missingField.label}" rồi!`);
      return;
    }

    console.log(
      `🚀 Đang kích nổ kịch bản: ${task.workflow} trên máy: ${task.serial}`,
    );
    try {
      setLogTasks({
        ...logTasks,
        [task.id]: ["Bắt đầu chạy với " + task.workflow],
      });
      await runWorkflowByConfig(
        task.id,
        task.serial,
        task.workflow,
        task.videoPath,
        task.affiliate,
        task.title,
      );
    } catch (err) {
      console.error("Lỗi khi chạy task:", err);

      setLogTasks((prev: any) => ({
        ...prev,
        [task.id]: [
          ...(prev[task.id] || []),
          "Có lỗi xảy ra trong quá trình chạy",
        ],
      }));
      // updateTaskStatus cũng đã được xử lý trong try/catch của runWorkflowByConfig
    }
  };
  // 5. Hàm xóa Task
  /* const deleteTask = (id: number) => {
    if (tasks[id].status == "running") {
      alert("Đang chạy không xoá được nhé");
    }
    if (window.confirm("Xóa dòng này nhé MinMin?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  }; */

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
  const handleImport = (newTasks: AutoShopeeTask[]) => {
      // Gộp task cũ và task mới từ Excel
      setTasks((prev) => [...prev, ...newTasks]);
    };
  const runTaskSelected = () => {
    // 1. Kiểm tra xem có đang chọn dòng nào không
    if (selectedIds.length === 0) {
      alert("MinMin ơi, chưa chọn dòng nào để chạy cả!");
      return;
    }

    // 2. Xác nhận "kích nổ" dàn farm
    if (
      window.confirm(
        `Vít ga ${selectedIds.length} dòng đã chọn này nhé MinMin?`,
      )
    ) {
      // 3. Lọc ra danh sách object các task cần chạy từ mảng selectedIds
      const tasksToRun = tasks.filter((task) => selectedIds.includes(task.id));

      // 4. CHẠY SONG SONG: Dùng map để kích hoạt tất cả cùng lúc
      // Chúng ta không dùng await ở đây để nó không đợi từng task hoàn thành
      tasksToRun.map((task) => {
        // Kiểm tra sơ bộ xem có đủ Serial và Workflow không
        if (task.serial && task.workflow) {
          // Gọi hàm chạy (Hàm này đã có try/catch và updateTaskStatus bên trong)
          handleRunTask(task).catch((err) =>
            console.error(`Lỗi máy ${task.serial}:`, err),
          );
        } else {
          console.warn(`Task ${task.id} thiếu thông tin, bỏ qua.`);
          updateTaskStatus(task.id, "error");
        }
      });

      // 5. Sau khi kích hoạt xong thì bỏ chọn (Reset checkbox)
      setSelectedIds([]);

      console.log(`🚀 Đã kích nổ song song ${tasksToRun.length} kịch bản!`);
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
            SHOPEE AUTO VIDEO POST
          </h1>
          <p className="text-xs font-bold text-slate-400">
            Quản lý và tự động hóa các tác vụ đăng video
          </p>
        </div>
        <div className="flex gap-2">
          <HeaderActionButton
            onClick={() => {
              // Sử dụng window.electron để mở link ra trình duyệt ngoài
              //@ts-ignore
              window.electronAPI.openExternal(
                "https://docs.google.com/spreadsheets/d/1Dmldo8ZtqIjydFQ3-8O9jCBnR3FJPYRMndrY0HXKYFw/edit?usp=sharing",
              );
            }}
            icon={<Table />}
            label="Mẫu Excel"
          />
          <HeaderButton icon={<Download size={14} />} label="Xuất Excel" />
          <ExcelImportAutoPost onImportSuccess={handleImport}/>

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
          onClick={runTaskSelected}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
        >
          <Play size={16} /> Chạy Đã Chọn
        </button>
        <button
          onClick={stopTaskSelected}
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
        <div className="h-8 w-px bg-slate-200 mx-2" />
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <span className="text-[10px] font-black text-slate-400 uppercase">
            Rest between runs:
          </span>
          <input
            type="number"
            defaultValue={15}
            className="w-12 bg-transparent text-xs font-bold text-center outline-none"
          />
          <span className="text-[10px] font-bold text-slate-400">min</span>
        </div>
        <div className="flex-1" /> {/* Spacer */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Tìm kiếm task..."
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none w-64"
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
                Số Serial
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
                Tên Workflow
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
                      updateTask(task.id, "serial", e.target.value)
                    }
                    value={task.serial}
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
                      <select
                        value={task.workflow}
                        onChange={(e) =>
                          updateTask(task.id, "workflow", e.target.value)
                        }
                        className="w-full bg-transparent outline-none cursor-pointer appearance-none 
                   text-slate-700 font-medium focus:text-blue-600 transition-colors"
                      >
                        <option value={"none"}  className="text-slate-300">
                          Chọn workflow...
                        </option>

                        {availableWorkflows.map((wfName) => (
                          
                          <option
                            key={wfName}
                            value={wfName}
                            className="text-slate-800 bg-white"
                          >
                            {wfName}
                          </option>
                        ))}
                      </select>

                      {/* Icon mũi tên nhỏ cho chuyên nghiệp vì mình dùng appearance-none */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-blue-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
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
                      updateTask(task.id, "title", e.target.value)
                    }
                    value={task.title}
                    placeholder="Tiêu đề video...."
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
                      {logTasks[task.id]?.at(-1) || "Standby"}
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
                        onClick={() =>
                          (isStoppingTaskRef.current = [
                            ...isStoppingTaskRef.current,
                            task.id,
                          ])
                        }
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
                        onClick={() => handleRunTask(task)}
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
