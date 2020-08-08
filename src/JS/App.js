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
	const graph = DrawGraph();
	let thingsRef;
	let unsubscribe;
	auth.onAuthStateChanged((user) => {
		if (user) {
			thingsRef = db.collection("expenses");
			$("#item-form").on("submit", function () {
				const { serverTimestamp } = firebase.firestore.FieldValue;
				const itemName = $("#item-name").val();
				const itemCost = Number($("#item-cost").val());
				$(this).trigger("reset");
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
					graph(data);
				});
		} else {
			unsubscribe && unsubscribe();
		}
	});
}
