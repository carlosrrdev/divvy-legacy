import localforage from 'localforage';
import {db, auth} from "../../app.js";
import {doc, setDoc, collection, getDocs, deleteDoc, Timestamp} from 'firebase/firestore'
import {format} from 'date-fns'
import {sortDivviesByDate} from "../util.js";

/**
 * @type {import("/types.js").Divvy} Divvy
 * @type {import("/types.js").SaveStore} SaveStore
 */

/** @type SaveStore */
export const saveStore = {

  storedData: [],
  inFirebaseOnly: [],
  inLocalOnly: [],
  isLoading: true,
  isDeleting: false,
  isSyncing: false,
  needsSync: false,
  newestFirst: true,


  /**
   * Saves the data to local storage and Firestore if the user is authenticated.
   * @param {Divvy} data - The data to be saved.
   * @return {Promise<void>} - A promise that resolves when the data is saved.
   */
  async saveData(data) {
    try {
      await this.saveToLocal(data)

      if (Alpine.store("dv_fb").isAuthenticated) {
        await this.saveToFirestore(data)
      }
    } catch (error) {
      console.error(error)
    }
  },

  /**
   * Saves data locally to the browsers local storage.
   * @param {Divvy} data - The data to be saved.
   * @return {Promise<void>} - A promise that resolves when the data is successfully saved.
   */
  async saveToLocal(data) {
    try {
      const oldLocalData = JSON.parse(await localforage.getItem('dv_data'));

      if (!oldLocalData) {
        await localforage.setItem('dv_data', JSON.stringify([data]));
      } else {
        await localforage.setItem('dv_data', JSON.stringify([data, ...oldLocalData]));
      }
    } catch (error) {
      console.error(error)
    }
  },

  /**
   * Saves data to Firestore.
   * @param {Divvy} data - The data to save to Firestore.
   * @return {Promise<void>} - A Promise that resolves when the data is successfully saved to Firestore.
   */
  async saveToFirestore(data) {
    const userId = auth.currentUser.uid;

    try {
      const divvyRef = doc(db, `users/${userId}/divvies/${data.id}`);
      await setDoc(divvyRef, data)
    } catch (error) {
      console.error(error)
    }
  },

  /**
   * Retrieves saved data from Firestore and local storage.
   * @return {Promise<void>} - A promise that resolves when the data retrieval is complete.
   */
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
          const sortedArr = sortDivviesByDate(firestoreData)
          sortedArr.forEach(doc => {
            const timestamp = Timestamp.fromDate(new Date(doc.createdAt)).toDate()
            const formattedDate = format(timestamp, "Pp")
            this.storedData.push({...doc, cloud: true, local: false, fDate: formattedDate})
          })
        } else {
          const inBoth = firestoreData.filter(obj1 => localData.find(obj2 => obj1.id === obj2.id))
          this.inFirebaseOnly = firestoreData.filter(obj1 => !localData.find(obj2 => obj1.id === obj2.id))
          this.inLocalOnly = localData.filter(obj1 => !firestoreData.find(obj2 => obj1.id === obj2.id))

          if (this.inFirebaseOnly.length > 0 || this.inLocalOnly.length > 0) {
            this.needsSync = true;
          }

          const _arr1 = inBoth.map(item => this.appendDivvyObj(item, true, true))
          const _arr2 = this.inFirebaseOnly.map(item => this.appendDivvyObj(item, true, false))
          const _arr3 = this.inLocalOnly.map(item => this.appendDivvyObj(item, false, true))

          this.storedData = sortDivviesByDate(
              [..._arr1, ..._arr2, ..._arr3],
              this.newestFirst ? 'desc' : 'asc');
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
        const timestamp = Timestamp.fromDate(new Date(doc.createdAt)).toDate()
        const formattedDate = format(timestamp, "Pp")
        this.storedData.push({...doc, cloud: false, local: true, fDate: formattedDate})
      })
      this.isLoading = false;
    }
  },

  /**
   * Synchronizes data between local storage and Firebase.
   * @return {Promise<void>} A promise that resolves once the synchronization is complete.
   */
  async syncData() {
    this.isSyncing = true
    this.needsSync = false

    try {
      if (this.inFirebaseOnly.length > 0) {
        for (const doc1 of this.inFirebaseOnly) {
          await this.saveToLocal(doc1)
        }
      }

      if (this.inLocalOnly.length > 0) {
        for (const doc1 of this.inLocalOnly) {
          await this.saveToFirestore(doc1)
        }
      }

      this.isSyncing = false;
      await this.getSavedData()

    } catch (error) {
      console.error(error)
    }
  },

  /**
   * Deletes all saved data including data stored on users account if they are logged in.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async deleteAllSavedData() {
    try {
      this.isLoading = true
      await localforage.removeItem('dv_data');

      if (Alpine.store('dv_fb').isAuthenticated) {
        const userId = auth.currentUser.uid;
        const userCollection = await collection(db, "users", userId, 'divvies');
        const queryData = await getDocs(userCollection);
        for (const doc of queryData.docs) {
          await deleteDoc(doc.ref);
        }
      }

      this.storedData = []
      this.inFirebaseOnly = []
      this.inLocalOnly = []
      this.isDeleting = false;

      this.isLoading = false;
    } catch (error) {
      console.error(error)
    }
  },

  async deleteSingleDivvy(id) {
    if (Alpine.store('dv_fb').isAuthenticated) {
      try {
        const userId = auth.currentUser.uid;
        const userCollection = await collection(db, "users", userId, 'divvies');

        const docExists = await getDocs(userCollection).then((querySnapshot) => {
          return querySnapshot.docs.some((doc) => doc.id === id);
        });

        if(docExists) {
          const divvyDoc = doc(userCollection, id);
          await deleteDoc(divvyDoc);
        }
      } catch(error) {
        console.error(error)
      }
    }

    /** @type {Array<Divvy>} */
    const oldLocalData = JSON.parse(await localforage.getItem('dv_data'));

    const index = oldLocalData.findIndex(obj => obj.id === id);
    if (index !== -1) {
      oldLocalData.splice(index, 1);
      await localforage.setItem('dv_data', JSON.stringify(oldLocalData));
    }
  },

  /**
   * Appends additional information to the Divvy object
   * @param {Divvy} divvy
   * @param {boolean} cloud
   * @param {boolean} local
   * @return {Divvy}
   */
  appendDivvyObj(divvy, cloud, local) {
    const timestamp = Timestamp.fromDate(new Date(divvy.createdAt)).toDate()
    const formattedDate = format(timestamp, "Pp")
    return {...divvy, cloud, local, fDate: formattedDate}
  },

  changeSortingOrder() {
    this.newestFirst = !this.newestFirst;
    sortDivviesByDate(this.storedData, this.newestFirst ? 'desc' : 'asc')
  },

  /**
   * The modal prompting the user to confirm if they want to delete all saved data. Add or removes it from the
   * HTML document.
   */
  showConfirmDeleteModal() {
    this.isDeleting = true;
    setTimeout(() => {
      document.getElementById("modal_confirm_delete").showModal()
    }, 0)
  }
}