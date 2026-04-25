/**
 * @file ExtensionService.js
 * Service for managing browser extensions via the GPMLogin Global API.
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
 * Provides operations for listing and toggling browser extensions.
 */
export class ExtensionService {
  private _http: any;
  /**
   * @param {{ get: Function, post: Function }} http - Shared HTTP helper.
   */
  constructor(http: any) {
    this._http = http;
  }

  /**
   * Retrieves all installed browser extensions.
   *
   * @returns {Promise<Array<object>>} Array of extension objects, each with
   *   `id`, `name`, and `active` fields.
   * @throws {Error} On API failure.
   *
   * @example
   * const extensions = await client.extensions.getAll();
   * extensions.forEach(ext => console.log(ext.name, ext.active));
   */
  async getAll() {
    const response = await this._http.get('extensions');
    ensureSuccess(response);
    return response.data;
  }

  /**
   * Enables or disables a specific extension.
   *
   * @param {string} id - The extension identifier.
   * @param {boolean} active - `true` to enable, `false` to disable.
   * @returns {Promise<void>}
   * @throws {Error} On API failure.
   *
   * @example
   * await client.extensions.updateState('ext-id-123', true);
   */
  async updateState(id:string, active:boolean) {
    const response = await this._http.get(
      `extensions/update-state/${id}?active=${active ? 'true' : 'false'}`
    );
    ensureSuccess(response);
  }
}