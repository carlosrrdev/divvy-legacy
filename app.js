import "./style.css";
import Alpine from 'alpinejs';
import "htmx.org";
import localforage from "localforage";
import {splitEvenly} from "./src/stores/split_evenly.js";
import {saveStore} from "./src/stores/save.js";
import {firebaseStore} from "./src/stores/firebase.js";
import {initializeApp} from 'firebase/app';
import {getAnalytics} from "firebase/analytics"
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
const analytics = getAnalytics(app);

window.Alpine = Alpine;

localforage.config({
  name: "divvy",
  storeName: "divvy_lf_ls",
  description: "Local db for Divvy"
})

Alpine.store('dv_split', splitEvenly)
Alpine.store('dv_fb', firebaseStore)
Alpine.store('dv_save', saveStore)


Alpine.start();