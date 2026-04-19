type TaskMode = 
  | 'TT + Prompt + Video + Ảnh AI' 
  | 'Chỉ lấy thông tin sản phẩm' 
  | 'Prompt + Ảnh AI + Video' 
  | 'Prompt + Video'; // Thêm dòng này

export interface VideoTask {
  id: number;
  productUrl: string;
  productName: string;
  productPathImg: string;
  productDesc: string;
  prompt:string;
  aiImagePath:string;
  finalVideoPath:string;
  mode: TaskMode;
  outputCount: number;
  resultVideoCount: number | null;
  log: string;
  status: "error" | "processing" | "success" | "none";
}