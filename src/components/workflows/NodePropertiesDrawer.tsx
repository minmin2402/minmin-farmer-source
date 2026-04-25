import { X, Settings2, Play, Trash2, Terminal } from "lucide-react";
import { KEYEVENT } from "../../types/KeyEvent";

const NODE_FIELDS_CONFIG: Record<
  string,
  { fields: any[]; showInspector?: boolean; showInspectorXY?: boolean }
> = {
  tap_xpath: {
    showInspector: true, // CHỈ HIỆN Ở ĐÂY
    fields: [
      {
        name: "xpath",
        label: "Đường dẫn XPath",
        type: "text",
        placeholder: "//*[@resource-id=...]",
      },
      {
        name: "xpathTimeout",
        label: "Thời gian chờ (ms)",
        type: "number",
        placeholder: "10000",
      },
    ],
  },
  tap_xy: {
    showInspectorXY: true,
    fields: [
      {
        name: "x",
        label: "Toạ độ x",
        type: "text",
        placeholder: "200",
      },
      {
        name: "y",
        label: "Toạ độ y",
        type: "text",
        placeholder: "100",
      },
    ],
  },
  check_ui: {
    showInspector: true, // VÀ Ở ĐÂY
    fields: [{ name: "xpath", label: "Đối tượng cần check", type: "text" }],
  },
  wait: {
    fields: [
      {
        name: "ms_min",
        label: "Thời gian đợi từ (ms)",
        type: "number",
        placeholder: "1000",
      },
      {
        name: "ms_max",
        label: "Thời gian đợi đến (ms)",
        type: "number",
        placeholder: "10000",
      },
    ],
    // Không có showInspector -> Sẽ không hiện nút
  },
  key_event: {
    fields: [
      {
        name: "key_event",
        label: "Mã phím",
        type: "select",
        options: KEYEVENT,
        placeholder: "Chọn mã phím...",
      },
    ],
  },
  install_apk: {
    fields: [
      {
        name: "path_apk_install",
        label: "Đường dẫn APK",
        type: "file_apk",
        placeholder: "",
      },
    ],
    // Không có showInspector -> Sẽ không hiện nút
  },
  open_app: {
    fields: [
      {
        name: "package",
        label: "List App Package",
        type: "list_app",
        placeholder: "com.shoppe.vn",
      },
    ],
  },
  close_app: {
    fields: [
      {
        name: "package_close",
        label: "List App Package",
        type: "list_app",
        placeholder: "com.shoppe.vn",
      },
    ],
  },
  push_file: {
    fields: [
      {
        name: "path_file",
        label: "Tệp trên máy tính",
        type: "file",
        placeholder: "C:\\path\\to\\file.apk",
      },
      {
        name: "path_phone",
        label: "Đường dẫn trên điện thoại",
        type: "text",
        placeholder: "/sdcard/file.apk",
      },
    ],
    // Không có showInspector -> Sẽ không hiện nút
  },
  set_var: {
    fields: [
      {
        name: "var_name",
        label: "Tên biến",
        type: "text",
        placeholder: "username_shopee",
      },
      {
        name: "var_value",
        label: "Giá trị gán",
        type: "text",
        placeholder: "minmin_coder_2026",
      },
    ],
  },
  delete_file: {
    fields: [
      {
        name: "file_delete",
        label: "Đường dẫn file",
        type: "text",
        placeholder: "/sdcard/videoaff.mp4",
      }
      
    ],
    // Không có showInspector -> Sẽ không hiện nút
  },
  type_text: {
    fields: [
      {
        name: "content",
        label: "Nhập text",
        type: "text",
        placeholder: "Video vui vẻ",
      }
      
    ],
    // Không có showInspector -> Sẽ không hiện nút
  },
  opencv_find_and_tap: {
    fields: [
      {
        name: "templateName",
        label: "Tên file ảnh mẫu (trong thư mục templates)",
        type: "text",
        placeholder: "icon_tivi.png",
      },
      {
        name: "threshold",
        label: "Độ chính xác (0.1 đến 1.0)",
        type: "number",
        placeholder: "0.8",
      },
      {
        name: "mode",
        label: "icon || text",
        type: "text",
        placeholder: "icon",
      },
    ],
  },
  // ... các node khác tương tự
};

