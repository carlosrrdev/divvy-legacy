import localforage from 'localforage';
import {db, auth} from "../../app.js";
import {doc, query, setDoc, collection, orderBy, getDocs} from 'firebase/firestore'
import {compareArrays, sortDatesByNewestFirst} from "../util.js";

/**
 * @type {import("/types.js").Divvy} Divvy
 */

export const saveStore = {

  storedData: [],
  isLoading: true,
  needsSync: false,

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
    if (Alpine.store("dv_fb").isAuthenticated) {
      await this.saveToFirestore(data)
    }
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
    if (Alpine.store('dv_fb').isAuthenticated) {
      this.storedData = []
      this.isLoading = true;
      const userId = auth.currentUser.uid;

      try {
        const firestoreData = []
        const userCollection = await collection(db, "users", userId, 'divvies');
        const queryData = await getDocs(userCollection);

        queryData.forEach((doc) => {
          firestoreData.push(doc.data());
        })

        /**@type {Array|null} */
        const localData = JSON.parse(await localforage.getItem("dv_data"));

        //TODO Might be an error when trying to load divvies on a fresh account
        if (!localData || localData.length < 1) {
          firestoreData.forEach(doc => {
            this.storedData.push({...doc, cloud: true, local: false})
          })
        } else {
          // check to see which divvies are in both firestore and local
          const inBoth = firestoreData.filter(obj1 => localData.find(obj2 => obj1.id === obj2.id))
          const inFirestoreOnly = firestoreData.filter(obj1 => !localData.find(obj2 => obj1.id === obj2.id))
          const inLocalOnly = localData.filter(obj1 => !firestoreData.find(obj2 => obj1.id === obj2.id))

          if(inFirestoreOnly.length > 0 || inLocalOnly.length > 0) {
            this.needsSync = true;
          }

          const tempArr1 = inBoth.map(item => {
            return {...item, cloud: true, local: true}
          })
          const tempArr2 = inFirestoreOnly.map((item) => {
            return {...item, cloud: true, local: false}
          })
          const tempArr3 = inLocalOnly.map((item) => {
            return {...item, cloud: false, local: true}
          })
          this.storedData = [...tempArr1, ...tempArr2, ...tempArr3]
        }

        this.isLoading = false;

      } catch (error) {
        console.error(error)
      }
    } else {
      this.storedData = [];
      this.isLoading = true;
      const localData = JSON.parse(await localforage.getItem("dv_data"));
      if (!localData || localData.length < 1) {
        this.isLoading = false;
        return;
      }
      localData.forEach(doc => {
        this.storedData.push({...doc, cloud: false, local: true})
      })
      this.isLoading = false;
    }
  }
}