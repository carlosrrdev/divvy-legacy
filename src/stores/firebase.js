import {auth, db} from "../../app.js"
import {signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut} from 'firebase/auth'
const provider = new GoogleAuthProvider()

export const firebaseStore = {
  isAuthenticated: false,
  userEmail: "",
  userProfileImageUrl: "",
  userData: [],

  init() {
    onAuthStateChanged(auth, user => {
      if (user) {
        this.userEmail = user.email;
        this.userProfileImageUrl = user.photoURL;
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
        this.userEmail = '';
        this.userData = [];
      }
    });
  },

  async login() {
    try {
      const result = await signInWithRedirect(auth, provider)
      const user = result.user
      this.userEmail = user.email
      this.userProfileImageUrl = user.photoURL
      this.isAuthenticated = true
    } catch (error) {
      console.error(error)
    }
  },

  async logout() {
    try {
      await signOut(auth);
      this.isAuthenticated = false;
      this.userEmail = '';
      this.userProfileImageUrl = '';
      this.userData = [];
    } catch (error) {
      console.error(error)
    }
  }
}