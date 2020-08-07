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
