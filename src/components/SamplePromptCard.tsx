import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

export const SamplePromptCard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const promptText = "Fullbody shot of a handsome 25-year-old Vietnamese man with a natural athletic build, standing confidently on a modern street in Saigon. He has a trendy short textured haircut, clean-shaven face with visible skin pores and realistic skin texture. He is wearing a high-quality white linen shirt with sleeves slightly rolled up, dark navy chinos, and clean white minimalist sneakers. Natural daylight, soft shadows, cinematic atmosphere. Shot on Sony A7R IV, 35mm lens, f/2.8 aperture, sharp focus from head to toe, shallow depth of field with a blurred city background. Ultra-detailed, 8k resolution, photorealistic, authentic lighting, raw photo style, unedited.";

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Tự động reset icon sau 2s
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-2xl">
      {/* Header Thẻ */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles size={16} strokeWidth={2.5} />
          </div>
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wide">
            Prompt Mẫu Siêu Thực (Nam)
          </h3>
        </div>
        
        {/* Nút Copy */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
            isCopied 
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
              : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
          }`}
        >
          {isCopied ? (
            <>
              <Check size={14} strokeWidth={3} /> Đã Copy
            </>
          ) : (
            <>
              <Copy size={14} /> Copy Prompt
            </>
          )}
        </button>
      </div>

      {/* Nội dung Prompt */}
      <div className="relative">
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 text-sm font-medium text-slate-600 leading-relaxed overflow-hidden">
          <p className="line-clamp-4  transition-all duration-300">
            {promptText}
          </p>
        </div>
        
        {/* Lớp mờ (Gradient) khi prompt quá dài, biến mất khi đưa chuột vào */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent group-hover:opacity-0 transition-opacity duration-300 rounded-b-xl pointer-events-none"></div>
      </div>
      
      {/* Ghi chú nhỏ */}
      <p className="text-[10px] font-semibold text-slate-400 mt-3 text-right">
        *Có thể dán trực tiếp vào bảng cấu hình tạo ảnh
      </p>
    </div>
  );
};