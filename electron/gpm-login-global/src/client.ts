/**
 * @file client.ts
 * Core HTTP client and main entry point for the GPMLogin Global API.
 */

import { GroupService }     from './services/GroupService';
import { ProxyService }     from './services/ProxyService';
import { ProfileService }   from './services/ProfileService';
import { ExtensionService } from './services/ExtensionService';

// Định nghĩa kiểu cho các Helper HTTP
export interface HttpHelper {
  get: (path: string) => Promise<any>;
  post: (path: string, body: any) => Promise<any>;
}

/**
 * Resolves the best available `fetch` implementation for the current runtime.
 */
async function resolveFetch(): Promise<typeof fetch> {
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch.bind(globalThis);
  }
  // Dùng cho môi trường Node.js cũ < 18
  const { default: nodeFetch } = await import('node-fetch') as any;
  return nodeFetch as typeof fetch;
}

/**
 * Low-level HTTP helper shared by all services.
 */
function createHttp(baseUrl: string, fetchFn: typeof fetch): HttpHelper {
  async function get(path: string) {
    const res = await fetchFn(`${baseUrl}/${path}`);
    return res.json();
  }

  async function post(path: string, body: any) {
    const res = await fetchFn(`${baseUrl}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  return { get, post };
}

/**
 * Main client for the GPMLogin Global Local API.
 */
export class GPMLoginGlobalClient {
  public groups!: GroupService;
  public proxies!: ProxyService;
  public profiles!: ProfileService;
  public extensions!: ExtensionService;
  public ready: Promise<void>;

  /**
   * @param {string} [baseUrl='http://127.0.0.1:9495']
   */
  constructor(baseUrl: string = 'http://127.0.0.1:9495') {
    const apiBase = `${baseUrl.replace(/\/$/, '')}/api/v1`;

    // Khởi tạo promise để resolve fetch và gắn các service
    this.ready = resolveFetch().then((fetchFn) => {
      const http = createHttp(apiBase, fetchFn);

      this.groups = new GroupService(http);
      this.proxies = new ProxyService(http);
      this.profiles = new ProfileService(http);
      this.extensions = new ExtensionService(http);
    });
  }
}