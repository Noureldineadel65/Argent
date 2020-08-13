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
	fraction = true
) {
	let text;
	// const sign = textEl.parent().find(".sign");
	// sign.text(Number(end) - Number(textEl.text()) < 0 ? "-" : "+");
	if (fraction) {
		text = textEl.text().split(".");
		end = end.split(".");

		let firstNum = Number(text[0].split(",").join(""));
		const firstMode =
			Number(end[0]) - Number(text[0]) >= 0 ? "plus" : "minus";
		const firstCount = setInterval(() => {
			textEl.text(`${firstNum}.${text[1]}`);
			if (firstNum === Number(end[0])) {
				clearInterval(firstCount);
				let secondNum = Number(text[1]);
				const secondMode =
					Number(end[1]) - Number(text[1]) >= 0 ? "plus" : "minus";
				const secondCount = setInterval(() => {
					textEl.text(
						`${format(",.2r")(firstNum)}.${
							secondNum < 10 ? `0${secondNum}` : secondNum
						}`
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
		// const count = setInterval(() => {

		// }, speed)
	}
}
