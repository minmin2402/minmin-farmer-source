/**
 * @file ProxyService.js
 * Service for managing proxies via the GPMLogin Global API.
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
 * Provides CRUD operations for proxy entries.
 */
export class ProxyService {
  private _http: any;
  /**
   * @param {{ get: Function, post: Function }} http - Shared HTTP helper.
   */
  constructor(http: any) {
    this._http = http;
  }



  
  /**
   * Retrieves a paginated list of proxies.
   *
   * @param {object} [options={}] - Pagination and filter options.
   * @param {number} [options.page=1] - Page number (1-based).
   * @param {number} [options.pageSize=30] - Number of items per page.
   * @param {string} [options.search] - Optional search term.
   * @param {string} [options.sort] - Optional sort expression.
   * @returns {Promise<object>} Paged response object with `data`, `total`, etc.
   * @throws {Error} On API failure.
   *
   * @example
   * const page = await client.proxies.getAll({ page: 1, pageSize: 20 });
   * console.log(page.data); // array of proxies
   */
  async getAll({ page = 1, pageSize = 30, search, sort }: any = {} = {}) {
    let path = `proxies?page=${page}&page_size=${pageSize}`;
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
   * Retrieves a single proxy by its identifier.
   *
   * @param {string} id - The proxy identifier.
   * @returns {Promise<object>} The proxy object.
   * @throws {Error} On API failure.
   */
  async getById(id:string) {
    const response = await this._http.get(`proxies/${id}`);
    ensureSuccess(response);
    return response.data;
  }

  /**
   * Creates a new proxy entry.
   *
   * @param {string} rawProxy - Raw proxy connection string,
   *   e.g. `http://user:pass@host:port` or `socks5://host:port`.
   * @returns {Promise<object>} The newly created proxy.
   * @throws {Error} On API failure.
   *
   * @example
   * const proxy = await client.proxies.create('http://user:pass@1.2.3.4:8080');
   */
  async create(rawProxy: any) {
    const response = await this._http.post('proxies/create', { raw_proxy: rawProxy });
    ensureSuccess(response);
    return response.data;
  }

  /**
   * Updates an existing proxy entry.
   *
   * @param {string} id - The proxy identifier.
   * @param {string} rawProxy - New raw proxy connection string.
   * @returns {Promise<object>} The updated proxy.
   * @throws {Error} On API failure.
   */
  async update(id: any, rawProxy: any) {
    const response = await this._http.post(`proxies/update/${id}`, { raw_proxy: rawProxy });
    ensureSuccess(response);
    return response.data;
  }

  /**
   * Deletes a proxy entry by its identifier.
   *
   * @param {string} id - The proxy identifier.
   * @returns {Promise<void>}
   * @throws {Error} On API failure.
   */
  async delete(id:string) {
    const response = await this._http.get(`proxies/delete/${id}`);
    ensureSuccess(response);
  }
}