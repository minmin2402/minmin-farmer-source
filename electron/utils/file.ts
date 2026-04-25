import fs from 'fs/promises';


/**
 * Hàm xóa file hoặc folder bất kỳ
 * @param targetPath Đường dẫn tuyệt đối đến file hoặc folder
 */
export const deletePath = async (targetPath: string) => {
  try {
    // Kiểm tra xem đường dẫn có tồn tại không
    const stats = await fs.stat(targetPath);

    if (stats.isDirectory()) {
      // Nếu là folder: xóa đệ quy (recursive) bao gồm cả file bên trong
      await fs.rm(targetPath, { recursive: true, force: true });
      console.log(`✅ Đã xóa folder: ${targetPath}`);
    } else {
      // Nếu là file: xóa file
      await fs.unlink(targetPath);
      console.log(`✅ Đã xóa file: ${targetPath}`);
    }
    return { success: true };
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn(`⚠️ Đường dẫn không tồn tại: ${targetPath}`);
      return { success: false, message: 'Path not found' };
    }
    console.error(`❌ Lỗi khi xóa: ${error.message}`);
    
  }
};

/**
 * Hàm kiểm tra xem file hoặc folder có tồn tại hay không
 * @param targetPath Đường dẫn tuyệt đối đến file hoặc folder
 * @returns true nếu tồn tại, false nếu không tồn tại
 */
export const checkPathExists = async (targetPath: string): Promise<boolean> => {
  try {
    // Dùng fs.access để check xem path có chạm vào được không (nhẹ và nhanh nhất)
    await fs.access(targetPath);
    return true; // Nếu không văng lỗi tức là tồn tại
  } catch (error) {
    // Văng lỗi (thường là ENOENT) tức là không tồn tại
    return false;
  }
};