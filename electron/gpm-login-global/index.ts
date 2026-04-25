/**
 * @file index.js
 * GPMLogin Global JavaScript client library – public surface.
 *
 * @module gpm-login-global
 * @example
 * import { GPMLoginGlobalClient } from 'gpm-login-global';
 *
 * const client = new GPMLoginGlobalClient();
 * const profiles = await client.profiles.getAll();
 */

export { GPMLoginGlobalClient } from './src/client';
export { GroupService }     from './src/services/GroupService';
export { ProxyService }     from './src/services/ProxyService';
export { ProfileService }   from './src/services/ProfileService';
export { ExtensionService } from './src/services/ExtensionService';