export const NodePropertiesDrawer = ({
  node,
  onClose,
  onUpdate,
  onDelete,
  onRunSingle,
  onOpenInspector,
  onOpenInspectorXY,
  loadListApp,
  listApp,
}: any) => {
  if (!node) return null;

  const nodeConfig = NODE_FIELDS_CONFIG[node.data.type] || { fields: [] };
  const fields = nodeConfig.fields;
  const shouldShowInspector = NODE_FIELDS_CONFIG[node.data.type]?.showInspector;
  const shouldShowInspectorXY =
    NODE_FIELDS_CONFIG[node.data.type]?.showInspectorXY;

  const updateNodeData = (field: string, value: any) => {
    // Đảm bảo onUpdate chính là setNodes từ useNodesState
    onUpdate((nds: any) =>
      nds.map((n: any) => {
        if (n.id === node.id) {
          // 🚀 Quan trọng: Tạo Object mới hoàn toàn cho data
          const updatedNode = {
            ...n,
            data: {
              ...n.data,
              [field]: value,
            },
          };
          return updatedNode;
        }
        return n;
      }),
    );
  };

  const isStartNode = node.type === "start";

  return (
    <div className="w-80 h-full bg-white border-l border-slate-100 shadow-2xl absolute right-0 top-0 z-50 flex flex-col">
      {/* Header giữ nguyên như các bước trước */}
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Settings2 size={16} className="text-slate-400" />
          <h2 className="text-sm font-black text-slate-700 uppercase">
            Cấu hình
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {/* Ẩn nút Chạy và Xóa nếu là node START */}
          {!isStartNode && (
            <>
              <button
                onClick={() => onRunSingle(node.id)}
                className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all active:scale-90"
                title="Chạy thử bước này"
              >
                <Play size={18} fill="currentColor" />
              </button>
              <button
                onClick={() => onDelete(node.id)}
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                title="Xóa bước này"
              >
                <Trash2 size={18} />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
            </>
          )}

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
        {/* NÚT UI INSPECTOR - CHỈ HIỆN THEO CẤU HÌNH */}
        {shouldShowInspector && (
          <div className="px-1 py-2">
            <button
              onClick={onOpenInspector}
              className="w-full py-3 bg-[#1e293b] text-white rounded-xl border-4 border-slate-50 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all font-black text-[10px] tracking-widest uppercase"
            >
              <div className="w-4 h-4 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
              </div>
              UI Inspector
            </button>
          </div>
        )}
        {shouldShowInspectorXY && (
          <div className="px-1 py-2">
            <button
              onClick={onOpenInspectorXY}
              className="w-full py-3 bg-[#1e293b] text-white rounded-xl border-4 border-slate-50 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all font-black text-[10px] tracking-widest uppercase"
            >
              <div className="w-4 h-4 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
              </div>
              X,Y Inspector
            </button>
          </div>
        )}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
            Thông số chi tiết
          </h3>

          <div className="space-y-4">
            {/* Duyệt qua config để vẽ Input */}
            {/* Phần map fields trong NodePropertiesDrawer.tsx */}
            {fields.map((field) => (
              <div key={field.name}>
                <label className="text-[10px] font-bold text-slate-500 block mb-1.5 ml-1 italic uppercase tracking-wider">
                  {field.label}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    value={node.data[field.name] || ""}
                    onChange={(e) => updateNodeData(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none 
                   placeholder:text-slate-300 placeholder:font-normal placeholder:italic"
                  />
                ) : field.type == "select" ? (
                  // 🚀 RENDER DANH SÁCH SỔ XUỐNG
                  <select
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    value={node.data[field.name] || ""}
                    onChange={(e) =>
                      updateNodeData(field.name, Number(e.target.value))
                    }
                  >
                    <option value="" disabled>
                      {field.placeholder}
                    </option>
                    {field.options.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type == "file_apk" ? (
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      readOnly // Khóa gõ tay để tránh sai đường dẫn
                      placeholder="Chọn file APK..."
                      className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl text-[12px] font-mono focus:outline-none"
                      value={node.data[field.name] || ""}
                    />
                    <button
                      onClick={async () => {
                        // @ts-ignore - Gọi API Electron để mở bảng chọn file
                        const filePath =await window.electronAPI.selectFileApk();
                        if (filePath) {
                          updateNodeData(field.name, filePath);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      Chọn File
                    </button>
                  </div>
                ) : field.type == "list_app" ? (
                  <>
                    <div className="bg-taupe-100 p-3 mb-3 rounded-xl border">
                      <button
                        className="w-full bg-blue-600 mb-3 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                        onClick={loadListApp}
                      >
                        Load các app trên phone
                      </button>
                      <div className="bg-white rounded-xl p-3 border shadow-sm max-h-100 overflow-y-auto">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">
                          Danh sách ứng dụng ({listApp.length})
                        </p>

                        {listApp.map((app: string, index: number) => (
                          <div
                            key={index}
                            className="group flex items-center px-3 py-2 my-1 rounded-lg transition-all duration-200 
                 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border border-transparent 
                 hover:border-blue-100 active:scale-[0.98]"
                            style={{ fontSize: "12px" }}
                            onClick={() => {
                              updateNodeData(field.name, app);
                              // MinMin có thể gọi hàm mở App Shopee ở đây luôn 🚀
                            }}
                          >
                            {/* Icon giả lập hoặc số thứ tự cho đẹp */}
                            <span className="w-5 h-5 flex items-center justify-center bg-slate-100 group-hover:bg-blue-100 rounded-md mr-3 text-[10px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                              {index + 1}
                            </span>

                            <span className="truncate font-medium tracking-tight">
                              {app}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1.5 ml-1 italic uppercase tracking-wider">
                      Tên Package
                    </label>
                    <input
                      type="text"
                      value={node.data[field.name] || ""}
                      onChange={(e) =>
                        updateNodeData(field.name, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all 
                   placeholder:text-slate-300 placeholder:font-normal placeholder:italic"
                    />
                  </>
                ) : field.type == "file" ? (
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="C:/Users/videoaff.mp4"
                      className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl text-[12px] font-mono focus:outline-none"
                      value={node.data[field.name] || ""}
                      onChange={(e) => updateNodeData(field.name, e.target.value)}
                    />
                    <button
                      onClick={async () => {
                        // @ts-ignore - Gọi API Electron để mở bảng chọn file
                        const filePath = await window.electronAPI.selectFile();
                        if (filePath) {
                          updateNodeData(field.name, filePath);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      Chọn File
                    </button>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={node.data[field.name] || ""}
                    onChange={(e) => updateNodeData(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all 
                   placeholder:text-slate-300 placeholder:font-normal placeholder:italic"
                  />
                )}
              </div>
            ))}

            {/* Cấu hình hệ thống (Delay luôn có) */}
            <div className="pt-2 border-t border-slate-50 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1.5 ml-1 italic">
                  Đợi sau khi thực hiện (ms)
                </label>
                <input
                  type="number"
                  value={node.data.delay || 0}
                  onChange={(e) => updateNodeData("delay", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1.5 ml-1 italic">
                Chiến lược khi lỗi
              </label>
              <select onChange={(e) => updateNodeData("handleError", e.target.value)}  value={node.data.handleError} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold outline-none cursor-pointer">
                <option>Stop workflow</option>
                <option>Ignore and continue</option>
                <option>Retry 3 times</option>
              </select>
            </div>
          </div>
        </div>

        {/* EXECUTION LOGS giữ nguyên */}
        {/* EXECUTION LOGS */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={12} /> Execution Logs
            </h3>
            <button className="text-[9px] font-black bg-slate-500 text-white px-2 py-0.5 rounded uppercase hover:bg-slate-600 transition-colors">
              Clear
            </button>
          </div>
          <div className="bg-[#0f172a] rounded-xl p-4 h-48 font-mono text-[10px] text-emerald-400 overflow-y-auto shadow-inner border border-slate-800">
            <p className="opacity-50 tracking-tighter">
              [{new Date().toLocaleTimeString()}] System ready.
            </p>
            <p className="text-yellow-400 tracking-tighter">
              [{new Date().toLocaleTimeString()}] Selected: {node.data.label}
            </p>
            {isStartNode && (
              <p className="text-blue-400 tracking-tighter">
                --- Ready to launch farm ---
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
