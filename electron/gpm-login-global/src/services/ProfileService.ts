/**
 * @file ProfileService.js
 * Service for managing browser profiles via the GPMLogin Global API.
 */

/**
 * @param {object} response
 * @throws {Error}
 */
function ensureSuccess(response: { success: any; message: any; }) {
  if (!response.success) {
    throw new Error(`GPMLogin API error: ${response.message}`);
  }
}

/**
 * Provides CRUD operations and lifecycle control for browser profiles.
 */
export class ProfileService {
  private _http: { get: (path: any) => Promise<any>; post: (path: any, body: any) => Promise<any>; };
  /**
   * @param {{ get: Function, post: Function }} http - Shared HTTP helper.
   */
  constructor(http: { get: (path: any) => Promise<any>; post: (path: any, body: any) => Promise<any>; }) {
    this._http = http;
  }

  /**
   * Retrieves a paginated list of profiles.
   *
   * @param {object} [options={}] - Pagination and filter options.
   * @param {number} [options.page=1] - Page number (1-based).
   * @param {number} [options.perPage=30] - Number of items per page.
   * @param {string} [options.search] - Optional search term.
   * @param {string} [options.sort] - Optional sort expression.
   * @returns {Promise<object>} Paged response with `data` array and metadata.
   * @throws {Error} On API failure.
   *
   * @example
   * const page = await client.profiles.getAll({ page: 1, perPage: 20 });
   * console.log(page.total); // total number of profiles
   */
  async getAll({ page = 1, perPage = 30, search, sort }: any = {} = {}) {
    let path = `profiles?page=${page}&per_page=${perPage}`;
    if (search) {
      path += `&search=${encodeURIComponent(search)}`;
    }
    if (sort) {
      path += `&sort=${encodeURIComponent(sort)}`;
    }
    const response = await this._http.get(path);
    ensureSuccess(response);
    return response.data;
  }

  /**
   * Retrieves a single profile by its identifier.
   *
   * @param {string} id - The profile identifier.
   * @returns {Promise<object>} The profile object.
   * @throws {Error} On API failure.
   */
  async getById(id:string) {
    const response = await this._http.get(`profiles/${id}`);
    ensureSuccess(response);
    return response.data;
  }

  /**
   * Creates a new browser profile.
   *
   * @param {object} profileData - Profile configuration.
   * @param {string} profileData.name - Display name. Required.
   * @param {string|null} [profileData.group_id] - Group to assign the profile to.
   * @param {string|null} [profileData.raw_proxy] - Proxy connection string.
   * @param {number} [profileData.browser_type=1] - Browser type identifier.
   * @param {string} [profileData.browser_version] - Pinned browser version.
   * @param {number} [profileData.os_type=1] - OS type identifier.
   * @param {string|null} [profileData.custom_user_agent] - Custom User-Agent.
   * @param {string|null} [profileData.task_bar_title] - Browser window title.
   * @param {number|null} [profileData.webrtc_mode] - WebRTC protection mode.
   * @param {string} [profileData.fixed_webrtc_public_ip] - Fixed WebRTC public IP.
   * @param {number|null} [profileData.geolocation_mode] - Geolocation mode.
   * @param {number|null} [profileData.canvas_mode] - Canvas fingerprint mode.
   * @param {number|null} [profileData.client_rect_mode] - ClientRects mode.
   * @param {number|null} [profileData.webgl_image_mode] - WebGL image mode.
   * @param {number|null} [profileData.webgl_metadata_mode] - WebGL metadata mode.
   * @param {number|null} [profileData.audio_mode] - Audio fingerprint mode.
   * @param {number|null} [profileData.font_mode] - Font fingerprint mode.
   * @param {boolean} [profileData.timezone_base_on_ip=true] - Derive timezone from IP.
   * @param {string|null} [profileData.timezone] - Fixed timezone string.
   * @param {boolean} [profileData.is_language_base_on_ip=true] - Derive language from IP.
   * @param {string|null} [profileData.fixed_language] - Fixed language tag.
   * @returns {Promise<object>} The newly created profile.
   * @throws {Error} On API failure.
   *
   * @example
   * const profile = await client.profiles.create({
   *   name: 'My Profile',
   *   browser_type: 1,
   *   os_type: 1,
   *   timezone_base_on_ip: true,
   *   is_language_base_on_ip: true,
   * });
   */
  async create(profileData:string) {
    const response = await this._http.post('profiles/create', profileData);
    ensureSuccess(response);
    return response.data;
  }

