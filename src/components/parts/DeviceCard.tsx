import { useEffect, useRef } from "react";
import JMuxer from "jmuxer";

export const DeviceMirror = ({ deviceId }: { deviceId: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isStarted = useRef(false); // Biến khóa
  useEffect(() => {
    if (isStarted.current) return; // Nếu đã chạy rồi thì thôi
    isStarted.current = true;

    console.log(`🎬 Requesting stream for ${deviceId}`);
    // @ts-ignore
    window.electronAPI.startStream(deviceId);

    // 2. Khởi tạo JMuxer
    const jmuxer = new JMuxer({
      node: videoRef.current!,
      mode: "video",
      flushingTime: 0, // Quan trọng: 0 để hiển thị ngay khi có frame
      clearBuffer: true,
      fps: 30, // Bạn có thể tăng/giảm tùy cấu hình máy
      debug: false,
    });

    // 3. Kết nối WebSocket với đúng ID thiết bị
    const ws = new WebSocket(`ws://localhost:8080?id=${deviceId}`);
    ws.binaryType = "arraybuffer";

    ws.onmessage = (event) => {
      // Nhận H264 thô và đẩy vào decoder
      jmuxer.feed({
        video: new Uint8Array(event.data),
      });
    };

    ws.onerror = (err) => {
      console.error(`[WS Error ${deviceId}]:`, err);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
      jmuxer.destroy();
      console.log(`Stopped stream for: ${deviceId}`);
      isStarted.current = false;
      // ... cleanup ws và jmuxer
    };
  }, [deviceId]);

  return (
    <div className="relative group w-full aspect-9/16 bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800">
      {/* Label hiển thị ID thiết bị */}
      <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity">
        {deviceId}
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
};
