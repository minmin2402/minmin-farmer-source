import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Monitor, Timer, PowerOff, MousePointer2, TextCursorInput, 
  Files, Trash2, Smartphone, Type, Copy, ClipboardPaste, 
  Search, Variable, Shuffle, AppWindow, XSquare, Download, Edit3, Play,
  ScanSearch
} from 'lucide-react';
import { KEYEVENT } from '../types/KeyEvent';

// 1. Bộ Icon tương ứng với type
const nodeIcons: Record<string, React.ReactNode> = {
  screen_on: <Monitor size={14} />,
  wait: <Timer size={14} />,
  finish: <PowerOff size={14} />,
  tap_xy: <MousePointer2 size={14} />,
  tap_xpath: <Search size={14} />,
  type_text: <Type size={14} />,
  paste: <ClipboardPaste size={14} />,
  copy: <Copy size={14} />,
  key_event: <TextCursorInput size={14} />,
  check_ui: <Search size={14} />,
  set_var: <Variable size={14} />,
  random: <Shuffle size={14} />,
  open_app: <AppWindow size={14} />,
  close_app: <XSquare size={14} />,
  install_apk: <Download size={14} />,
  push_file: <Files size={14} />,
  delete_file: <Trash2 size={14} />,
  opencv_find_and_tap: <ScanSearch size={14} className="text-purple-500" />,
  // Dùng icon Play từ lucide-react, thêm fill để nổi bật
  start: <Play size={14} className="fill-emerald-600 text-emerald-600" />
};

export const ActionNode = ({ data }: any) => {
  const { isActive } = data; // Nhận biến trạng thái chạy
  const isStartNode = data.type === 'start';

  

  return (
    <div className={`min-w-47.5 bg-white border-2 ${isActive 
        ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-105 z-50' 
        : 'border-slate-100 shadow-xl'} ${isStartNode ? 'border-emerald-400 shadow-emerald-100' : 'border-slate-100'} shadow-xl rounded-2xl overflow-hidden group transition-all hover:border-blue-400 hover:shadow-2xl`}>
      
      {/* Header của Node */}
      <div className={`${isStartNode ? 'bg-emerald-50' : 'bg-slate-50'} px-3 py-2 border-b border-slate-100 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div>{nodeIcons[data.type] || <Smartphone size={14} />}</div>
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">
            {data.label}
          </span>
        </div>
        {!isStartNode && <Edit3 size={10} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
      </div>

      {/* Body - Các ô nhập liệu */}
      <div className="p-3 bg-white space-y-3">
        {data.type === 'tap_xy' && (
          <div className="flex gap-2">
            <InputField label="X COORD" value={data.x} placeholder="500" />
            <InputField label="Y COORD" value={data.y} placeholder="1200" />
          </div>
        )}

        {data.type === 'wait' && (
          <InputField label="DELAY (MS)" value={`${data.ms_min ||0} , ${data.ms_max || 0}`}   placeholder="1000 , 10000" type="text" />
        )}

        {data.type === 'open_app' && (
          <InputField label="PACKAGE NAME" value={data.package} placeholder="com.shopee.vn" />
        )}

        {data.type === 'close_app' && (
          <InputField label="PACKAGE NAME" value={data.package_close} placeholder="com.shopee.vn" />
        )}

        {data.type === 'key_event' && (
          <InputField label="KEY:" value={KEYEVENT.find(key => key.value == data.key_event)?.label} placeholder="" />
        )}
        {data.type === 'install_apk' && (
          <InputField label="PATH:" value={data.path_apk_install} placeholder="Chọn đường dẫn...." />
        )}
        {data.type === 'opencv_find_and_tap' && (
          <div className="flex gap-2">
            <InputField label="TÊN ẢNH" value={data.templateName} placeholder="icon_tivi.png" />
            <InputField label="ĐỘ CHÍNH XÁC" value={data.threshold} placeholder="0.7" />
            <InputField label="CHẾ ĐỘ" value={data.mode} placeholder="icon" />

          </div>
        )}

        

        {isStartNode && <p className="text-[9px] text-slate-400 italic text-center py-1 font-medium">Bắt đầu luồng điều khiển</p>}
      </div>

      {/* Điểm nối Dây (Handles) */}
      {!isStartNode && (
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-white shadow-sm hover:scale-125 transition-transform" />
      )}
      {data.type !== 'finish' && (
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-2 border-white shadow-sm hover:scale-125 transition-transform" />
      )}
    </div>
  );
};

// Component con Helper để tái sử dụng giao diện Input cho đẹp
const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="flex-1">
    <label className="text-[8px] text-slate-400 font-black block ml-1 mb-1 tracking-widest">{label}</label>
    <input 
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} 
      className="w-full text-[10px] font-bold bg-slate-50 border border-slate-100 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:font-normal placeholder:text-slate-300" 
    />
  </div>
);