import $ from "jquery";
import { format } from "d3";
import { auth } from "./Firebase";
import DrawGraph from "./DrawGraph";
import switchPage from "./ViewControl";
import { showBoard } from "./MessageBoard";
import Error from "./Error";
import { db } from "./Firebase";
import { animateNumber, getPercentageChange } from "./utils";
import empty from "./handlebars/empty.hbs";

export default function (user) {
	$(".sidenav").sidenav();
	$(".dropdown-trigger").dropdown();
	const updateFunctions = [
		updateTotal,
		updateTotalIncome,
		updateTotalExpenses,
		updateExpensePercentage,
	];
	$("a").on("click", function (e) {
		e.preventDefault();
	});
	$(".logout").on("click", function () {
		auth.signOut().then(() => {
			showBoard("logout", user.displayName, function () {
				switchPage("form");
			});
		});
	});
	async function removeDocuments() {
		const collection = db.collection(user.uid);
		return collection
			.get()
			.then((data) => {
				data.docs.map((i) => {
					collection.doc(i.id).delete().catch(Error);
				});
			})
			.catch(Error);
	}
	function resetValues() {
		$("#total").html("0.00");
		$("#total-percentage").html("0");
		$("#expenses-total").html("0.00");
		$("#income-total").html("0.00");
	}
	$(".resetData").on("click", function () {
		resetValues();
		removeDocuments().then(() => {
			db.collection(user.uid)
				.get()
				.then((data) => {
					console.log(data);
				})
				.catch(Error);
		});
	});
	$(".deleteAccount").on("click", function () {
		resetValues();
		removeDocuments()
			.then(() => {
				user.delete()
					.then(() => {
						showBoard("delete", user.displayName, function () {
							switchPage("form");
						});
					})
					.catch(Error);
			})
			.catch(Error);
	});
	$("select").formSelect();
	let thingsRef;
	let unsubscribe;
	let sizeValue = 1;
	let graph;
	let draw = false;

	const addItem = {
		income: function (name, cost, uid, data) {
			const incomes = $("#incomes");
			incomes.append(`<li data-id="${uid}" data-element="${name}">
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
				String(Math.round(res)),
				0.01,
				false
			);
		},
		expense: function (name, cost, uid, data) {
			const expenses = $("#expenses");
			expenses.append(`<li data-id="${uid}" data-element="${name}">
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
				String(Math.round(res)),
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
					thingsRef
						.add({
							uid: user.uid,
							name: itemName,
							cost: +(
								Math.round(Number(itemCost) + "e+2") + "e-2"
							),
							type,
							createdAt: new Date(),
						})
						.catch(Error);
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

					const incomes = $("#incomes");
					const expenses = $("#expenses");
					incomes.html("");
					expenses.html("");

					data.forEach((e) => {
						const { name, cost, id, type } = e;
						addItem[type](name, cost, id, data);
					});
					updateFunctions.forEach((e) => {
						e(data);
					});
					$(".delete-button").on("click", function () {
						db.collection(user.uid)
							.doc($(this).parent().attr("data-id"))
							.delete()
							.catch(Error);
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
			String(
				Math.round(
					getPercentageChange(sumIncome, sumIncome - sumExpense)
				)
			),
			0.01,
			false
		);
	}
}
