import React, { useRef, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { ArrowUpFromLine } from "lucide-react";
import { VideoTask } from "../../types/VideoTask";
import { AutoShopeeTask } from "../../types/AutoPostShopeeTask";
import { ReelsTask } from "../../types/ReelsTask";

interface ExcelImportProps {
  onImportSuccess: (tasks: VideoTask[]) => void;
}

interface ExcelImport2Props {
  onImportSuccess: (tasks: AutoShopeeTask[]) => void;
}

interface ExcelImport3Props {
  onImportSuccess: (tasks: ReelsTask[]) => void;
}

export const ExcelImportVideoMKT: React.FC<ExcelImportProps> = ({
  onImportSuccess,
}) => {
  // 🎯 Dùng Ref để điều khiển ô Input ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // Khi nhấn nút HeaderButton, ta giả lập cú click vào input file
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        // Parse Excel sang JSON
        const data = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });

        // Map data về chuẩn Task của ông
        // 2. Map dữ liệu (Bỏ qua dòng 0 nếu đó là dòng tiêu đề, dùng .slice(1))
        const formattedTasks: VideoTask[] = data.slice(1).map((row, index) => {
          // Cột A: row[0] (URL)
          // Cột B: row[1] (Số lượng)
          // Cột C: row[2] (Chế độ)

          const rawUrl = String(row[0] || "").trim();
          const rawName = String(row[1] || "");
          const rawDesc = String(row[2] || "");
          const rawPathImg = String(row[3] || "").trim();
          const rawAIImg = String(row[4] || "").trim();

          const rawMode = String(row[5] || "").toLowerCase().trim();
          const rawCount = parseInt(row[6]) || 1;
          let mode = "TT + Prompt + Video + Ảnh AI";
          if (rawMode == "1"){
            mode = "Chỉ lấy thông tin sản phẩm"
          }else if (rawMode == "2"){
            mode = "Prompt + Video"
          }else if (rawMode == "3"){
            mode = "Prompt + Ảnh AI + Video"
          }
          
          return {
            id: Date.now() + index,
            productUrl: rawUrl,
            productName: rawName,
            productDesc: rawDesc,
            productPathImg: rawPathImg,
            // Logic cột C: Nếu chứa chữ 'video' thì set mode full, ngược lại chỉ lấy info
            mode: mode as | "Chỉ lấy thông tin sản phẩm"
                          | "Prompt + Ảnh AI + Video"
                          | "TT + Prompt + Video + Ảnh AI"
                          | "Prompt + Video",
            outputCount: rawCount,
            status: "none",
            log: "",
            aiImagePath: rawAIImg,
            finalVideoPath: "",
            prompt: "",
            resultVideoCount: null,
          };
        });
        // Chỉ lấy những dòng có URL (tránh dòng rác trong Excel)
        const validTasks = formattedTasks.filter(
          (t) => t.productUrl.trim() !== "",
        );

        onImportSuccess(validTasks);

        // Reset input để có thể chọn lại chính file đó nếu cần sửa
        e.target.value = "";
      } catch (error) {
        console.error("❌ Lỗi đọc file Excel:", error);
        alert("Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng!");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      {/* Input file ẩn hoàn toàn */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Sử dụng HeaderButton có sẵn của ông */}
      <HeaderColoredButton
        icon={<ArrowUpFromLine size={18} />}
        label="Import Excel"
        bgColor="#5c44e6" // Hoặc màu ông thích
        onClick={handleButtonClick}
      />
    </>
  );
};
export const HeaderActionButton = ({ icon, label, onClick, className }: any) => (
  <button
    onClick={onClick}
    className={` ${className} flex items-center gap-2 text-xs text-blue-600 font-bold px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-slate-50 transition-all`}
  >
    {React.cloneElement(icon, { size: 15 })}
    {label}
  </button>
);

export const ExcelImportAutoPost: React.FC<ExcelImport2Props> = ({
  onImportSuccess,
}) => {
  // 🎯 Dùng Ref để điều khiển ô Input ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // Khi nhấn nút HeaderButton, ta giả lập cú click vào input file
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        // Parse Excel sang JSON
        const data = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });

        // Map data về chuẩn Task của ông
        // 2. Map dữ liệu (Bỏ qua dòng 0 nếu đó là dòng tiêu đề, dùng .slice(1))
        const formattedTasks: AutoShopeeTask[] = data
          .slice(1)
          .map((row, index) => {
            const serial = String(row[0] || "").trim();
            const workflow = String(row[1] || "");
            const videoPath = String(row[2] || "").trim();
            const affiliate = String(row[3] || "").trim();
            const title = String(row[4] || "");

            return {
              id: Date.now() + index,
              serial,
              workflow,
              note: "-",
              videoPath,
              affiliate,
              status: "pending",
              title,
            };
          });
        // Chỉ lấy những dòng có URL (tránh dòng rác trong Excel)
        const validTasks = formattedTasks.filter(
          (t) => t.videoPath.trim() !== "",
        );

        onImportSuccess(validTasks);

        // Reset input để có thể chọn lại chính file đó nếu cần sửa
        e.target.value = "";
      } catch (error) {
        console.error("❌ Lỗi đọc file Excel:", error);
        alert("Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng!");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      {/* Input file ẩn hoàn toàn */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Sử dụng HeaderButton có sẵn của ông */}
      <HeaderColoredButton
        icon={<ArrowUpFromLine size={18} />}
        label="Import Excel"
        bgColor="#5c44e6" // Hoặc màu ông thích
        onClick={handleButtonClick}
      />
    </>
  );
};

export const ExcelImportAutoReels: React.FC<ExcelImport3Props> = ({
  onImportSuccess,
}) => {
  // 🎯 Dùng Ref để điều khiển ô Input ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // Khi nhấn nút HeaderButton, ta giả lập cú click vào input file
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        // Parse Excel sang JSON
        const data = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });

        // Map data về chuẩn Task của ông
        // 2. Map dữ liệu (Bỏ qua dòng 0 nếu đó là dòng tiêu đề, dùng .slice(1))
        const formattedTasks: ReelsTask[] = data.slice(1).map((row, index) => {
          const profile_id = String(row[0] || "").trim();
          const link_page = String(row[1] || "");
          const videoPath = String(row[2] || "").trim();
          const affiliate = String(row[3] || "").trim();
          const description = String(row[4] || "");

          return {
            id: Date.now() + index,
            profile_id,
            link_page,
            note: "-",
            videoPath,
            affiliate,
            description,
            log: "", // Thêm giá trị mặc định
            status: "pending",
          };
        });
        // Chỉ lấy những dòng có URL (tránh dòng rác trong Excel)
        const validTasks = formattedTasks.filter(
          (t) => t.videoPath.trim() !== "",
        );

        onImportSuccess(validTasks);

        // Reset input để có thể chọn lại chính file đó nếu cần sửa
        e.target.value = "";
      } catch (error) {
        console.error("❌ Lỗi đọc file Excel:", error);
        alert("Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng!");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <>
      {/* Input file ẩn hoàn toàn */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Sử dụng HeaderButton có sẵn của ông */}
      <HeaderColoredButton
        icon={<ArrowUpFromLine size={18} />}
        label="Import Excel"
        bgColor="#5c44e6" // Hoặc màu ông thích
        onClick={handleButtonClick}
      />
    </>
  );
};

export const HeaderColoredButton = ({ icon, label, bgColor, onClick }: any) => (
  <button
    onClick={onClick}
    style={{ backgroundColor: bgColor }}
    className="text-white flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
  >
    {React.cloneElement(icon, { size: 15 })}
    {label}
  </button>
);
