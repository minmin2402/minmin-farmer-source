export interface ReelsTask {
  id: number;
  profile_id: string;
  note: string;
  link_page: string;
  videoPath: string;
  affiliate:string;
  title:string;
  status: "pending" | "error" | "done" | "running";
}