import React from 'react';
import { 
  Monitor, Timer, PowerOff, MousePointer2, TextCursorInput, 
  Files, Trash2, Smartphone, Type, Copy, ClipboardPaste, 
  Search, Variable, Shuffle, AppWindow, XSquare, Download 
} from 'lucide-react';

// 1. Định nghĩa Icon cho từng loại Node
const nodeIcons: Record<string, React.ReactNode> = {
  // Hành động chung
  screen_on: <Monitor size={14} />,
  wait: <Timer size={14} />,
  finish: <PowerOff size={14} />,
  
  // Tương tác thiết bị
  tap_xy: <MousePointer2 size={14} />,
  tap_xpath: <Search size={14} />,
  opencv_find_and_tap: <Smartphone size={14} />,
  type_text: <Type size={14} />,
  paste: <ClipboardPaste size={14} />,
  copy: <Copy size={14} />,
  key_event: <TextCursorInput size={14} />,
  
  // Logic
  check_ui: <Search size={14} />,
  set_var: <Variable size={14} />,
  random: <Shuffle size={14} />,
  
  // App
  open_app: <AppWindow size={14} />,
  close_app: <XSquare size={14} />,
  install_apk: <Download size={14} />,
  
  // File
  push_file: <Files size={14} />,
  delete_file: <Trash2 size={14} />,
};

export const WorkflowSidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-100 p-5 overflow-y-auto select-none">
      <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-tighter mb-6 flex items-center gap-2">
        <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
        Thư viện Node
      </h2>

      {/* Hành động Chung */}
      <NodeGroup title="Hành động Chung">
        <NodeButton label="Bật màn hình" type="screen_on" onDrag={onDragStart} />
        <NodeButton label="Đợi (ms)" type="wait" onDrag={onDragStart} />
        <NodeButton label="Kết thúc" type="finish" onDrag={onDragStart} />
      </NodeGroup>

      {/* Tương tác Thiết bị */}
      <NodeGroup title="Tương tác Thiết bị">
        <NodeButton label="Chạm (XY)" type="tap_xy" onDrag={onDragStart} />
        <NodeButton label="Chạm (XPath)" type="tap_xpath" onDrag={onDragStart} />
        <NodeButton label="Chạm IMG" type="opencv_find_and_tap" onDrag={onDragStart} />

        <NodeButton label="Nhập văn bản" type="type_text" onDrag={onDragStart} />
        <NodeButton label="Dán" type="paste" onDrag={onDragStart} />
        <NodeButton label="Sao chép" type="copy" onDrag={onDragStart} />
        <NodeButton label="Nhấn phím" type="key_event" onDrag={onDragStart} />
      </NodeGroup>

      {/* Logic & Điều kiện */}
      <NodeGroup title="Logic & Điều kiện">
        <NodeButton label="Kiểm tra UI" type="check_ui" onDrag={onDragStart} />
        <NodeButton label="Gán biến" type="set_var" onDrag={onDragStart} />
        <NodeButton label="Chuỗi ngẫu nhiên" type="random" onDrag={onDragStart} />
      </NodeGroup>

      {/* Quản lý Ứng dụng */}
      <NodeGroup title="Quản lý Ứng dụng">
        <NodeButton label="Mở App" type="open_app" onDrag={onDragStart} />
        <NodeButton label="Đóng App" type="close_app" onDrag={onDragStart} />
        <NodeButton label="Cài đặt APK" type="install_apk" onDrag={onDragStart} />
      </NodeGroup>

      {/* Quản lý Tệp */}
      <NodeGroup title="Quản lý Tệp">
        <NodeButton label="Đẩy File" type="push_file" onDrag={onDragStart} />
        <NodeButton label="Xóa File" type="delete_file" onDrag={onDragStart} />
      </NodeGroup>
    </aside>
  );
};

// Component con để chia nhóm cho đẹp
const NodeGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest px-1">{title}</h3>
    <div className="grid grid-cols-2 gap-2">
      {children}
    </div>
  </div>
);

const NodeButton = ({ label, type, onDrag }: any) => (
  <div
    draggable
    onDragStart={(e) => onDrag(e, type, label)}
    className="bg-white border border-slate-100 p-2.5 rounded-xl flex flex-col items-start gap-2 cursor-move hover:shadow-md hover:border-blue-200 transition-all group active:scale-95"
  >
    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
      {nodeIcons[type] || <Smartphone size={14} />}
    </div>
    <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors leading-tight text-left">
      {label}
    </span>
  </div>
);