import React, { useEffect, useState } from "react";
import { DOMParser } from "xmldom";
import { X, Copy, MousePointer2, Smartphone } from "lucide-react";

export const UIInspectorModal = ({
  deviceId,
  screenshotUrl,
  onClose,
  onSelectXPath,
  onSelectXY,
  mode,
}: any) => {
  const [elements, setElements] = useState<any[]>([]);
  const [hoveredElement, setHoveredElement] = useState<any>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [generatedXPath, setGeneratedXPath] = useState("");
  const [coordsSelected, setCoordsSelected] = useState({x:0,y:0});

  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [realImageSize, setRealImageSize] = useState({ width: 0, height: 0 });

  const getImageDimensions = (
    base64: string,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = base64;
    });
  };

  // 1. Logic Phân tích XML và tự động lấy độ phân giải
  useEffect(() => {
    const fetchAndParseUI = async () => {
      setLoading(true);
      setIsReady(false); // Thêm state này để ẩn UI lúc đang tính toán

      try {
        // 1. Lấy kích thước THẬT từ ảnh chụp trước (Đây là mốc chuẩn nhất)
        const { width: imgW, height: imgH } =
          await getImageDimensions(screenshotUrl);

        // 2. Dump XML từ thiết bị

        if (mode == "xpath") {
          // @ts-ignore
          const xmlString = await window.electronAPI.dumpUi(deviceId);
          if (!xmlString) {
            alert(
              "Không thể lấy dữ liệu UI! Hãy đảm bảo màn hình máy đang bật.",
            );
            onClose();
            return;
          }
          const doc = new DOMParser().parseFromString(xmlString, "text/xml");
          const nodes = doc.getElementsByTagName("node");
          const parsedElements = [];

          // Lấy tọa độ từ XML
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const bounds = node.getAttribute("bounds");
            if (bounds) {
              const rect = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
              if (rect) {
                parsedElements.push({
                  id: i,
                  x1: parseInt(rect[1]),
                  y1: parseInt(rect[2]),
                  x2: parseInt(rect[3]),
                  y2: parseInt(rect[4]),
                  resourceId: node.getAttribute("resource-id"),
                  text: node.getAttribute("text"),
                  contentDesc: node.getAttribute("content-desc"),
                  className: node.getAttribute("class"),
                  clickable: node.getAttribute("clickable") === "true",
                });
              }
            }
          }

          // 3. Cập nhật State MỘT LẦN DUY NHẤT 🚀

          setElements(parsedElements);
        } else if (mode == "coords") {
        }
        setRealImageSize({ width: imgW, height: imgH }); // Dùng để làm viewBox và AspectRatio
        setIsReady(true); // Đánh dấu đã sẵn sàng để hiện Modal
      } catch (error) {
        console.error("Lỗi parse UI:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseUI();
  }, [deviceId, screenshotUrl, mode]);

  // 2. Logic tạo XPath thông minh (Dành cho Shopee)
  const handleSelectElement = (el: any) => {
    setSelectedElement(el);

    let xpath = "";

    // 1. Trường hợp lý tưởng: Có ID và có nội dung phân biệt (Text hoặc Content-Desc)
    if (el.resourceId && el.resourceId !== "null") {
      if (
        el.contentDesc &&
        el.contentDesc !== "" &&
        el.contentDesc !== "null"
      ) {
        // Kết hợp ID và Mô tả (Ví dụ: Icon Shopee)
        xpath = `//*[@resource-id="${el.resourceId}" and @content-desc="${el.contentDesc}"]`;
      } else if (el.text && el.text !== "") {
        // Kết hợp ID và Chữ hiển thị
        xpath = `//*[@resource-id="${el.resourceId}" and @text="${el.text}"]`;
      } else {
        // Nếu chỉ có mỗi ID, buộc phải dùng thêm Index (nhưng cách này hơi yếu)
        xpath = `//*[@resource-id="${el.resourceId}"]`;
      }
    }
    // 2. Trường hợp không có ID nhưng có mô tả (Rất phổ biến ở nút Icon)
    else if (el.contentDesc && el.contentDesc !== "") {
      xpath = `//*[@content-desc="${el.contentDesc}"]`;
    }
    // 3. Trường hợp chỉ có Text
    else if (el.text && el.text !== "") {
      xpath = `//*[@text="${el.text}"]`;
    }
    // 4. Fallback cuối cùng: Dùng Class
    else {
      xpath = `//${el.className}`;
    }

    setGeneratedXPath(xpath);
  };
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Chỉ cho phép click khi ở chế độ coords và đã load xong ảnh
    if (mode !== "coords" || !isReady) return;

    // 2. Lấy khung chứa ảnh hiện tại (vị trí trên màn hình máy tính)
    const rect = e.currentTarget.getBoundingClientRect();

    // 3. Tọa độ click chuột so với mép của cái khung ảnh
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 4. TÍNH TỶ LỆ VÀNG 🚀
    // Ví dụ: Ảnh thật 1080px, nhưng trên máy tính bạn chỉ hiện 300px
    const scaleX = realImageSize.width / rect.width;
    const scaleY = realImageSize.height / rect.height;

    // 5. Tọa độ thực tế trên điện thoại
    const realX = Math.round(clickX * scaleX);
    const realY = Math.round(clickY * scaleY);

    console.log(`[Inspector] Đã chấm tọa độ: ${realX}, ${realY}`);

    setCoordsSelected({x:realX,y:realY})
  };

  return (
    <div className="fixed inset-0 bg-slate-950/98 z-100 flex animate-in fade-in duration-300">
      {/* VÙNG HIỂN THỊ MÀN HÌNH (BÊN TRÁI) */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-hidden">
        {/* Thanh trạng thái nhỏ trên đầu màn hình điện thoại */}
        <div className="absolute top-6 flex items-center gap-3 text-slate-500 bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-800">
          <Smartphone
            size={14}
            className={loading ? "animate-pulse text-emerald-500" : ""}
          />
          <span className="text-[10px] font-black uppercase tracking-widest font-mono">
            {loading
              ? "Sycning UI..."
              : `${deviceId} (${realImageSize.width}x${realImageSize.height})`}
          </span>
        </div>

        {/* KHUNG ĐIỆN THOẠI CHÍNH */}
        {isReady && (
          <div
            className={`${mode === "coords" ? "cursor-crosshair" : ""} relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border-8 border-slate-800 rounded-2xl overflow-hidden bg-black flex items-center justify-center transition-all duration-500`}
            style={{
              aspectRatio: `${realImageSize.width} / ${realImageSize.height}`,
              maxHeight: "100%",
              maxWidth: "100%",
            }}
            onClick={handleImageClick}
          >
            {/* Ảnh chụp màn hình */}
            <img
              src={screenshotUrl}
              // 🚀 ĐỔI contain THÀNH fill VÀ THÊM block pointer-events-none
              className="w-full object-fill select-none pointer-events-none block"
              onLoad={() => setLoading(false)}
            />
            {/* CHẾ ĐỘ COORDS: Hiện Badge thông báo */}
            {mode === "coords" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-2xl animate-bounce">
                Nhấp vào màn hình để lấy XY
              </div>
            )}
            {/* LỚP PHỦ SVG (SỬA LỖI KHÔNG CÓ Ô VUÔNG) */}
            {mode == "xpath" && (
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${realImageSize.width} ${realImageSize.height}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {elements.map((el) => (
                  <rect
                    key={el.id}
                    x={el.x1}
                    y={el.y1}
                    width={el.x2 - el.x1}
                    height={el.y2 - el.y1}
                    onClick={() => handleSelectElement(el)}
                    onMouseEnter={() => setHoveredElement(el)}
                    onMouseLeave={() => setHoveredElement(null)}
                    className={`
                  cursor-pointer transition-all duration-150
                  ${el.clickable ? "fill-blue-500/5 stroke-blue-400/30" : "fill-transparent stroke-transparent"}
                  ${hoveredElement?.id === el.id ? "fill-blue-500/20 stroke-yellow-400 stroke-2 z-10" : ""}
                  ${selectedElement?.id === el.id ? "fill-emerald-500/30 stroke-emerald-500 stroke-3 z-20" : ""}
                `}
                  />
                ))}
              </svg>
            )}

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SIDEBAR CHI TIẾT (BÊN PHẢI) */}
      <div className="w-96 bg-white h-full flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.3)] animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="font-black text-slate-800 uppercase tracking-wider text-sm">
              UI Inspector
            </h2>
            <span className="text-[9px] text-slate-400 font-bold italic">
              Phân tích cấu trúc ứng dụng
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl text-slate-400 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selectedElement || (coordsSelected.x !=0 && coordsSelected.y!=0) ? (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              {/* PHẦN XPATH */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  {mode == "xpath" && "XPath Đã Chọn"}
                  {mode == "coords" && "Toạ Độ Đã Chọn"}
                </h3>
                <div className="bg-[#0f172a] rounded-2xl p-4 font-mono text-[11px] text-emerald-400 break-all shadow-inner border border-slate-800 leading-relaxed text-left">
                  {mode == "xpath" && generatedXPath}
                  {mode == "coords" && `${coordsSelected.x || ""} , ${coordsSelected.y || ""}`}
                </div>
                {mode == "xpath" && (
                  <button
                    onClick={() => onSelectXPath(generatedXPath)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 font-black text-xs shadow-xl shadow-blue-200 transition-all active:scale-95"
                  >
                    <Copy size={18} /> Sử dụng XPath này
                  </button>
                )}
                {mode == "coords" && (
                  <button
                    onClick={() => onSelectXY(coordsSelected.x,coordsSelected.y)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 font-black text-xs shadow-xl shadow-blue-200 transition-all active:scale-95"
                  >
                    <Copy size={18} /> Sử dụng Toạ Độ này
                  </button>
                )}
              </div>

              {/* PHẦN THUỘC TÍNH CHI TIẾT */}
              {mode == "xpath" && (
                <div className="space-y-3 pt-6 border-t border-slate-50">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Thuộc tính phần tử
                  </h3>
                  <div className="space-y-2">
                    <AttributeRow
                      label="Resource-ID"
                      value={selectedElement.resourceId}
                    />
                    <AttributeRow
                      label="Content-Desc"
                      value={selectedElement.contentDesc}
                    />
                    <AttributeRow label="Text" value={selectedElement.text} />
                    <AttributeRow
                      label="Class"
                      value={selectedElement.className}
                    />
                    <AttributeRow
                      label="Clickable"
                      value={selectedElement.clickable ? "TRUE" : "FALSE"}
                      color={
                        selectedElement.clickable
                          ? "text-emerald-500"
                          : "text-slate-400"
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 p-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <MousePointer2
                  size={32}
                  strokeWidth={1.5}
                  className="text-slate-200"
                />
              </div>
              <p className="text-[11px] font-bold text-center leading-relaxed">
                Rê chuột và click vào các ô vuông xanh trên màn hình để trích
                xuất XPath
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component phụ hiển thị dòng thuộc tính cho đẹp
const AttributeRow = ({ label, value, color = "text-slate-700" }: any) => (
  <div className="flex flex-col gap-1 text-left p-2 hover:bg-slate-50 rounded-lg transition-colors">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
      {label}
    </span>
    <span className={`text-[10px] font-bold break-all ${color}`}>
      {value || <span className="opacity-20 italic">null</span>}
    </span>
  </div>
);
