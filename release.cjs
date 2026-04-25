const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline-sync');

const changelogPath = './src/resources/changelog.json'; // Điều chỉnh path cho đúng cấu trúc folder của bạn

const version = readline.question('Version moi (vd: 1.0.6): ');
const logs = readline.question('Noi dung update (cach nhau bang dau phay): ');

const newEntry = {
  version: version,
  date: new Date().toISOString().split('T')[0],
  content: logs.split(',').map(s => s.trim())
};

// Cập nhật Changelog
const changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'));
changelog.unshift(newEntry);
fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2));

// Cập nhật Package.json
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
pkg.version = version;
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

// Git tự động
try {
  execSync(`git add .`);
  execSync(`git commit -m "release: v${version}"`);
  execSync(`git tag v${version}`);
  
  // 🔥 Thêm dòng này để tự đẩy code và tag lên luôn
  console.log("🚀 Đang đẩy code và tag lên GitHub...");
  execSync(`git push origin main`);
  execSync(`git push origin --tags`);
  
  console.log(`✅ Tuyệt vời! Version ${version} đã lên sóng.`);
} catch (e) {
  console.log("❌ Lỗi Git (Có thể do chưa cấu hình remote), nhưng file JSON đã lưu!");
}