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
	$("select").formSelect();
	let thingsRef;
	let unsubscribe;
	let graph;
	let draw = false;
	auth.onAuthStateChanged((user) => {
		if (user) {
			thingsRef = db.collection(user.uid);

			$("#item-form").on("submit", function (e) {
				e.preventDefault();

				const itemName = $("#item-name").val();
				const itemCost = $("#item-cost").val();
				const type = $("select").val();

				if (!isNaN(itemCost) && type) {
					$(this).trigger("reset");
					thingsRef.add({
						uid: user.uid,
						name: itemName,
						cost: Number(itemCost),
						type,
						createdAt: new Date(),
					});
				} else if (!type) {
					showError("Please select a type");
				} else {
					showError("A number must be provided");
				}
			});
			unsubscribe = thingsRef
				.where("uid", "==", user.uid)
				.onSnapshot((querySnapshot) => {
					const data = querySnapshot.docs.map((doc) => {
						return { ...doc.data(), id: doc.id };
					});

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
	function showError(msg) {
		const el = $("#error");
		el.text(msg);
		el.removeClass("hide");
		setTimeout(() => {
			el.addClass("hide");
		}, 1500);
	}
}
