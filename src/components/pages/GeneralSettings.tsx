import { useState, useEffect } from "react";
import { 
  Database,
  CheckCircle2,
  Loader2,
  Globe,
  Zap,
  ShieldCheck,
  Plus,
  Trash2,
  Settings2,
  MonitorSmartphone,
  Sparkles,

  CircleCheck,
  Settings,
  Folder
} from "lucide-react";
import toast from "react-hot-toast";
import { AppSettings } from "../../types/Setting";

// 1. Cập nhật Interface: Profile giờ là Object thay vì String






const DEFAULT_SETTINGS: AppSettings = {
  gpm_api_key: "",
  omo_api_key: "",
  gemini_api_keys: [],
  grok_profiles: [],
  veo_profiles: [],
  path_storage_video: "C:\\Users\\Admin\\Desktop\\STORAGEVIDEO"
};

export const GeneralSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  // States cho Form Thêm Mới
  const [newGeminiKey, setNewGeminiKey] = useState("");
  const [grokForm, setGrokForm] = useState({ id: "", name: "" });
  const [veoForm, setVeoForm] = useState({ id: "", name: "" });
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [checkingGPM, setCheckingGPM] = useState(false);

  // 2. Load & Migrate Data
  useEffect(() => {
    const saved = localStorage.getItem("minmin_app_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // 🚀 Migration: Nếu bản cũ lưu profile dạng mảng chữ ["1", "2"], tự động convert sang Object
        const normalizedGrok = parsed.grok_profiles?.map((p: any) => 
          typeof p === 'string' ? { id: p, name: `Grok P-${p}` } : p
        ) || [];

        const normalizedVeo = parsed.veo_profiles?.map((p: any) => 
          typeof p === 'string' ? { id: p, name: `Veo P-${p}` } : p
        ) || [];

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          grok_profiles: normalizedGrok,
          veo_profiles: normalizedVeo
        });
      } catch (e) {
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setIsLoaded(true);
  }, []);

  // 3. Auto-save
  useEffect(() => {
    if (!isLoaded) return; 
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      localStorage.setItem("minmin_app_settings", JSON.stringify(settings));
      setSaveStatus("saved");
    }, 500);
    return () => clearTimeout(timer);
  }, [settings, isLoaded]);

  const handleCheckGPM = async () => {
    if (!settings.gpm_api_key.trim()) return toast.error("Nhập API Key GPM kìa!");
    setCheckingGPM(true);
    try {
      // @ts-ignore
      const res = await window.electronAPI.checkGpmConnection(settings.gpm_api_key);
      if (res.success) toast.success("Tuyệt vời! Kết nối GPM thành công.");
      else toast.error(`Lỗi GPM: ${res.message}`);
    } catch (error) { toast.error("Mất kết nối GPM!"); } 
    finally { setCheckingGPM(false); }
  };

  const addGeminiKey = () => {
    if (!newGeminiKey.trim()) return;
    setSettings({ ...settings, gemini_api_keys: [...settings.gemini_api_keys, newGeminiKey.trim()] });
    setNewGeminiKey("");
  };

  // 4. Hàm thêm Profile chuyên biệt
  const addProfile = (type: 'grok' | 'veo') => {
    const form = type === 'grok' ? grokForm : veoForm;
    const id = form.id.trim();
    const name = form.name.trim() || `${type === 'grok' ? 'Grok' : 'Veo'} P-${id}`; // Tự tạo tên nếu để trống

    if (!id) return toast.error("Không được để trống ID Profile!");

    // Check trùng lặp ID
    const targetList = type === 'grok' ? settings.grok_profiles : settings.veo_profiles;
    if (targetList.find(p => p.id === id)) {
      return toast.error(`Profile ID ${id} đã tồn tại trong danh sách!`);
    }

    if (type === 'grok') {
      setSettings({ ...settings, grok_profiles: [...settings.grok_profiles, { id, name }] });
      setGrokForm({ id: "", name: "" });
    } else {
      setSettings({ ...settings, veo_profiles: [...settings.veo_profiles, { id, name }] });
      setVeoForm({ id: "", name: "" });
    }
  };

  const removeProfile = (type: 'grok' | 'veo', index: number) => {
    if (type === 'grok') {
      setSettings({ ...settings, grok_profiles: settings.grok_profiles.filter((_, i) => i !== index) });
    } else {
      setSettings({ ...settings, veo_profiles: settings.veo_profiles.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen overflow-y-auto pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Settings2 className="text-blue-600" /> Cấu Hình Hệ Thống
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quản lý API Keys & Tài nguyên dùng chung</p>
          </div>
            
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
            {saveStatus === "saving" ? (
              <><Loader2 size={14} className="animate-spin text-blue-500" /> <span className="text-xs font-bold text-slate-500">Đang lưu...</span></>
            ) : (
              <><CheckCircle2 size={14} className="text-green-500" /> <span className="text-xs font-bold text-slate-500">Đã lưu tự động</span></>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
           {/* Card: CAUHINHCHUNG */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Settings size={14} className="text-red-500" /> CẤU HÌNH CHUNG
            </h2>
            
            <div className="flex flex-row sm:flex-row gap-3  p-3 rounded-2xl ">
              <div className="flex-1 space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase">
                Folder Kho Lưu Trữ Video
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.path_storage_video}
                  onChange={(e) =>
                  setSettings({...settings,path_storage_video:e.target.value })
                  }
                  placeholder="D:\Output\Videos"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  onClick={async () => {
                    //@ts-ignore
                    const result = await window.electronAPI.selectFolder();
                    if (result)
                    setSettings({...settings,path_storage_video:result })
                  }}
                  className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500"
                >
                  <Folder size={18} />
                </button>
              </div>
              </div>
              
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {settings.veo_profiles.map((profile, idx) => (
                <div key={profile.id} className="flex items-center justify-between p-3 bg-purple-50/50 border border-purple-100 rounded-xl group hover:border-purple-300 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700">{profile.name}</span>
                    <span className="text-[10px] font-bold text-purple-600">ID GPM: {profile.id}</span>
                  </div>
                  <button onClick={() => removeProfile('veo', idx)} className="text-purple-300 hover:text-red-500 transition-all p-2 bg-white rounded-lg shadow-sm">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
          {/* Card: API KEYS CƠ BẢN */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-500" /> API Connections
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">API Key GPM Login</label>
                <div className="flex gap-2">
                  <div className="relative group flex-1">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input 
                      type="text"
                      value={settings.gpm_api_key}
                      onChange={(e) => setSettings({...settings, gpm_api_key: e.target.value})}
                      placeholder="http://127.0.0.1:19995"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    />
                  </div>
                  <button 
                    onClick={handleCheckGPM}
                    disabled={checkingGPM}
                    className="px-4 py-3.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {checkingGPM ? <Loader2 size={18} className="animate-spin" /> : <CircleCheck size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">API Key OmoCaptcha</label>
                <div className="relative group">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={16} />
                  <input 
                    type="text"
                    value={settings.omo_api_key}
                    onChange={(e) => setSettings({...settings, omo_api_key: e.target.value})}
                    placeholder="Dán API Key OmoCaptcha..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-300 transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Card: GOOGLE GEMINI KEYS */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Database size={14} className="text-blue-500" /> Gemini API Keys
            </h2>
            
            <div className="flex gap-2">
              <input 
                type="text"
                value={newGeminiKey}
                onChange={(e) => setNewGeminiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGeminiKey()}
                placeholder="Thêm Key Gemini mới..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium outline-none focus:border-blue-300 transition-all"
              />
              <button 
                onClick={addGeminiKey}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {settings.gemini_api_keys.map((key, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                  <span className="text-[10px] font-mono text-slate-600 truncate max-w-[200px]">{key}</span>
                  <button onClick={() => {
                    const newKeys = settings.gemini_api_keys.filter((_, i) => i !== idx);
                    setSettings({ ...settings, gemini_api_keys: newKeys });
                  }} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Card: GROK PROFILES */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <MonitorSmartphone size={14} className="text-sky-500" /> Grok Profiles (X.AI)
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input 
                type="text"
                value={grokForm.id}
                onChange={(e) => setGrokForm({...grokForm, id: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && addProfile('grok')}
                placeholder="Profile ID"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:border-sky-300 transition-all"
              />
              <input 
                type="text"
                value={grokForm.name}
                onChange={(e) => setGrokForm({...grokForm, name: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && addProfile('grok')}
                placeholder="Tên gợi nhớ (Không bắt buộc)"
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:border-sky-300 transition-all"
              />
              <button 
                onClick={() => addProfile('grok')}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> THÊM
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {settings.grok_profiles.map((profile, idx) => (
                <div key={profile.id} className="flex items-center justify-between p-3 bg-sky-50/50 border border-sky-100 rounded-xl group hover:border-sky-300 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700">{profile.name}</span>
                    <span className="text-[10px] font-bold text-sky-600">ID GPM: {profile.id}</span>
                  </div>
                  <button onClick={() => removeProfile('grok', idx)} className="text-sky-300 hover:text-red-500 transition-all p-2 bg-white rounded-lg shadow-sm">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Card: VEO 3.1 PROFILES */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={14} className="text-purple-500" /> Google Veo 3.1 Profiles
            </h2>
            <p>COMMING SOON</p>
            <div className="hidden flex flex-col sm:flex-row gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input 
                type="text"
                value={veoForm.id}
                onChange={(e) => setVeoForm({...veoForm, id: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && addProfile('veo')}
                placeholder="Profile ID"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:border-purple-300 transition-all"
              />
              <input 
                type="text"
                value={veoForm.name}
                onChange={(e) => setVeoForm({...veoForm, name: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && addProfile('veo')}
                placeholder="Tên gợi nhớ (Không bắt buộc)"
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:border-purple-300 transition-all"
              />
              <button 
                onClick={() => addProfile('veo')}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-black text-xs hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> THÊM
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {settings.veo_profiles.map((profile, idx) => (
                <div key={profile.id} className="flex items-center justify-between p-3 bg-purple-50/50 border border-purple-100 rounded-xl group hover:border-purple-300 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700">{profile.name}</span>
                    <span className="text-[10px] font-bold text-purple-600">ID GPM: {profile.id}</span>
                  </div>
                  <button onClick={() => removeProfile('veo', idx)} className="text-purple-300 hover:text-red-500 transition-all p-2 bg-white rounded-lg shadow-sm">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};