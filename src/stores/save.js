import localforage from 'localforage';
import {db, auth} from "../../app.js";
import {doc, query, setDoc, collection, orderBy, getDocs} from 'firebase/firestore'

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


export const saveStore = {

  fbData: [],
  isLoading: true,

  /**
   * Save divvy into local storage and attempt to save to users account is they are logged in
   * @param {Divvy} data
   * @return {Promise<void>}
   */
  saveData: async function (data) {

    try {
      const oldLocalData = JSON.parse(await localforage.getItem('dv_data'));

      if (!oldLocalData) {
        await localforage.setItem('dv_data', JSON.stringify([data]));
      } else {
        await localforage.setItem('dv_data', JSON.stringify([data, ...oldLocalData]));
      }

      // console.log(await localforage.getItem('dv_data'));


    } catch (error) {
      console.error(error)
    }

    await this.saveToFirestore(data)
  },

  async saveToFirestore(data) {
    const userId = auth.currentUser.uid;

    try {
      const divvyRef = doc(db, `users/${userId}/divvies/${data.id}`);
      await setDoc(divvyRef, data)
    } catch (error) {
      console.error(error)
    }
  },

  async getSavedData() {
    if (!Alpine.store('dv_fb').isAuthenticated) {
      return
    }

    this.fbData = []
    this.isLoading = true;
    const userId = auth.currentUser.uid;

    try {
      const userCollection = await collection(db, "users", userId, 'divvies');
      const sorted = query(userCollection, orderBy('createdAt', 'desc'))
      const queryData = await getDocs(sorted);

      queryData.forEach((doc) => {
        this.fbData.push({
          id: doc.id,
          data: doc.data(),
          cloud: true
        });
      })

      this.isLoading = false;

    } catch (error) {
      console.error(error)
    }
  }
}