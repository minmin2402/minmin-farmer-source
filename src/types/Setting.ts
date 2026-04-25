export interface AppSettings {
  gpm_api_key: string;
  omo_api_key: string;
  gemini_api_keys: string[];
  grok_profiles: ProfileInfo[];
  veo_profiles: ProfileInfo[];
  path_storage_video:string;
}
export interface ProfileInfo {
  id: string;
  name: string;
}