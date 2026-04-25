const bytenode = require('bytenode');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

/**
 * 🔥 DANH SÁCH FILE MUỐN BIẾN THÀNH BYTENODE
 * Bạn chỉ cần nhập tên file (kèm đuôi .js) vào đây.
 * Những file này phải nằm trong folder dist-electron sau khi build.
 */
const filesToBytecode = [
  'main.js',            // Thường là file khởi tạo
  // 'shopee.service.js',  // Ví dụ file logic cào Shopee
  // 'license.js',         // Ví dụ file check bản quyền
];

const distPath = path.join(__dirname, 'dist-electron');

const run = async () => {
  console.log('🛡️  [MinMin Guard] Đang khởi động tiến trình đóng gói nhị phân...');

  for (const fileName of filesToBytecode) {
    const filePath = path.join(distPath, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`\n🔒 Đang xử lý: ${fileName}`);

      try {
        let content = fs.readFileSync(filePath, 'utf8');

        // 1. DỌN DẸP ESM (Bắt buộc để Bytenode không lỗi)
        // Biến các lệnh import/export về dạng CommonJS mà không làm gãy logic
        content = content.replace(/import\.meta\.url/g, "(`file://` + __filename)");
        content = content.replace(/import\s+\*\s+as\s+([\w$]+)\s+from\s+['"]([^'"]+)['"]/g, 'const $1 = require("$2")');
        content = content.replace(/import\s+{([\s\S]+?)}\s+from\s+['"]([^'"]+)['"]/g, (m, p1, p2) => {
          return `const {${p1.replace(/\s+as\s+/g, ': ')}} = require("${p2}")`;
        });
        content = content.replace(/import\s+([\w$]+)\s+from\s+['"]([^'"]+)['"]/g, 'const $1 = require("$2")');
        content = content.replace(/export\s+default\s+/g, "module.exports = ");
        content = content.replace(/export\s+const\s+([\w$]+)\s*=/g, "var $1 = module.exports.$1 =");
        content = content.replace(/export\s+{([\s\S]+?)}/g, "module.exports = {$1}");

        // Ghi đè tạm thời để Bytenode biên dịch
        fs.writeFileSync(filePath, content);

        // 2. BIÊN DỊCH NHỊ PHÂN
        const jscPath = filePath.replace('.js', '.jsc');
        await bytenode.compileFile({
          filename: filePath,
          output: jscPath,
        });

        // 3. KIỂM TRA VÀ TẠO FILE MỒI (LOADER)
        if (fs.existsSync(jscPath)) {
          // Xóa file .js gốc (vì code thật đã nằm trong .jsc)
          fs.unlinkSync(filePath);

          // Tạo lại file .js (hoặc .cjs tùy package.json) làm loader
          // Nếu package.json có type: module, hãy cân nhắc đổi tên file loader thành .cjs
          const loaderCode = `"use strict";\nrequire('bytenode');\nrequire('./${fileName.replace('.js', '.jsc')}');`;
          fs.writeFileSync(filePath, loaderCode);
          
          console.log(`✅ Thành công: ${fileName} -> ${path.basename(jscPath)}`);
        }
      } catch (err) {
        console.error(`❌ Lỗi khi xử lý ${fileName}:`, err.message);
      }
    } else {
      console.warn(`⚠️ Cảnh báo: Không tìm thấy file ${fileName} trong ${distPath}`);
    }
  }

  console.log('\n🚀 [MinMin Guard] Tất cả các file chỉ định đã được bảo vệ!');
  if (app) app.quit();
};

// Chạy bằng Electron engine để khớp V8 version
if (app) {
  app.whenReady().then(run);
} else {
  run();
}