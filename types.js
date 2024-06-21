/**
 * Divvy object to be saved in local storage and user's account
 * @typedef {Object} Divvy
 * @property {string} id - ID representing this particular Divvy object.
 * @property {string} name - The name assigned to this Divvy. Is randomly generated is none is assigned.
 * @property {string} createdAt - The ISO string date when this Divvy was created.
 * @property {string} [fDate] - Formatted version of the createdAt date.
 * @property {Array<string>} members - Array containing member names
 * @property {Array<{id: string, expName: string, expAmount: number, expMemCount: number || null}>} expenses -
 *    Array of expense objects.
 * @property {boolean} complex - Defines if this Divvy is a simple Split Evenly, or a complex Divvy Up.
 * @property {boolean} [cloud] - Is this divvy is stored on the users account.
 * @property {boolean} [local] - Is this divvy is stored locally on the browser.
 */

/**
 * Object representing a saved Divvy
 * @typedef {Object} StoredDivvy
 * @property {string} id
 * @property {Divvy} data
 * @property {boolean} cloud
 */

/**
 * Controls the data flow between Firebase, Firestore, and localStorage.
 * @typedef {Object} SaveStore
 * @property {Array} storedData - The primary array that contains all data
 * @property {Array} inFirebaseOnly - An array containing only Divvies stored in Firebase
 * @property {Array} inLocalOnly - An Array containing only Divvies stored in localStorage
 * @property {boolean} isLoading - Controls spinner when fetching data from Firebase
 * @property {boolean} isSyncing - Controls spinner when syncing data between Firebase and localStorage
 * @property {boolean} needsSync - A boolean value that is set to true when there are discrepancies between
 *    Firebase and localStorage
 * @property {boolean} newestFirst - The sorting order
 * @property {function(Divvy): Promise<void>} saveData - Saves the data locally.
 *    If user is logged in will also save to their account
 * @property {function(Divvy): Promise<void>} saveToLocal - Saves the data locally using localStorage and IndexDB
 * @property {function(Divvy): Promise<void>} saveToFirestore - Saves the data to users account using Firebase
 * @property {function(): Promise<void>} getSavedData - Retrieves the data from Firebase and from localStorage.
 *    Will also check to see which Divvies are not in sync between the two.
 * @property {function(): Promise<void>} syncData - Syncs data between Firebase and localStorage
 * @property {function(): Promise<void>} deleteAllSavedData - Deletes all saved data on Firebase and localStorage
 */

/**
 * Controls the modal that shows the saved results of a Divvy
 * @typedef {Object} ViewDivvyStore
 * @property {boolean} isModalVisible - Determines if modal is currently visible or hidden
 * @property {Divvy} loadedData - The currently loaded Divvy data passed in from SaveStore
 * @property {function(Divvy): void} showDivvyModal - The modal parent that shows selected Divvy results
 */