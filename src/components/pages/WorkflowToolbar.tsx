
import {
  Play,
  Save,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  Smartphone,
  RotateCcw,
  Monitor,
  RefreshCcw,
  Pause,
} from "lucide-react";
import { Device } from "../../types/Device";

export const WorkflowToolbar = ({
  // Logic kịch bản
  workflows,
  currentWorkflowId,
  onSwitch,
  onSave,
  onCreate,
  onExport,
  onImport,
  onReset,
  onDelete,
  // Logic ADB
  onRun,
  loadingDevices,
  devices,
  selectedDeviceId,
  onDeviceChange,
  onOpenMirror,
  runningWorkflow,
  isStoppingRef
}: any) => {
  return (
    <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 gap-4 select-none">
      {/* Cụm 1: Quản lý Workflow */}
      <div className="flex items-center gap-2">
        <div className="relative group">
          <select
            value={currentWorkflowId || ""}
            onChange={(e) => onSwitch(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 pr-10 text-sm font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer min-w-[220px]"
          >
            <option value="">-- Chọn Quy trình --</option>
            {workflows.map((wf: any) => (
              <option key={wf.id} value={wf.id}>
                {wf.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
          <ToolbarButton
            icon={<Plus size={16} />}
            tooltip="Thêm quy trình mới"
            onClick={onCreate}
          />
          <ToolbarButton
            icon={<Save size={16} />}
            tooltip="Lưu thay đổi"
            onClick={onSave}
          />
          <ToolbarButton icon={<Edit3 size={16} />} tooltip="Đổi tên" />
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <ToolbarButton
            icon={<Trash2 size={16} />}
            tooltip="Xóa quy trình này"
            color="hover:text-red-600 text-red-400"
            onClick={onDelete} // Gắn sự kiện click vào đây
          />
        </div>
      </div>

      {/* Cụm 2: Nhập/Xuất & Hệ thống */}
      <div className="flex items-center gap-2">
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          {/* Nút Nhập File JSON */}
          <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-white hover:shadow-sm transition-all text-xs font-bold">
            <Upload size={16} /> Nhập JSON
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={onImport}
            />
          </label>

          <ToolbarButton
            icon={<Download size={16} />}
            label="Xuất JSON"
            onClick={onExport}
          />
        </div>

        <ToolbarButton
          onClick={onReset}
          icon={<RotateCcw size={16} />}
          label="Đặt lại Node"
          className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
        />
      </div>

      {/* Cụm 3: Thiết bị & Run */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Smartphone
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 z-10"
          />

          {loadingDevices ? (
            <div className="flex items-center gap-2 bg-blue-50/50 border border-blue-100 rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-blue-400">
              <RefreshCcw size={14} className="animate-spin" />
              <span>Đang quét...</span>
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedDeviceId}
                className="appearance-none bg-blue-50/50 border border-blue-100 rounded-xl pl-10 pr-10 py-2 text-sm font-black text-blue-700 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer min-w-[180px]"
                onChange={(e) => onDeviceChange(e.target.value)}
              >
                {devices.length > 0 ? (
                  <>
                    <option value="all">
                      Tất cả thiết bị ({devices.length})
                    </option>
                    {devices.map((device: Device) => (
                      <option key={device.id} value={device.id}>
                        {device.model} ({device.id})
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="none">Không tìm thấy máy</option>
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600 text-[10px]">
                ▼
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onOpenMirror}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          <Monitor size={16} /> Mở màn hình
        </button>
          {!runningWorkflow ? (<button
          onClick={onRun}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          <Play size={16} className="fill-current" /> CHẠY NGAY
        </button>) :(<button
          onClick={()=>isStoppingRef.current =true}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-black hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          <Pause size={16} className="fill-current" /> DỪNG NGAY
        </button>)}
        
      </div>
    </div>
  );
};

const ToolbarButton = ({
  icon,
  label,
  tooltip,
  color,
  onClick,
  className,
}: any) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-white hover:shadow-sm transition-all text-xs font-bold ${color} ${className}`}
  >
    {icon} {label && <span>{label}</span>}
  </button>
);
