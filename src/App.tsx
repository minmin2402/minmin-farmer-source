import { useState } from "react";
import { Sidebar } from "./components/core/Sidebar";
import { WorkflowEditor } from "./components/pages/WorkflowEditor";
import { DeviceList } from "./components/pages/DeviceList";
import { AboutPage } from "./components/pages/AboutPage";
import { VideoAiGrok } from "./components/pages/VideoAiGrok";
import { AutoShopee } from "./components/pages/AutoShopee";
import { VideoMarketingPage } from "./components/pages/VideoMarketing";
import { Toaster } from 'react-hot-toast';


function App() {
  // Trạng thái để biết đang ở tab nào: 'devices', 'workflow', hoặc 'shopee'
  const [activeTab, setActiveTab] = useState("about");

  return (
    <>
    <Toaster position="bottom-right" reverseOrder={false} />
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar nhận thêm props để điều hướng */}
      <Sidebar currentTab={activeTab} onTabChange={setActiveTab} />

      {/* Hiển thị nội dung tương ứng với Tab */}
      {activeTab === "devices" && <DeviceList />}
      
      {activeTab === "workflow" && <WorkflowEditor />}

      {activeTab === "auto_shopee" && (
        <div className="flex-1 flex items-center justify-center">
          <AutoShopee/>
        </div>
      )}
      {/* {activeTab === "reels_facebook" && (
        <div className="flex-1 flex items-center justify-center">
          <ReelsFacebook/>
        </div>
      )} */}

      {activeTab === "about" && (
        <div className="flex-1 flex items-center justify-center  ">
          <AboutPage/>
        </div>
      )}
      {activeTab === "video_ai_grok" && (
        <div className="flex-1 flex items-center justify-center  ">
          <VideoAiGrok/>
        </div>
      )}
      {activeTab === "video_marketing" && (
      
          <VideoMarketingPage/>
       
      )}
    </div>
    </>
    
  );
}

export default App;