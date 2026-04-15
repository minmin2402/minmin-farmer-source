import { useState, useEffect } from "react";
import {  Monitor, Copy, List, LayoutGrid, RefreshCcwDot } from "lucide-react";
import { Device } from "../../types/Device";
import { HeaderActionButton } from "../tools/Button";
//import { DeviceMirror } from "../parts/DeviceCard";

export const DeviceList = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // Mặc định là list
  const [devices, setDevices] = useState<Device[]>([]);
  const [, setLoading] = useState(false);

  const scanAdbDevices = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      const result = await window.electronAPI.getDevices();
      setDevices(result);
    } catch (error) {
      console.error("Lỗi quét thiết bị:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scanAdbDevices();
  }, []);

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold mb-6">Thiết bị đã kết nối ({devices.length})</h1>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <HeaderActionButton icon={<RefreshCcwDot/>} label="Làm mới" onClick={scanAdbDevices} /* ... *//>
            
            {/* 🆕 Nút chuyển đổi View Mode */}
            <div className="flex bg-slate-100 p-1 rounded-xl ml-4">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 pb-8 overflow-auto">
        {viewMode === 'list' ? (
          <table className="w-full text-left border-collapse bg-white shadow-lg rounded-2xl">
            <thead className="bg-slate-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Số Serial
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Hành động
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {devices.length > 0 ? (
                devices.map((device) => (
                  <tr
                    key={device.id}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-bold text-blue-600 mr-4">
                        {device.id}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(device.id);
            
                        }}
                        className=" text-black hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all 
                  active:scale-90"
                        title="Sao chép ID"
                      >
                        <Copy size={14} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          // @ts-ignore
                          window.electronAPI.openMirror(device.id);
                        }}
                        className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        <Monitor size={14} /> MIRROR
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                          device.status === "device"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-red-50 text-red-600 border border-red-100"
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {device.model}
                    </td>
                    <td className="px-6 py-4 italic text-slate-300 text-sm">
                      Trống...
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-slate-400 italic"
                  >
                    Chưa có thiết bị nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          /* 🆕 GIAO DIỆN GRID VIEW ĐÃ NÂNG CẤP */
          /* GRID VIEW: Sử dụng auto-fill để tự co giãn theo màn hình */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {/* {devices.filter(d => d.status === 'device').map((device) => (
              <DeviceMirror key={device.id} deviceId={device.id} />
            ))}
            
            {devices.length === 0 && (
               <div className="col-span-full py-20 text-center text-slate-400 italic">
                  Không tìm thấy thiết bị nào để hiển thị Grid.
               </div>
            )} */}
          </div>
        )}
      </div>
    </main>
  );
};
