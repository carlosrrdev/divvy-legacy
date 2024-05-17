import {nanoid} from 'nanoid';
import {format} from 'date-fns';
import localforage from 'localforage';
import {db, auth} from "../../app.js";
import {doc, setDoc} from 'firebase/firestore'

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

      console.log(await localforage.getItem('dv_data'));


    } catch(error) {
      console.error(error)
    }

    await this.testSave(data)
  },

  async testSave(data) {
    const userId = auth.currentUser.uid;

    try {
      const divvyRef = doc(db, `users/${userId}/divvies/${data.id}`);
      await setDoc(divvyRef, data)
      console.log('success')
    } catch(error) {
      console.error(error)
    }
  }
}