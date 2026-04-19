export interface ReelsTask {
  id: number;
  profile_id: string;
  note: string;
  link_page: string;
  videoPath: string;
  affiliate:string;
  description:string;
  log:string;
  status: "pending" | "error" | "done" | "running";
}

export interface ConfigReels {
  thread: number;
  api_gpm: string;
  delay_between: number;
}