import $ from "jquery";
import { format } from "d3";
import { auth } from "./Firebase";
import DrawGraph from "./DrawGraph";
import { db } from "./Firebase";
import { animateNumber, getPercentageChange } from "./utils";
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
	const updateFunctions = [
		updateTotal,
		updateTotalIncome,
		updateTotalExpenses,
		updateExpensePercentage,
	];
	const addItem = {
		income: function (name, cost, uid, data) {
			const incomes = $("#incomes");
			incomes.append(`<li data-id="${uid}">
			<span class="income-name">${name}</span>
			<span class="income-number">
				<span class="sign">+</span> <span class="value">${cost}</span>
				<span class="income-percentage-box">
                                <span class="income-percentage">0</span>%
                            </span>
			</span><span class="delete-button">X</span>
		</li>`);
			const sumIncome = data
				.filter((e) => e.type === "income")
				.reduce((acc, current) => {
					return acc + current.cost;
				}, 0);

			const res = getPercentageChange(sumIncome, sumIncome - cost);

			animateNumber(
				$(`li[data-id="${uid}"] .income-percentage`),
				res,
				0.01,
				false
			);
		},
		expense: function (name, cost, uid, data) {
			const expenses = $("#expenses");
			expenses.append(`<li data-id="${uid}">
			<span class="expense-name">${name}</span>
			<span class="expense-number">
				<span class="sign">-</span> <span class="value">${cost}</span>
				<span class="expense-percentage-box">
                                <span class="expense-percentage">0</span>%
                            </span>
			</span><span class="delete-button">X</span>
		</li>`);
			const sumIncome = data
				.filter((e) => e.type === "income")
				.reduce((acc, current) => {
					return acc + current.cost;
				}, 0);

			const res = getPercentageChange(sumIncome, sumIncome - cost);

			animateNumber(
				$(`li[data-id="${uid}"] .expense-percentage`),
				res,
				0.01,
				false
			);
		},
	};
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
						} else {
							graph(data);
						}
					}
					updateFunctions.forEach((e) => {
						e(data);
					});
					const incomes = $("#incomes");
					const expenses = $("#expenses");
					incomes.html("");
					expenses.html("");

					data.forEach((e) => {
						const { name, cost, id, type } = e;
						addItem[type](name, cost, id, data);
					});
					$(".delete-button").on("click", function () {
						db.collection(user.uid)
							.doc($(this).parent().attr("data-id"))
							.delete();
					});
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
			.filter((e) => e.type === "expense")
			.reduce((acc, current) => {
				return acc + current.cost;
			}, 0);
		animateNumber($("#total"), format(".2f")(sumIncome - sumExpense), 0.01);
	}
	function updateTotalIncome(data) {
		const sumIncome = data
			.filter((e) => e.type === "income")
			.reduce((acc, current) => {
				return acc + current.cost;
			}, 0);
		animateNumber(
			$("#income-total"),
			format(".2f")(sumIncome),
			0.01,
			true,
			false
		);
	}
	function updateTotalExpenses(data) {
		const sumExpense = data
			.filter((e) => e.type === "expense")
			.reduce((acc, current) => {
				return acc + current.cost;
			}, 0);
		animateNumber(
			$("#expenses-total"),
			format(".2f")(sumExpense),
			0.01,
			true,
			false
		);
	}
	function updateExpensePercentage(data) {
		const sumIncome = data
			.filter((e) => e.type === "income")
			.reduce((acc, current) => {
				return acc + current.cost;
			}, 0);
		const sumExpense = data
			.filter((e) => e.type === "expense")
			.reduce((acc, current) => {
				return acc + current.cost;
			}, 0);
		animateNumber(
			$("#total-percentage"),
			getPercentageChange(sumIncome, sumIncome - sumExpense),
			0.01,
			false
		);
	}
}
