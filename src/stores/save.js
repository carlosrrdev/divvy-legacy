import {nanoid} from 'nanoid';
import {format} from 'date-fns';
import localforage from 'localforage';

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
  }
}