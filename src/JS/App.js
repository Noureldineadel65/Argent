import $ from "jquery";
import faker from "faker";
import firebase from "firebase/app";
import { auth } from "./Firebase";
import DrawGraph from "./DrawGraph";
import { db } from "./Firebase";
export default function (user) {
	$(".sidenav").sidenav();
	$(".dropdown-trigger").dropdown();
	$("a").on("click", function (e) {
		e.preventDefault();
	});
	$(".logout").on("click", function () {
		auth.signOut();
	});
	let thingsRef;
	let unsubscribe;
	auth.onAuthStateChanged((user) => {
		if (user) {
			thingsRef = db.collection("expenses");
			$("#add-item").on("click", function () {
				const { serverTimestamp } = firebase.firestore.FieldValue;
				const itemName = $("#item-name").val();
				const itemCost = Number($("#item-cost").val());
				thingsRef.add({
					uid: user.uid,
					name: itemName,
					cost: itemCost,
					createdAt: serverTimestamp(),
				});
			});
			unsubscribe = thingsRef
				.where("uid", "==", user.uid)
				.onSnapshot((querySnapshot) => {
					const data = querySnapshot.docs.map((doc) => doc.data());
					console.log(data);
				});
		}
	});
	DrawGraph();
}
