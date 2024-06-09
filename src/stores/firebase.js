import {auth, db} from "../../app.js"
import {signInWithPopup, GoogleAuthProvider, onAuthStateChanged, reauthenticateWithPopup, signOut} from 'firebase/auth'
import {collection, getDocs} from 'firebase/firestore'
import {format} from 'date-fns'

const provider = new GoogleAuthProvider()
provider.setCustomParameters({
  prompt: 'select_account'
})

export const firebaseStore = {
  isAuthenticated: false,
  userEmail: "",
  userProfileImageUrl: "",
  userCreatedAtDate: "",
  userData: [],
  userDivvyCount: null,
  errorText: "Please log in to view account",

  init() {
    onAuthStateChanged(auth, async user => {
      if (user) {
        await this.setUserState(user)
      } else {
        this.resetUserState()
        this.errorText = "Please log in to view account"
      }
    });
  },

  async login() {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      await this.setUserState(user)
    } catch (error) {
      console.error(error)
    }
  },

  async logout() {
    try {
      await signOut(auth);
      this.resetUserState()
      this.errorText = "Please log in to view account"
    } catch (error) {
      console.error(error)
    }
  },

  async setUserState(user) {
    this.userEmail = user.email;
    this.userProfileImageUrl = user.photoURL;
    this.userCreatedAtDate = format(user.metadata.creationTime, "PPP");
    this.isAuthenticated = true;
    this.userDivvyCount = await this.getDivvyCount(user.uid)
  },

  resetUserState() {
    this.isAuthenticated = false;
    this.userEmail = '';
    this.userData = [];
    this.userCreatedAtDate = '';
    this.userDivvyCount = null;
  },

  async deleteUserAccount() {
    try {
      const user = auth.currentUser;
      await reauthenticateWithPopup(user, provider)
      if (user) {
        await user.delete();
        this.resetUserState();
      }
      this.errorText = "Account successfully deleted"
    } catch (error) {
      console.error(error);
    }
  },

  async getDivvyCount(uid) {
    const divviesCollection = collection(db, `users/${uid}/divvies`);
    const snapshot = await getDocs(divviesCollection);
    return snapshot.size;
  },
}