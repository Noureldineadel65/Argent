import $ from "jquery";

import { auth } from "./Firebase";
import DrawGraph from "./DrawGraph";
import { db } from "./Firebase";
import empty from "./handlebars/empty.hbs";

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
	let graph;
	let draw = false;
	auth.onAuthStateChanged((user) => {
		if (user) {
			thingsRef = db.collection("expenses");
			$("#item-form").on("submit", function (e) {
				e.preventDefault();

				const itemName = $("#item-name").val();
				const itemCost = $("#item-cost").val();
				if (!isNaN(itemCost)) {
					$(this).trigger("reset");
					thingsRef.add({
						uid: user.uid,
						name: itemName,
						cost: Number(itemCost),
						createdAt: new Date(),
					});
				} else {
					$("#error").removeClass("hide");
					setTimeout(() => {
						$("#error").addClass("hide");
					}, 1500);
				}
			});
			unsubscribe = thingsRef
				.where("uid", "==", user.uid)
				.onSnapshot((querySnapshot) => {
					const data = querySnapshot.docs.map((doc) => doc.data());
					if (!data.length) {
						draw = false;
						$(".canvas").html(empty());
					} else {
						if (!draw) {
							$(".canvas").html("");
							draw = true;
							graph = DrawGraph();
							graph(data);
						} else {
							graph(data);
						}
					}
				});
		} else {
			unsubscribe && unsubscribe();
		}
	});
}
