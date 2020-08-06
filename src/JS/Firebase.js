import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
	apiKey: "AIzaSyC7M9nzPbvYFLVgWWusQG27IPw6sMt-b28",
	authDomain: "argent-cd345.firebaseapp.com",
	databaseURL: "https://argent-cd345.firebaseio.com",
	projectId: "argent-cd345",
	storageBucket: "argent-cd345.appspot.com",
	messagingSenderId: "740104834804",
	appId: "1:740104834804:web:4d4fb1fd431afeb79898a1",
};
const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();
console.log(firebase);
