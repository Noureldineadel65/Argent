import { format } from "d3";
export function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
export function hideElement(el) {
	el.css("display", "none");
}
export function showElement(el, display = "block") {
	el.css("display", display);
}
export function getFormValues(form) {
	const values = [];
	form.find("input").each(function () {
		values.push($(this).val());
	});
	return values;
}

export function animateNumber(
	textEl,
	end = "60.54",
	speed = 10,
	fraction = true,
	sign = true
) {
	let text;
	// const sign = textEl.parent().find(".sign");
	// sign.text(Number(end) - Number(textEl.text()) < 0 ? "-" : "+");
	function addSign(num) {
		return num > 0 && sign ? "+" : "";
	}
	if (fraction) {
		text = textEl.text().split(".");
		end = end.split(".");

		let firstNum = Number(text[0].split(",").join(""));
		const firstMode =
			Number(end[0]) - Number(text[0]) >= 0 ? "plus" : "minus";
		const firstCount = setInterval(() => {
			textEl.text(
				`${addSign(firstNum)}${
					firstNum == 0 ? firstNum : format(",.2r")(firstNum)
				}.${text[1]}`
			);
			if (firstNum === Number(end[0])) {
				clearInterval(firstCount);
				let secondNum = Number(text[1]);
				const secondMode =
					Number(end[1]) - Number(text[1]) >= 0 ? "plus" : "minus";
				const secondCount = setInterval(() => {
					textEl.text(
						`${addSign(firstNum)}${
							firstNum == 0 ? firstNum : format(",.2r")(firstNum)
						}.${secondNum < 10 ? `0${secondNum}` : secondNum}`
					);
					if (secondNum === Number(end[1])) {
						clearInterval(secondCount);
					} else {
						if (secondMode === "plus") {
							secondNum++;
						} else {
							secondNum--;
						}
					}
				}, speed);
			} else {
				if (firstMode === "plus") {
					firstNum++;
				} else {
					firstNum--;
				}
			}
		}, speed);
	} else {
		text = textEl.text();
		let countNum = Number(text);

		const mode = Number(end) - countNum >= 0 ? "plus" : "minus";
		const count = setInterval(() => {
			textEl.text(countNum);
			if (countNum === Number(end) || end === "NaN") {
				clearInterval(count);
			} else {
				if (mode === "plus") {
					countNum++;
				} else {
					countNum--;
				}
			}
		}, speed);
	}
}
export function getPercentageChange(oldNumber, newNumber) {
	/**
	 * Calculates in percent, the change between 2 numbers.
	 * e.g from 1000 to 500 = 50%
	 *
	 * @param oldNumber The initial value
	 * @param newNumber The value that changed
	 */
	var decreaseValue = oldNumber - newNumber;
	const res = ((decreaseValue / oldNumber) * 100).toFixed(0);
	return res === "Infinity" ? Math.abs(newNumber) : res;
}
