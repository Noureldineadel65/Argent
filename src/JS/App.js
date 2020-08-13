import $ from "jquery";
import { format } from "d3";
import { auth } from "./Firebase";
import DrawGraph from "./DrawGraph";
import { db } from "./Firebase";
import { animateNumber } from "./utils";
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
	let sizeValue = 1;
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
							graph = DrawGraph(sizeValue);
							graph(data);

							// animateNumber($("#total"), "40.00");
						} else {
							graph(data);
						}
						updateTotal(data);
						updateTotalIncome(data);
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
	function updateTotal(data) {
		const sumIncome = data
			.filter((e) => e.type === "income")
			.reduce((acc, current) => {
				return acc + current.cost;
			}, 0);
		const sumExpense = data
			.filter((e) => e.type === "expenses")
			.reduce((acc, current) => {
				return acc + current.cost;
			}, 0);
		animateNumber($("#total"), format(".2f")(sumIncome - sumExpense), 0.1);
	}
	function updateTotalIncome(data) {
		const sumIncome = data
			.filter((e) => e.type === "income")
			.reduce((acc, current) => {
				return acc + current.cost;
			}, 0);
		$("#income-total");
	}
}
