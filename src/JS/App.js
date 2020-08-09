import $ from "jquery";
import firebase from "firebase/app";
import { auth } from "./Firebase";
import DrawGraph from "./DrawGraph";
import { db } from "./Firebase";
import { xor } from "lodash";
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
	let originalData = [];
	auth.onAuthStateChanged((user) => {
		if (user) {
			thingsRef = db.collection("expenses");
			$("#item-form").on("submit", function (e) {
				e.preventDefault();

				const itemName = $("#item-name").val();
				const itemCost = Number($("#item-cost").val());
				$(this).trigger("reset");
				thingsRef.add({
					uid: user.uid,
					name: itemName,
					cost: itemCost,
					createdAt: new Date(),
				});
			});
			unsubscribe = thingsRef
				.where("uid", "==", user.uid)
				.onSnapshot((querySnapshot) => {
					const data = querySnapshot.docs.map((doc) => doc.data());
					originalData = data;
					if (
						!(
							(originalData.length === data.length) === 0 &&
							xor(originalData, data).length === 0
						)
					) {
						graph(originalData);
					}
				});
		} else {
			unsubscribe && unsubscribe();
		}
	});
}
