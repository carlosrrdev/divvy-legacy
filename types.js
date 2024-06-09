/**
 * Divvy object to be saved in local storage and user's account
 * @typedef {Object} Divvy
 * @property {string} id
 * @property {string} name
 * @property {string} createdAt
 * @property {Array<string>} members
 * @property {Array<{id: string, expName: string, expAmount: number, expMemCount: number || null}>} expenses
 * @property {boolean} complex
 */

/**
 * Object representing a saved Divvy
 * @typedef {Object} StoredDivvy
 * @property {string} id
 * @property {Divvy} data
 * @property {boolean} cloud
 */