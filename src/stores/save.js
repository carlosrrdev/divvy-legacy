import {nanoid} from 'nanoid';
import {format} from 'date-fns';
import localforage from 'localforage';
import {db, auth} from "../../app.js";
import {doc, setDoc} from 'firebase/firestore'

export const saveStore = {

  saveData: async function (data) {
    const saveDivvyObj = {
      id: nanoid(12),
      createdAt: format(new Date(), 'PPP'),
      ...data
    }

    try {
      const oldLocalData = JSON.parse(await localforage.getItem('dv_data'));

      if (!oldLocalData) {
        await localforage.setItem('dv_data', JSON.stringify([saveDivvyObj]));
      } else {
        await localforage.setItem('dv_data', JSON.stringify([saveDivvyObj, ...oldLocalData]));
      }

      console.log(await localforage.getItem('dv_data'));


    } catch(error) {
      console.error(error)
    }

    this.testSave(saveDivvyObj.id)
  },

  async testSave(dvId) {
    const userId = auth.currentUser.uid;

    try {
      const divvyRef = doc(db, `users/${userId}/divvies/${dvId}`);
      await setDoc(divvyRef, {
        id: dvId,
        name: "testDivvy",
        createdAt: format(new Date(), 'PPP'),
        members: [],
        expenses: {
          id: '1',
          expName: 'test',
          expAmount: 200,
          expMemCount: 4
        },
        complex: false
      })
      console.log('success')
    } catch(error) {
      console.error(error)
    }
  }
}