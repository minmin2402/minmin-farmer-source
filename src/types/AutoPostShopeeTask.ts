export interface AutoShopeeTask {
  id: number;
  serial: string;
  note: string;
  workflow: string;
  videoPath: string;
  affiliate:string;
  title:string;
  status: "pending" | "error" | "done" | "running";
}