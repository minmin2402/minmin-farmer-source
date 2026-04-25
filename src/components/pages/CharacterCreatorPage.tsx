import { useState, useEffect } from "react";
import {

  Loader2,
  Wand2,
  Trash2,
  Search,
  User,
  Fingerprint,
  MonitorSmartphone,
} from "lucide-react";
import toast from "react-hot-toast";
import { SamplePromptCard } from "../SamplePromptCard";

export const CharacterCreatorPage = () => {
  const [charName, setCharName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [engine, setEngine] = useState("grok"); // grok | banana
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Quản lý Settings chung và Profile được chọn
  const [generalSettings, setGeneralSettings] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState("");

  const loadCharacters = async () => {
    // @ts-ignore
    const list = await window.electronAPI.getCharacters();
    setCharacters(list);
  };

  // 1. Load Settings & Characters
  useEffect(() => {
    loadCharacters();
    const savedSettings = localStorage.getItem("minmin_app_settings");
    if (savedSettings) {
      setGeneralSettings(JSON.parse(savedSettings));
    }
  }, []);

  // 2. Logic: Đổi Profile khi đổi Engine
  useEffect(() => {
    if (!generalSettings) return;
    const profiles = engine === "grok" ? generalSettings.grok_profiles : generalSettings.veo_profiles;
    
    if (profiles && profiles.length > 0) {
      if (!profiles.find((p: any) => p.id === selectedProfile)) {
        setSelectedProfile(profiles[0].id);
      }
    } else {
      setSelectedProfile(""); 
    }
  }, [engine, generalSettings]);

  const handleCreate = async () => {
    if (!charName || !prompt) return toast.error("Nhập tên và miêu tả đã ông giáo ơi!");
    if (!selectedProfile) return toast.error("Chưa chọn Profile GPM kìa!");

    setLoading(true);
    try {
      // @ts-ignore
      const res = await window.electronAPI.generateCharacter({
        name: charName,
        prompt,
        engine,
        model: engine === "banana" ? "Imagen 3 Pro" : "Grok Imagine",
        profileId: selectedProfile,
        omoApiKey: generalSettings?.omo_api_key || "",
        urlGpm: generalSettings?.gpm_api_key || ""
      });

      if (res.success) {
        toast.success(`Tạo thành công ${charName}!`);
        setCharName("");
        loadCharacters();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error("Lỗi vẽ ảnh!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xóa nhân vật này nhé?")) {
      // @ts-ignore
      await window.electronAPI.deleteCharacter(id);
      loadCharacters();
      toast.success("Đã tiễn biệt nhân vật!");
    }
  };

  const currentProfilesList = engine === "grok" ? generalSettings?.grok_profiles || [] : generalSettings?.veo_profiles || [];

  return (
    <div className="flex-1 p-8 bg-slate-50 h-screen overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
          <User className="text-purple-500" /> Quản Lý Nhân Vật AI
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* CỘT TRÁI: FORM TẠO MỚI */}
        <div className="col-span-12 lg:col-span-5 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            {/* 1. TÊN NHÂN VẬT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tên nhân vật
              </label>
              <input
                type="text"
                value={charName}
                onChange={(e) => setCharName(e.target.value)}
                placeholder="Ví dụ: Nữ Reviewer Áo Dài"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* 2. PROMPT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Miêu tả chi tiết (Prompt)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Mô tả ngoại hình, trang phục, bối cảnh..."
                className="w-full h-32 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-100 resize-none"
              />
            </div>

            {/* 3. ENGINE SELECTION */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <EngineButton
                label="VEO 3.1"
                active={engine === "banana"}
                onClick={() => setEngine("banana")}
                color="purple"
              />
              <EngineButton
                label="GROK"
                active={engine === "grok"}
                onClick={() => setEngine("grok")}
                color="blue"
              />
            </div>

            {/* 4. CHỌN PROFILE THỰC THI (ĐÂY LÀ CÁI ÔNG ĐANG TÌM) */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                <MonitorSmartphone size={12} className={engine === "grok" ? "text-blue-500" : "text-purple-500"} />
                Profile thực thi ({engine === "grok" ? "Grok" : "Veo 3.1"})
              </label>

              <div className="relative">
                <select
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  className={`w-full p-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl shadow-sm outline-none appearance-none cursor-pointer focus:ring-2 ${engine === "grok" ? "focus:ring-blue-100 focus:border-blue-500 text-blue-700" : "focus:ring-purple-100 focus:border-purple-500 text-purple-700"}`}
                >
                  {currentProfilesList.length === 0 ? (
                    <option value="" disabled>Chưa có profile nào (Vào Settings thêm)</option>
                  ) : (
                    currentProfilesList.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <span className="text-[10px] text-slate-400">▼</span>
                </div>
              </div>
            </div>

            {/* 5. NÚT VÍT GA */}
            <button
              onClick={handleCreate}
              disabled={loading || !selectedProfile}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
              {loading ? "ĐANG VẼ..." : "TẠO NHÂN VẬT"}
            </button>
          </div>
          <SamplePromptCard/>
        </div>

        {/* CỘT PHẢI: THƯ VIỆN NHÂN VẬT */}
        <div className="col-span-12 lg:col-span-7 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              Thư viện ({characters.length})
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Tìm tên..."
                className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-xs outline-none w-48"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 flex-wrap overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 gap-6 custom-scrollbar">
            {characters.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((char) => (
                <div key={char.id} className="group h-125 relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-purple-300 transition-all">
                  <div className="aspect-3/4 relative overflow-hidden">
                    <img src={`file://${char.imagePath}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={char.name} />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-black text-white flex items-center gap-1">
                      <Fingerprint size={8} /> {char.id}
                    </div>
                    <button onClick={() => handleDelete(char.id)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] font-black text-slate-800 truncate uppercase">{char.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{char.engine}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EngineButton = ({ label, active, onClick, color }: any) => (
  <button onClick={onClick} className={`py-3 rounded-xl border-2 font-black text-[10px] transition-all ${ active ? `border-${color}-500 bg-${color}-50 text-${color}-700` : "border-slate-100 text-slate-400 hover:border-slate-200" }`}>
    {label}
  </button>
);