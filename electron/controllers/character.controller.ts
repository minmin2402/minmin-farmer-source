import { ipcMain, app } from 'electron';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Nhớ import đúng đường dẫn service của ông nhé
import { GrokService } from '../services/grok.service';

import { GrokProfileManager } from '../manager/ProfileManager';
import { logger } from '../utils/logger';
import { gpmService } from '../services/gpm.service';

export function registerCharacterHandlers() {
  const characterDir = path.join(app.getPath('userData'), "configs", "characters");

  // Đảm bảo thư mục luôn tồn tại khi file này được load
  if (!fs.existsSync(characterDir)) {
    fs.mkdirSync(characterDir, { recursive: true });
  }

  // 1. Handler lấy danh sách nhân vật
  ipcMain.handle('character:list', async () => {
    try {
      const files = fs.readdirSync(characterDir);
      const characters = files
        .filter(f => f.endsWith('.json'))
        .map(f => JSON.parse(fs.readFileSync(path.join(characterDir, f), 'utf-8')));
        
      return characters.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error("Lỗi lấy danh sách nhân vật:", error);
      return [];
    }
  });

  // 2. Handler tạo nhân vật (🚀 Đã thêm profileId và omoApiKey)
  ipcMain.handle('character:generate', async (_event, { name, prompt, engine, model, profileId, urlGpm }) => {
    const charId = uuidv4().substring(0, 8).toUpperCase(); 
    
    // 🚀 Check chặn nếu không có profile
    if (!profileId) {
      return { success: false, message: "Ông giáo chưa chọn Profile kìa!" };
    }

    try {
      let imagePath = "";
      
      // Gọi AI vẽ ảnh
      if (engine === 'grok') {
        const grokManager = new GrokProfileManager([profileId])
        const grok = new GrokService();
        // 🚀 Bơm profileId vào đây, bỏ cái số "1" đi
        const sendLog = async (taskId:string,status:string = 'processing',log:string= "") =>{
            logger.info(`${taskId}-${status}-${log}`)
        }
        await grok.initHeaderGrok(sendLog, charId, grok, grokManager,new gpmService(urlGpm), profileId, 5001, 5);
        const res = await grok.generateReviewVideoImage(sendLog,`--upscale 2k. ${prompt}`, null, profileId, characterDir,false,"", charId);
        if (!res.success) throw new Error("Grok lỗi không vẽ được: " + (res.message || "Unknown error"));
        imagePath = res?.filePath ?? "";
      } else {
        /* // 🚀 Mở lại Veo và bơm đạn vào
        const veo = new VeoService();
        if (!omoApiKey) throw new Error("Thiếu API Key OMOCAPTCHA để giải Veo 3.");

        // 🚀 Gọi Veo với ProfileID và OmoKey
        const fifeUrl = await veo.generateImageVeo(prompt, profileId, omoApiKey); 
        
        imagePath = path.join(characterDir, `char_${charId}.png`);
        await veo.downloadMedia(fifeUrl, imagePath, profileId); */
      }

      const charData = {
        id: charId,
        name: name || `Nhân vật ${charId}`,
        prompt: prompt,
        engine: engine,
        model: model,
        imagePath: imagePath,
        createdAt: Date.now()
      };

      // Ghi ra file JSON
      fs.writeFileSync(path.join(characterDir, `${charId}.json`), JSON.stringify(charData, null, 2));

      return { success: true, data: charData };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  });

  // 3. Handler xóa nhân vật
  ipcMain.handle('character:delete', async (_event, charId) => {
    try {
      const jsonPath = path.join(characterDir, `${charId}.json`);
      if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        // Xóa ảnh trước, xóa JSON sau
        if (data.imagePath && fs.existsSync(data.imagePath)) {
          fs.unlinkSync(data.imagePath); 
        }
        fs.unlinkSync(jsonPath); 
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  });
}