  /**
   * Updates an existing browser profile.
   *
   * @param {string} id - The profile identifier.
   * @param {object} profileData - Updated profile configuration (same shape as {@link create}).
   * @returns {Promise<object>} The updated profile.
   * @throws {Error} On API failure.
   */
  async update(id:string, profileData:any) {
    const response = await this._http.post(`profiles/update/${id}`, profileData);
    ensureSuccess(response);
    return response.data;
  }

  /**
   * Deletes a browser profile.
   *
   * @param {string} id - The profile identifier.
   * @param {'soft'|'hard'} [mode='soft'] - Deletion mode.
   *   `'soft'` moves the profile to trash; `'hard'` permanently removes it.
   * @returns {Promise<void>}
   * @throws {Error} On API failure.
   */
  async delete(id:string, mode = 'soft') {
    const response = await this._http.get(`profiles/delete/${id}?mode=${mode}`);
    ensureSuccess(response);
  }

  /**
   * Starts a browser profile and returns connection details for automation.
   *
   * @param {string} id - The profile identifier.
   * @param {object} [options={}] - Optional launch parameters.
   * @param {number} [options.remoteDebuggingPort] - Chrome DevTools Protocol port.
   * @param {number} [options.windowScale] - DPI scaling factor, e.g. `1.0`.
   * @param {string} [options.windowPos] - Initial position `"x,y"`, e.g. `"0,0"`.
   * @param {string} [options.windowSize] - Initial size `"w,h"`, e.g. `"1280,800"`.
   * @param {string} [options.additionArgs] - Extra Chrome command-line arguments.
   * @returns {Promise<object>} Start result containing `remote_debugging_port`,
   *   `driver_path`, and `addition_info`.
   * @throws {Error} On API failure.
   *
   * @example
   * const result = await client.profiles.start(profileId, { windowSize: '1280,800' });
   * console.log(`Connect to port: ${result.remote_debugging_port}`);
   */
  async start(id:string, options :{remoteDebuggingPort:number;windowScale:number;windowPos:string;windowSize:string;additionArgs:string} = {
      remoteDebuggingPort: 0,
      windowScale: 0,
      windowPos: "",
      windowSize: "",
      additionArgs: ""
  }) {
    const params = [];
    if (options?.remoteDebuggingPort !== undefined) {
      params.push(`remote_debugging_port=${options.remoteDebuggingPort}`);
    }
    if (options.windowScale !== undefined) {
      params.push(`window_scale=${options.windowScale}`);
    }
    if (options.windowPos) {
      params.push(`window_pos=${encodeURIComponent(options.windowPos)}`);
    }
    if (options.windowSize) {
      params.push(`window_size=${encodeURIComponent(options.windowSize)}`);
    }
    if (options.additionArgs) {
      params.push(`addition_args=${encodeURIComponent(options.additionArgs)}`);
    }

    const query = params.length > 0 ? `?${params.join('&')}` : '';
    const response = await this._http.get(`profiles/start/${id}${query}`);
    ensureSuccess(response);
    return response.data;
  }

  /**
   * Stops a running browser profile.
   *
   * @param {string} id - The profile identifier.
   * @returns {Promise<void>}
   * @throws {Error} On API failure.
   */
  async stop(id:string) {
    const response = await this._http.get(`profiles/stop/${id}`);
    ensureSuccess(response);
  }
}